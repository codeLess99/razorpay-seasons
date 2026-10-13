// Dashboard language (English / हिंदी).
// The UI is written in English; when Hindi is on, a DOM pass swaps each rendered text node for its Hindi
// version from the dictionary (plus a few rules for dates, counts and composite labels). Customer-facing
// message previews are marked data-notr and are never touched: their language is chosen per message.
import { useEffect, useState } from 'react';
import { hiA } from './hiA';
import { hiB } from './hiB';

export type DashLang = 'en' | 'hi';
const dict: Record<string, string> = { ...hiA, ...hiB };

const days: Record<string, string> = { Mon: 'सोम', Tue: 'मंगल', Wed: 'बुध', Thu: 'गुरु', Fri: 'शुक्र', Sat: 'शनि', Sun: 'रवि' };
const months: Record<string, string> = {
  Jan: 'जन॰', Feb: 'फ़र॰', Mar: 'मार्च', Apr: 'अप्रै॰', May: 'मई', Jun: 'जून', Jul: 'जुला॰', Aug: 'अग॰', Sep: 'सित॰', Oct: 'अक्टू॰', Nov: 'नवं॰', Dec: 'दिस॰',
};
const dateWords: Record<string, string> = { ...days, ...months, AM: 'AM', PM: 'PM', h: 'h', st: '', nd: '', rd: '', th: '' };

const patterns: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^(\d+) of (\d+) ready$/, (m) => `${m[2]} में से ${m[1]} तैयार`],
  [/^Am I ready\? (\d+) of (\d+) done$/, (m) => `क्या मैं तैयार हूँ? ${m[2]} में से ${m[1]} पूरे`],
  [/^(\d+) to approve$/, (m) => `${m[1]} मंज़ूरी के लिए`],
  [/^(\d+) actions to approve$/, (m) => `${m[1]} कदम मंज़ूरी के लिए`],
  [/^On approval, Seasons creates real Razorpay test-mode Payment Links \((.+)\) for the customers shown\. Nothing is sent\.$/,
    (m) => `मंज़ूरी पर Seasons दिखाए गए ग्राहकों के लिए Razorpay टेस्ट मोड में असली Payment Links (${m[1]}) बनाता है। कुछ भेजा नहीं जाता।`],
  [/^(\d+) (marketing|utility) messages? · about ₹(.+)$/, (m) => `${m[1]} ${m[2] === 'marketing' ? 'मार्केटिंग' : 'यूटिलिटी'} मैसेज · लगभग ₹${m[3]}`],
  [/^Charged by your WhatsApp provider, not Razorpay\. Example rate ₹(.+)\/message; your provider’s rate may differ\.$/,
    (m) => `यह ख़र्च आपका WhatsApp प्रोवाइडर लेता है, Razorpay नहीं। उदाहरण दर ₹${m[1]}/मैसेज; आपके प्रोवाइडर की दर अलग हो सकती है।`],
  [/^Next: (.+) by (.+)\.$/, (m) => `अगला: ${tr(m[1])}, ${tr(m[2])} तक।`],
  [/^Saved · (.+)$/, (m) => `सेव किया · ${tr(m[1])}`],
  [/^(\w+) dashboard coming soon\..*$/, (m) => `${tr(m[1])} डैशबोर्ड जल्द आ रहा है।`],
  [/^Show all (\d+) tasks(?: \((\d+) more to do\))?$/, (m) => `सभी ${m[1]} काम दिखाएँ${m[2] ? ` (${m[2]} और बाकी)` : ''}`],
  [/^(\d+) Friday (bookings|doubles) · last seen (\d+) days ago$/, (m) => `शुक्रवार की ${m[1]} ${m[2] === 'doubles' ? 'डबल्स' : 'बुकिंग'} · आख़िरी बार ${m[3]} दिन पहले`],
  [/^Slide (\d+)$/, (m) => `स्लाइड ${m[1]}`],
  [/^The (\w+) layer is switched off in Controls\.$/, (m) => `${tr(m[1])} लेयर नियंत्रण में बंद है।`],
  [/^(\d+) selected$/, (m) => `${m[1]} चुने गए`],
  [/^(\d+) days?$/, (m) => `${m[1]} दिन`],
];

const isDateish = (s: string) => /^[\w\s,.:·–\-+~()/✓]+$/.test(s) && (s.match(/[A-Za-z]+/g) ?? []).every((w) => w in dateWords);
const mapDate = (s: string) => s.replace(/(\d+)(st|nd|rd|th)\b/g, '$1 तारीख़').replace(/[A-Za-z]+/g, (w) => dateWords[w] ?? w);

