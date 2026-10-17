// POST /api/ask: AI-Navya. Runs as a Vercel Function so the Gemini key never
// reaches the browser. Locally, vite.config.js mounts this same handler.
import { GoogleGenAI } from '@google/genai';
import { buildPersona } from './_lib/persona.js';

const MAX_MESSAGES = 6;
const MAX_CHARS = 300;

// The Gemini free tier is shared by every visitor (about 15 requests a minute and
// 500 a day for Flash-Lite), so cap the whole site a little under that, and each
// visitor much lower. In-memory and best-effort: counts reset on a cold start.
const LIMITS = {
  visitor: { perMinute: 4, perDay: 25 },
  site: { perMinute: 12, perDay: 450 },
};
const hits = new Map(); // key -> request timestamps

function overLimit(key, { perMinute, perDay }) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < 86_400_000);
  hits.set(key, list);
  return list.filter((t) => now - t < 60_000).length >= perMinute || list.length >= perDay;
}

function record(...keys) {
  const now = Date.now();
  keys.forEach((k) => hits.get(k).push(now));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) throw new Error('too large');
  }
  return JSON.parse(raw || '{}');
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Gemini 3.5 Flash-Lite already thinks at its lowest ("minimal") level by default,
// which is what a quick chat wants, so it needs no thinking setting. Older 2.5
// models only stop thinking when told to.
function thinkingFor(model) {
  if (/gemini-2\.5/.test(model)) return { thinkingBudget: 0 };
  return undefined;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });

  // only our own pages may call this
  const origin = req.headers.origin;
  try {
    if (!origin || new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'origin' });
  } catch {
    return send(res, 403, { error: 'origin' });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon').split(',')[0].trim();
  const visitor = `ip:${ip}`;
  if (overLimit(visitor, LIMITS.visitor) || overLimit('site', LIMITS.site)) return send(res, 429, { error: 'busy' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return send(res, 503, { error: 'napping' });

  let messages;
  try {
    const body = await readBody(req);
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, parts: [{ text: m.text.replace(/<[^>]*>/g, '').slice(0, MAX_CHARS) }] }));
  } catch {
    return send(res, 400, { error: 'bad request' });
  }
  if (!messages.length || messages[messages.length - 1].role !== 'user') return send(res, 400, { error: 'bad request' });
  while (messages[0].role !== 'user') messages.shift();

  // Flash-Lite has the most generous free tier (15 requests/min, 500/day).
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const ai = new GoogleGenAI({ apiKey: key });
  const config = {
    systemInstruction: buildPersona(),
    maxOutputTokens: 800,
    ...(thinkingFor(model) && { thinkingConfig: thinkingFor(model) }),
  };

  record(visitor, 'site');
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 12_000));
    const result = await Promise.race([ai.models.generateContent({ model, contents: messages, config }), timeout]);
    const reply = (result.text || '').trim();
    if (!reply) return send(res, 503, { error: 'napping' });
    return send(res, 200, { reply });
  } catch (err) {
    console.error('ask failed:', err?.status || '', err?.message);
    // Gemini's own quota ran out: tell the page to come back later
    if (err?.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(err?.message || '')) return send(res, 429, { error: 'busy' });
    return send(res, 503, { error: 'napping' });
  }
}
