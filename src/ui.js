// Page interactions: pause menu, RPG dialog, London hotspots, outfit mirror,
// the validation to-do list, contact buttons and a couple of easter eggs.
import { gsap } from 'gsap';
import { navya, OUTFITS } from './sprites/navya.js';
import { drawPortrait } from './sprites/icons.js';
import { scrollToTarget } from './scroll.js';

const $ = (sel) => document.querySelector(sel);
const now = () => gsap.ticker.time;

// ---------- toast ----------
let toastTimer;
export function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

// ---------- RPG dialog with typewriter ----------
let typing;
let hideTimer;
export function say(text, { outfit = 'home', expr = 'smile' } = {}) {
  const box = $('#dialog');
  const out = $('#dialog-text');
  drawPortrait($('#dialog-portrait'), outfit, expr);
  box.hidden = false;
  clearInterval(typing);
  clearTimeout(hideTimer);
  const reduced = document.documentElement.classList.contains('static');
  if (reduced) out.textContent = text;
  else {
    let i = 0;
    out.textContent = '';
    typing = setInterval(() => {
      i += 2;
      out.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(typing);
    }, 28);
  }
  hideTimer = setTimeout(() => { box.hidden = true; }, Math.max(6000, text.length * 70));
}

function londonTimeString() {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }).format(new Date());
}

const LINES = {
  suitcase: { text: 'Packed since birth. Six countries stamped so far, and the next one is loading… ✈', expr: 'star', card: '#card-travel' },
  boutique: { text: 'Give me a theme and I will build you an outfit. Try the mirror below!', expr: 'wink', card: '#card-fashion' },
  cafe: { text: 'Window seat, something chocolatey, good company. That is the perfect afternoon.', expr: 'star', card: '#card-desserts' },
  booth: { text: 'Every trip needs a soundtrack. Mine is mostly Arijit Singh, plus Elvis on repeat.', expr: 'smile', card: '#card-music' },
  quill: { text: 'Keep scrolling past London. I left a poem for you. ♡', expr: 'wink', card: '#card-poetry' },
  guard: { text: '…he did not even blink. Tough crowd.', expr: 'think' },
};

function setupHotspots(stages) {
  const london = stages.london;
  document.querySelectorAll('.hotspot').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.say;
      if (key === 'umbrella') {
        london.state.umbrella = !london.state.umbrella;
        london.lastP = -1;
        say(london.state.umbrella ? 'London weather: handled. ☂' : 'Okay fine, a little drizzle never hurt anyone.', { outfit: 'london', expr: 'wink' });
        return;
      }
      if (key === 'bigben') {
        say(`It's ${londonTimeString()} in London right now. Big Ben is telling the real time, by the way.`, { outfit: 'london', expr: 'smile' });
        return;
      }
      if (key === 'cat') {
        say('The cat is also seeking academic validation. We are the same.', { outfit: 'study', expr: 'wink' });
        stages.study.state.expr = 'wink';
        stages.study.state.exprUntil = now() + 2;
        stages.study.lastP = -1;
        return;
      }
      const line = LINES[key];
      if (!line) return;
      london.state.expr = line.expr;
      london.state.exprUntil = now() + 2.5;
      london.lastP = -1;
      say(line.text, { outfit: 'london', expr: line.expr });
    });
  });
  $('#dialog-close').addEventListener('click', () => { $('#dialog').hidden = true; });
}

// ---------- outfit mirror ----------
function setupMirror() {
  const order = ['home', 'night', 'london', 'blazer', 'festive', 'court', 'study'];
  let i = 0;
  const cv = $('#outfit-canvas');
  const name = $('#outfit-name');
  const paint = () => {
    const spr = navya(order[i], 'idle', 0, 'smile');
    cv.width = spr.width;
    cv.height = spr.height;
    const c = cv.getContext('2d');
    c.clearRect(0, 0, cv.width, cv.height);
    c.drawImage(spr, 0, 0);
    name.textContent = OUTFITS[order[i]].name;
  };
  $('#outfit-prev').addEventListener('click', () => { i = (i + order.length - 1) % order.length; paint(); });
  $('#outfit-next').addEventListener('click', () => { i = (i + 1) % order.length; paint(); });
  paint();
}

