// Vercel serverless function: the only place the Gemini key is used.
// The key comes from the GEMINI_API_KEY environment variable set in Vercel (never in the browser).
// If the preferred model name has been retired, it asks Google for the current Flash models and picks one.

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const PREFERRED = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'].filter(Boolean) as string[];
let chosenModel: string | null = null; // remembered while this function instance is warm

type Req = { method?: string; body?: unknown };
type Res = { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void };

const clip = (s: unknown, n: number) => String(s ?? '').slice(0, n);
const apiKey = () => process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.gemini_api_key;

// Ask Google which models this key can use, and pick a current Flash text model.
async function discoverModel(key: string): Promise<string | null> {
  const r = await fetch(`${BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } });
  if (!r.ok) return null;
  const data = await r.json();
  const all: string[] = (data?.models ?? [])
    .filter((m: { supportedGenerationMethods?: string[] }) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
    .map((m: { name: string }) => String(m.name).replace(/^models\//, ''))
    .filter((n: string) => /flash/i.test(n) && !/(image|tts|audio|live|embedding)/i.test(n));
  const stable = all.filter((n) => !/(thinking|exp|preview|lite)/i.test(n));
  for (const p of PREFERRED) if (all.includes(p)) return p;
  return stable.sort().reverse()[0] ?? all.sort().reverse()[0] ?? null;
}

async function generate(model: string, key: string, prompt: string, schema: object, signal: AbortSignal) {
  return fetch(`${BASE}/models/${model}:generateContent`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json', responseSchema: schema },
    }),
  });
}

async function gemini(prompt: string, schema: object) {
  const key = apiKey();
  if (!key) throw new Error('no-key');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    let model = chosenModel ?? PREFERRED[0];
    let r = await generate(model, key, prompt, schema, ctrl.signal);
    if (r.status === 404) {
      const found = await discoverModel(key);
      if (!found) throw new Error('gemini-no-model');
      model = found;
      r = await generate(model, key, prompt, schema, ctrl.signal);
    }
    if (!r.ok) throw new Error(`gemini-${r.status}`);
    chosenModel = model;
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
    return { out: JSON.parse(text), model };
  } finally {
    clearTimeout(t);
  }
}

const lessonsSchema = {
  type: 'OBJECT',
  properties: {
    lessons: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          signal: { type: 'STRING' },
          change: { type: 'STRING' },
          layer: { type: 'STRING', enum: ['year', 'month', 'week'] },
        },
        required: ['signal', 'change', 'layer'],
      },
    },
  },
  required: ['lessons'],
};

const rewriteSchema = { type: 'OBJECT', properties: { message: { type: 'STRING' } }, required: ['message'] };

const MODES: Record<string, string> = {
  hindi: 'Translate it into simple, natural Hindi in Devanagari script, as a small Indian business owner would write to a customer. Keep brand and product names as they are.',
  hinglish: 'Rewrite it in natural Hinglish (Hindi in Latin script mixed with English), as Indian businesses commonly write on WhatsApp.',
  shorter: 'Make it about half as long. Keep only what the customer needs to act.',
  friendlier: 'Make it warmer and more personal, still short and professional. No more than one emoji.',
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as Record<string, unknown>;

  try {
    if (body.task === 'lessons') {
      const prompt = `You help a small Indian merchant learn from their last season, inside Razorpay Seasons.
Merchant: ${clip(body.merchant, 80)} (${clip(body.type, 80)}).
Season: ${clip(body.season, 120)}.
What the numbers showed: ${clip(body.context, 900)}
The merchant's own notes: """${clip(body.notes, 1200)}"""

Turn the notes into 1 to 4 specific changes for the NEXT plan. Each item:
- signal: what happened, in under 10 words, in the merchant's terms.
- change: one concrete change Seasons will make next time (timing, amount, channel, or what to ignore), under 25 words.
- layer: "year" for season planning, "month" for monthly payment timing, "week" for weekly patterns.
Rules: only use facts from the notes and numbers; never invent figures. If something was a one-off (weather, a broken machine, travel), the change is to flag it so it does not distort next year's forecast. Never suggest messaging customers who have not opted in, and never suggest a discount above ${Number(body.discountCap) || 20}%. Plain English.`;
      const { out, model } = await gemini(prompt, lessonsSchema);
      const lessons = (Array.isArray(out?.lessons) ? out.lessons : [])
        .filter((l: Record<string, string>) => l && l.signal && l.change && ['year', 'month', 'week'].includes(l.layer))
        .slice(0, 4)
        .map((l: Record<string, string>) => ({ signal: clip(l.signal, 90), change: clip(l.change, 220), layer: l.layer }));
      if (!lessons.length) throw new Error('empty');
      return res.status(200).json({ lessons, model });
    }

    if (body.task === 'rewrite') {
      const mode = String(body.mode);
      if (!MODES[mode]) return res.status(400).json({ error: 'mode' });
      const prompt = `Rewrite this WhatsApp message that ${clip(body.merchant, 80)} will send to a customer. ${MODES[mode]}
Strict rules:
- Keep every placeholder in curly braces exactly as written, e.g. {first_name}, {parent_name}, {student_name}, {product}, {payment_link}, {page_link}, {autopay_link}.
- Keep every amount, date and percentage exactly the same. Do not add any discount or offer.
- If the original has an opt-out line (Reply STOP to opt out), keep an opt-out line with the word STOP in English.
- Return only the message.
Message:
"""${clip(body.message, 1200)}"""`;
      const { out, model } = await gemini(prompt, rewriteSchema);
      const message = clip(out?.message, 1500).trim();
      if (!message) throw new Error('empty');
      return res.status(200).json({ message, model });
    }

    return res.status(400).json({ error: 'task' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'error';
    return res.status(msg === 'no-key' ? 503 : 502).json({ error: msg });
  }
}
