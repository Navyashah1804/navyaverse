// The speech bubble above Navya's head and the Ask-Navya chat it opens.
// Quick-question chips answer instantly from pre-written answers; questions the
// visitor types go to Gemini (via /api/ask) and come back in Navya's voice.
import { gsap } from 'gsap';
import { fallbackAnswer, CHIP_ANSWERS } from './fallback.js';

const BUBBLE_LINES = ["Hi, I'm Navya! ✿", 'Ask me anything…', '(psst, I am the AI version)', 'Click me! ♡'];
const COOLDOWN_MS = 4000;

export function setupChat(home) {
  const bubble = document.getElementById('bubble');
  const bubbleText = document.getElementById('bubble-text');
  const chat = document.getElementById('chat');
  const log = document.getElementById('chat-log');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const chips = document.getElementById('chat-chips');
  const send = form.querySelector('button');
  let history = [];
  let busy = false;
  let lastAsk = 0;

  let li = 0;
  setInterval(() => {
    if (!chat.hidden) return;
    li = (li + 1) % BUBBLE_LINES.length;
    bubbleText.textContent = BUBBLE_LINES[li];
  }, 3200);

  const open = () => {
    chat.hidden = false;
    bubble.setAttribute('aria-expanded', 'true');
    home.state.waveUntil = gsap.ticker.time + 1.6;
    if (!log.children.length) addMessage('navya', "Hi! I'm AI-Navya ✿ Tap a quick question, or type your own and I'll answer it myself.");
    input.focus({ preventScroll: true });
  };
  const close = () => {
    chat.hidden = true;
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus({ preventScroll: true });
  };
  bubble.setAttribute('aria-expanded', 'false');
  bubble.addEventListener('click', open);
  document.getElementById('chat-close').addEventListener('click', close);
  chat.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.getElementById('chat-reset').addEventListener('click', () => {
    history = [];
    log.textContent = '';
    addMessage('navya', 'Fresh start! What do you want to know? ✿');
  });

  function addMessage(who, text, note) {
    const p = document.createElement('p');
    p.className = `msg msg--${who}`;
    p.textContent = text;
    if (note) {
      const s = document.createElement('small');
      s.textContent = note;
      p.append(s);
    }
    log.append(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  function typeOut(el, text) {
    return new Promise((resolve) => {
      if (document.documentElement.classList.contains('static')) {
        el.textContent = text;
        return resolve();
      }
      let i = 0;
      home.state.talking = true;
      const iv = setInterval(() => {
        i += 2;
        el.textContent = text.slice(0, i);
        log.scrollTop = log.scrollHeight;
        if (i >= text.length) {
          clearInterval(iv);
          home.state.talking = false;
          resolve();
        }
      }, 24);
    });
  }

  async function reply(question, getAnswer) {
    if (busy) return;
    busy = true;
    send.disabled = true;
    addMessage('you', question);
    history.push({ role: 'user', text: question });
    const bubbleEl = addMessage('navya', '• • •');
    bubbleEl.classList.add('msg--typing');
    home.state.thinking = true;

    const { text, note } = await getAnswer();

    home.state.thinking = false;
    bubbleEl.classList.remove('msg--typing');
    bubbleEl.textContent = '';
    history.push({ role: 'model', text });
    await typeOut(bubbleEl, text);
    if (note) {
      const s = document.createElement('small');
      s.textContent = note;
      bubbleEl.append(s);
    }
    busy = false;
    send.disabled = false;
  }

  // a quick-question chip: instant, pre-written, no API call
  function askChip(question) {
    const answer = CHIP_ANSWERS[question] || fallbackAnswer(question);
    return reply(question, async () => {
      await new Promise((r) => setTimeout(r, 450));
      return { text: answer };
    });
  }

  // the visitor's own question: Gemini answers in Navya's voice
  async function askOwn(q) {
    const question = q.trim().slice(0, 300);
    if (!question || busy) return;
    const wait = COOLDOWN_MS - (Date.now() - lastAsk);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastAsk = Date.now();
    return reply(question, async () => {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-6) }),
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (res.status === 429) {
          return { text: fallbackAnswer(question), note: '(Lots of people are asking me things right now, so this is a pre-recorded answer. Try again in a minute ✿)' };
        }
        if (!res.ok) throw new Error(String(res.status));
        const { reply: text } = await res.json();
        if (!text) throw new Error('empty');
        return { text };
      } catch {
        return { text: fallbackAnswer(question), note: '(AI-Navya is napping, so this is a pre-recorded answer ✿)' };
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    askOwn(q);
  });
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) askChip(b.textContent);
  });
}
