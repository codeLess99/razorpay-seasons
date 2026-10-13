// Vercel serverless function: creates Payment Links in Razorpay TEST MODE when a merchant approves a message.
// Keys come from RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET set in Vercel. Live keys are refused.
// Razorpay's own SMS/email notifications are switched off, so nothing is sent to anyone.

type Req = { method?: string; body?: unknown };
type Res = { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void };

const env = (names: string[]) => {
  for (const n of names) if (process.env[n]) return String(process.env[n]).trim();
  const lower = names.map((n) => n.toLowerCase());
  for (const [k, v] of Object.entries(process.env)) if (lower.includes(k.toLowerCase()) && v) return String(v).trim();
  return '';
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as Record<string, unknown>;

  const keyId = env(['RAZORPAY_KEY_ID', 'Razorpay_Key_Id', 'RAZORPAY_KEYID']);
  const secret = env(['RAZORPAY_KEY_SECRET', 'Razorpay_Key_Secret', 'RAZORPAY_SECRET']);
  if (!keyId || !secret) return res.status(503).json({ error: 'no-key' });
  if (!keyId.startsWith('rzp_test_')) return res.status(403).json({ error: 'live-key-refused' });

  const amountRupees = Math.round(Number(body.amount));
  if (!Number.isFinite(amountRupees) || amountRupees < 1 || amountRupees > 50000) return res.status(400).json({ error: 'amount' });
  const names = (Array.isArray(body.customers) ? body.customers : []).map((n) => String(n).slice(0, 60)).filter(Boolean).slice(0, 8);
  if (!names.length) return res.status(400).json({ error: 'customers' });
  const description = String(body.description ?? 'Payment').slice(0, 200);
  const merchant = String(body.merchant ?? '').slice(0, 60);

  const auth = 'Basic ' + Buffer.from(`${keyId}:${secret}`).toString('base64');
  const stamp = Date.now().toString(36);

  const results = await Promise.all(names.map(async (name, i) => {
    try {
      const r = await fetch('https://api.razorpay.com/v1/payment_links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({
          amount: amountRupees * 100,
          currency: 'INR',
          description,
          customer: { name },
          notify: { sms: false, email: false },
          reminder_enable: false,
          reference_id: `seasons-${stamp}-${i}`,
          notes: { source: 'Razorpay Seasons prototype (test mode)', merchant },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return { name, ok: false, error: d?.error?.description ?? `razorpay-${r.status}` };
      return { name, ok: true, id: d.id, url: d.short_url, status: d.status };
    } catch {
      return { name, ok: false, error: 'network' };
    }
  }));

  const created = results.filter((r) => r.ok);
  if (!created.length) return res.status(502).json({ error: results[0]?.error ?? 'failed', results });
  return res.status(200).json({ mode: 'test', results });
}
