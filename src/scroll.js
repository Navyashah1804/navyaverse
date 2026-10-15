// Scroll choreography: pins each scene and scrubs its progress (stage.state.p)
// with the scroll position. Smooth scrolling (Lenis) is desktop-only.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { quill } from './sprites/icons.js';

gsap.registerPlugin(ScrollTrigger);

const TRANSIT_LABELS = { flight: '✈ BOM → LHR', smash: '🏸 SMASH!', paperplane: '✉ PAPER-PLANE MAIL', poem: '🪶 A POEM FOR YOU' };

export let lenis = null;
let poemTrigger = null;

export function scrollToTarget(target) {
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

function sceneExtras(name, tl, el) {
  const card = el.querySelector('.worldcard:not(.worldcard--late)');
  if (card) tl.to(card, { opacity: 0, duration: 0.12, ease: 'none' }, 0.04);

  if (name === 'flight') {
    const pass = el.querySelector('#pass');
    const stamp = el.querySelector('#pass-stamp');
    const cap = el.querySelector('#flight-caption');
    gsap.set(stamp, { rotation: -12 });
    tl.fromTo(pass, { y: () => window.innerHeight * 0.7, opacity: 0 }, { y: 0, opacity: 1, duration: 0.08, ease: 'power2.out' }, 0)
      .fromTo(stamp, { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.03, ease: 'power4.in' }, 0.14)
      .to(pass, { x: 3, yoyo: true, repeat: 3, duration: 0.004 }, 0.17)
      .to(pass, { y: () => -window.innerHeight * 0.8, rotation: -8, opacity: 0, duration: 0.07, ease: 'power2.in' }, 0.25)
      .fromTo(cap, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.45)
      .to(cap, { opacity: 0, duration: 0.04 }, 0.72);
  }
  if (name === 'smash') {
    const burst = el.querySelector('#burst');
    gsap.set(burst, { xPercent: -50, yPercent: -50, scale: 0 });
    tl.fromTo(burst, { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.1, ease: 'back.out(3)' }, 0.42)
      .to(burst, { opacity: 0, duration: 0.08 }, 0.78);
  }
  if (name === 'contact') {
    const late = el.querySelector('.worldcard--late');
    tl.fromTo(late, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.74);
  }
}

function parchment(desktop) {
  const stage = document.querySelector('.parchment-stage');
  const scroll = document.getElementById('scroll');
  const paper = document.getElementById('scroll-paper');
  const rod = document.getElementById('rod-bottom');
  const q = document.getElementById('quill');
  const seal = document.getElementById('seal');
  const inks = [...stage.querySelectorAll('.ink')];
  q.style.backgroundImage = `url(${quill().toDataURL()})`;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: stage, start: 'top top', end: `+=${desktop ? 260 : 200}%`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  poemTrigger = tl.scrollTrigger;
  tl.fromTo(scroll, { y: () => -window.innerHeight * 1.2, rotation: -5 }, { y: 0, rotation: 0, duration: 0.1, ease: 'bounce.out' }, 0)
    .fromTo(paper, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.12, ease: 'none' }, 0.1)
    .fromTo(rod, { y: () => -paper.offsetHeight }, { y: 0, duration: 0.12, ease: 'none' }, 0.1)
    .set(q, { opacity: 1 }, 0.21);

  const writeStart = 0.22;
  const writeEnd = 0.88;
  const per = (writeEnd - writeStart) / inks.length;
  inks.forEach((ink, i) => {
    tl.fromTo(
      ink,
      { clipPath: 'inset(-20% 100% -20% 0%)' },
      {
        clipPath: 'inset(-20% 0% -20% 0%)',
        duration: per * 0.92,
        ease: 'none',
        onUpdate() {
          const r = ink.getBoundingClientRect();
          const s = scroll.getBoundingClientRect();
          const k = this.progress();
          q.style.left = `${r.left - s.left + r.width * k}px`;
          q.style.top = `${r.top - s.top + r.height * 0.5}px`;
        },
      },
      writeStart + i * per,
    );
  });
  tl.set(q, { opacity: 0 }, writeEnd + 0.01)
    .fromTo(seal, { scale: 0, rotation: -30 }, { scale: 1, rotation: -8, duration: 0.05, ease: 'back.out(3)' }, 0.9)
    .to({}, { duration: 0.06 }, 0.94);
}

export function setupScroll(stages, { reduced }) {
  const hudWorld = document.getElementById('hud-world');
  const navLinks = [...document.querySelectorAll('.hud__nav a')];
  const setWorld = (label, id) => {
    if (hudWorld.textContent === label) return;
    hudWorld.textContent = label;
    hudWorld.classList.remove('glitch');
    void hudWorld.offsetWidth;
    hudWorld.classList.add('glitch');
    if (id) navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${id}`)));
  };

  // links to the poem should land after it has been written
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (id === 'poem' && poemTrigger) scrollToTarget(poemTrigger.end - 2);
    else scrollToTarget(el);
    try { history.replaceState(null, '', `#${id}`); } catch { /* sandboxed frames may refuse */ }
  });

  if (!reduced) {
    const fine = matchMedia('(pointer: fine)').matches;
    if (fine) {
      lenis = new Lenis({ lerp: 0.12 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();
    mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
      const { desktop } = ctx.conditions;
      // create triggers in page order so each pin's spacing pushes the later ones down
      document.querySelectorAll('.stage[data-pin], .parchment-stage').forEach((el) => {
        if (el.classList.contains('parchment-stage')) return parchment(desktop);
        const st = el.__stage;
        const len = desktop ? el.dataset.pin : el.dataset.pinMobile || el.dataset.pin;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: `+=${len}%`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(st.state, { p: 0 }, { p: 1, duration: 1, ease: 'none' }, 0);
        sceneExtras(el.dataset.scene, tl, el);
      });
    });
  } else {
    Object.values(stages).forEach((s) => { s.state.p = s.scene.stillP ?? 1; s.render(0, true); });
  }

  // HUD label + nav highlight follow the section in view
  document.querySelectorAll('main > section').forEach((sec) => {
    const label = sec.dataset.world || TRANSIT_LABELS[sec.id];
    if (!label) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => self.isActive && setWorld(label, sec.dataset.world ? sec.id : null),
    });
  });

  // progress plane
  const bar = document.querySelector('.progress');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => bar.style.setProperty('--p', self.progress.toFixed(4)),
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
