// POST /api/ask: AI-Navya. Runs as a Vercel Function so the Gemini key never
// reaches the browser. Locally, vite.config.js mounts this same handler.
import { GoogleGenAI } from '@google/genai';
import { buildPersona } from './_lib/persona.js';

const MAX_MESSAGES = 6;
const MAX_CHARS = 300;
const PER_MINUTE = 8;
const PER_DAY = 60;
const hits = new Map(); // ip -> timestamps (best effort: resets when the function cold-starts)

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 86_400_000);
  const lastMinute = list.filter((t) => now - t < 60_000).length;
  if (lastMinute >= PER_MINUTE || list.length >= PER_DAY) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
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

// Gemini 2.5 models take a thinking budget; Gemini 3 models take a thinking level.
function thinkingFor(model) {
  if (/gemini-2\.5/.test(model)) return { thinkingBudget: 0 };
  if (/gemini-3/.test(model)) return { thinkingLevel: 'MINIMAL' };
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
  if (rateLimited(ip)) return send(res, 429, { error: 'slow down' });

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

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const ai = new GoogleGenAI({ apiKey: key });
  const config = {
    systemInstruction: buildPersona(),
    temperature: 0.8,
    maxOutputTokens: 800,
    ...(thinkingFor(model) && { thinkingConfig: thinkingFor(model) }),
  };

  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 12_000));
    const result = await Promise.race([ai.models.generateContent({ model, contents: messages, config }), timeout]);
    const reply = (result.text || '').trim();
    if (!reply) return send(res, 503, { error: 'napping' });
    return send(res, 200, { reply });
  } catch (err) {
    console.error('ask failed:', err?.message);
    return send(res, 503, { error: 'napping' });
  }
}