// Translate one string. Returns null when nothing applies (the English stays).
export function tr(s: string, depth = 0): string {
  return trOrNull(s, depth) ?? s;
}
function trOrNull(s: string, depth = 0): string | null {
  if (s in dict) return dict[s];
  if (!/[A-Za-z]/.test(s)) return null;
  if (isDateish(s)) return mapDate(s);
  for (const [re, fn] of patterns) { const m = s.match(re); if (m) return fn(m); }
  if (depth > 2) return null;
  // Composite labels: "A · B", "A: B", "A (B)". Translate the parts that we know.
  for (const sep of [': ', ' · ']) {
    if (s.includes(sep)) {
      const parts = s.split(sep).map((p) => trOrNull(p, depth + 1));
      if (parts.some((p) => p !== null)) return s.split(sep).map((p, i) => parts[i] ?? p).join(sep);
    }
  }
  const paren = s.match(/^(.+) \((.+)\)$/);
  if (paren) {
    const a = trOrNull(paren[1], depth + 1), b = trOrNull(paren[2], depth + 1);
    if (a !== null || b !== null) return `${a ?? paren[1]} (${b ?? paren[2]})`;
  }
  return null;
}

/* ---------------- language state ---------------- */

let current: DashLang = (() => { try { return localStorage.getItem('seasons-lang') === 'hi' ? 'hi' : 'en'; } catch { return 'en'; } })();
const subs = new Set<(l: DashLang) => void>();
export const getLang = () => current;
export function setLang(l: DashLang) {
  current = l;
  try { localStorage.setItem('seasons-lang', l); } catch { /* storage unavailable */ }
  document.documentElement.lang = l;
  subs.forEach((f) => f(l));
  applyAll();
}
export function useLang(): DashLang {
  const [l, set] = useState(current);
  useEffect(() => { subs.add(set); return () => { subs.delete(set); }; }, []);
  return l;
}

/* ---------------- DOM pass ---------------- */

type Orig = { en: string; hi: string };
const textOrig = new WeakMap<Text, Orig>();
const ATTRS = ['placeholder', 'aria-label', 'title'];
const SKIP = 'textarea, input, script, style, [data-notr]';

function doText(n: Text) {
  const el = n.parentElement;
  if (!el || el.closest(SKIP)) return;
  const val = n.nodeValue ?? '';
  const o = textOrig.get(n);
  if (current === 'en') { if (o && val === o.hi) n.nodeValue = o.en; return; }
  if (o && val === o.hi) return;
  const core = val.trim();
  if (!core) return;
  const t = trOrNull(core);
  if (t === null) return;
  const hi = val.replace(core, t);
  textOrig.set(n, { en: val, hi });
  n.nodeValue = hi;
}

function doAttrs(el: Element) {
  if (el.closest('[data-notr]')) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (v === null) continue;
    const key = `data-en-${a}`;
    const en = el.getAttribute(key);
    if (current === 'en') { if (en !== null) { el.setAttribute(a, en); el.removeAttribute(key); } continue; }
    if (en !== null && v === el.getAttribute(`data-hi-${a}`)) continue; // already Hindi
    const t = trOrNull(v.trim());
    if (t === null) continue;
    el.setAttribute(key, v);
    el.setAttribute(`data-hi-${a}`, t);
    el.setAttribute(a, t);
  }
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) { doText(root as Text); return; }
  if (!(root instanceof Element)) return;
  if (root.matches?.('script, style')) return;
  doAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n: Node | null;
  while ((n = w.nextNode())) {
    if (n.nodeType === Node.TEXT_NODE) doText(n as Text);
    else doAttrs(n as Element);
  }
}

function applyAll() { walk(document.body); }

let started = false;
export function startI18n() {
  if (started) return;
  started = true;
  document.documentElement.lang = current;
  const pending = new Set<Node>();
  let raf = 0;
  const flush = () => { raf = 0; const list = [...pending]; pending.clear(); list.forEach((n) => n.isConnected && walk(n)); };
  new MutationObserver((muts) => {
    if (current === 'en' && !muts.length) return;
    for (const m of muts) {
      if (m.type === 'characterData') pending.add(m.target);
      else if (m.type === 'attributes') pending.add(m.target);
      else m.addedNodes.forEach((n) => pending.add(n));
    }
    if (!raf) raf = requestAnimationFrame(flush);
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  if (current === 'hi') requestAnimationFrame(applyAll);
}
