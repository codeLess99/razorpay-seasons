import { Layer, Merchant, lessonsFromFeedback } from './data';
import { getLang } from './i18n';

export type LessonOut = { signal: string; change: string; layer: Layer };
export type AiResult<T> = { ok: true; value: T; source: 'gemini' } | { ok: false; value: T; source: 'fallback'; reason: string };

async function call(body: object, timeoutMs = 28000) {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error === 'no-key' ? 'AI key not set up yet' : 'AI unavailable right now');
    return data;
  } catch (e) {
    throw new Error(e instanceof Error && e.message.startsWith('AI') ? e.message : 'AI unavailable right now');
  } finally {
    window.clearTimeout(t);
  }
}

/* -------- Review & learn: notes -> changes for next plan -------- */

export async function aiLessons(m: Merchant, notes: string, discountCap: number): Promise<AiResult<LessonOut[]>> {
  const context = [
    ...m.review.series.map((s) => `${s.label}: forecast ₹${s.forecast}, actual ₹${s.actual}`),
    ...m.review.outcomes.map((o) => `${o.action}: ${o.result}`),
  ].join('; ');
  try {
    const d = await call({ task: 'lessons', lang: getLang(), merchant: m.name, type: m.type, season: `${m.review.title} (${m.review.period})`, context, notes, discountCap });
    if (!Array.isArray(d.lessons) || !d.lessons.length) throw new Error('AI unavailable right now');
    return { ok: true, value: d.lessons, source: 'gemini' };
  } catch (e) {
    return { ok: false, value: lessonsFromFeedback(notes, m.id), source: 'fallback', reason: (e as Error).message };
  }
}

/* -------- Approval panel: rewrite a message, then check it -------- */

const placeholders = (s: string) => (s.match(/\{[a-z_]+\}/g) ?? []).sort();
const percents = (s: string) => (s.match(/\d+\s?%/g) ?? []).map((x) => x.replace(/\s/g, ''));
const amounts = (s: string) => (s.match(/₹\s?[\d,]+/g) ?? []).map((x) => x.replace(/[\s,]/g, ''));

export function checkRewrite(original: string, rewritten: string, cap: number): string[] {
  const problems: string[] = [];
  const need = new Set(placeholders(original));
  const have = new Set(placeholders(rewritten));
  const missing = [...need].filter((p) => !have.has(p));
  if (missing.length) problems.push(`dropped ${missing.join(', ')}`);
  const extra = [...have].filter((p) => !need.has(p));
  if (extra.length) problems.push(`added unknown ${extra.join(', ')}`);
  if (/\bSTOP\b/.test(original) && !/\bSTOP\b/.test(rewritten)) problems.push('removed the STOP opt-out');
  const origPct = new Set(percents(original));
  const newPct = percents(rewritten).filter((p) => !origPct.has(p));
  if (newPct.length) problems.push(`added a discount (${newPct.join(', ')})`);
  if (percents(rewritten).some((p) => parseInt(p, 10) > cap)) problems.push(`discount above your ${cap}% limit`);
  const origAmt = new Set(amounts(original));
  const newAmt = amounts(rewritten).filter((a) => !origAmt.has(a));
  if (newAmt.length) problems.push(`changed an amount (${newAmt.join(', ')})`);
  return problems;
}

export type RewriteMode = 'hindi' | 'hinglish' | 'shorter' | 'friendlier';

export async function aiRewrite(merchant: string, message: string, mode: RewriteMode, cap: number):
  Promise<{ ok: true; message: string } | { ok: false; reason: string }> {
  try {
    const d = await call({ task: 'rewrite', merchant, message, mode });
    const out = String(d.message ?? '').trim();
    if (!out) return { ok: false, reason: 'AI returned nothing' };
    const problems = checkRewrite(message, out, cap);
    if (problems.length) return { ok: false, reason: `Rejected by Seasons’ checks: ${problems.join('; ')}` };
    return { ok: true, message: out };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}