// ---------- validation to-do ----------
function burst(chars, n = 26) {
  for (let k = 0; k < n; k++) {
    const el = document.createElement('span');
    el.className = 'confetti';
    el.textContent = chars[k % chars.length];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${1.6 + Math.random() * 1.6}s`;
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.append(el);
    setTimeout(() => el.remove(), 4000);
  }
}

function setupTodo(stages) {
  const boxes = [...document.querySelectorAll('#todo input')];
  const bar = $('#meter-bar');
  const text = $('#meter-text');
  const meter = $('#meter');
  const study = stages.study;
  const update = (src) => {
    const done = boxes.filter((b) => b.checked).length;
    const v = 40 + done * 10;
    bar.setAttribute('aria-valuenow', v);
    bar.querySelector('i').style.setProperty('--v', `${v}%`);
    const left = boxes.length - done;
    text.textContent = left ? `${v}%: needs ${left} more "great job!"${left > 1 ? 's' : ''}` : '100%: VALIDATED ✧ achievement unlocked';
    study.state.todos = boxes.map((b) => b.checked);
    study.lastP = -1;
    if (src?.checked) {
      const r = src.getBoundingClientRect();
      const f = document.createElement('span');
      f.className = 'float-up';
      f.textContent = '+1 validation ♡';
      f.style.left = `${r.right + 8}px`;
      f.style.top = `${r.top}px`;
      document.body.append(f);
      setTimeout(() => f.remove(), 1000);
    }
    if (!left && src?.checked) {
      meter.classList.add('full');
      setTimeout(() => meter.classList.remove('full'), 2000);
      burst(['♥', '✧', '★', '🎀']);
      toast('ACHIEVEMENT UNLOCKED ✧ Validated.');
      study.state.expr = 'star';
      study.state.exprUntil = now() + 3;
    }
  };
  boxes.forEach((b) => b.addEventListener('change', () => update(b)));
  update();
}

// ---------- pause menu ----------
function setupPause() {
  const menu = $('#pause-menu');
  const open = () => { menu.hidden = false; menu.querySelector('a').focus(); };
  const close = () => { menu.hidden = true; $('#menu-open').focus(); };
  $('#menu-open').addEventListener('click', open);
  $('#menu-close').addEventListener('click', close);
  menu.addEventListener('click', (e) => {
    if (e.target === menu) close();
    if (e.target.closest('a')) menu.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) close();
    $('#dialog').hidden = true;
  });
}

// ---------- contact ----------
function setupContact(stages) {
  const copy = $('#copy-email');
  copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      toast('Copied! ✿');
    } catch {
      toast(email);
    }
  });
  $('#continue-yes').addEventListener('click', () => {
    stages.home.state.waveUntil = now() + 3;
    scrollToTarget(0);
  });
  $('#continue-no').addEventListener('click', () => {
    stages.contact.state.waveUntil = now() + 3;
    stages.contact.lastP = -1;
    say('Rude ✿ …just kidding. See you around!', { outfit: 'night', expr: 'wink' });
  });
}

// ---------- easter eggs ----------
function setupEggs() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    pos = e.key === code[pos] ? pos + 1 : e.key === code[0] ? 1 : 0;
    if (pos === code.length) {
      pos = 0;
      burst(['🍓', '🍫', '🍰', '♥'], 40);
      toast('CHEAT CODE: infinite dessert ✿');
    }
  });
  console.log('%c♥ Hi! You found the back door. ✿ — Navya', 'font: 14px monospace; color: #ff6fae;');
}

export function setupUI(stages, { reduced }) {
  if (reduced) stages.home.state.waveUntil = -1;
  stages.court.state.score = { a: $('#score-a'), b: $('#score-b') };
  setupHotspots(stages);
  setupMirror();
  setupTodo(stages);
  setupPause();
  setupContact(stages);
  setupEggs();
}
