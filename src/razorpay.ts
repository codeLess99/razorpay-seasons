import { TestLink } from './state';

// Ask our server function to create Payment Links in Razorpay TEST mode.
export async function createTestLinks(customers: string[], amount: number, description: string, merchant: string):
  Promise<{ ok: true; links: TestLink[] } | { ok: false; reason: string }> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch('/api/razorpay', {
      method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customers, amount, description, merchant }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, reason: d?.error === 'no-key' ? 'Razorpay test keys not set up' : 'Razorpay unavailable right now' };
    return { ok: true, links: (d.results ?? []).map((x: { name: string; url?: string; ok: boolean }) => ({ name: x.name, url: x.url, ok: x.ok })) };
  } catch {
    return { ok: false, reason: 'Razorpay unavailable right now' };
  } finally {
    window.clearTimeout(t);
  }
}
