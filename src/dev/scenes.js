// Dev-only: render one scene at a fixed progress, e.g. /scenes.html?scene=london&p=0.3
import { gsap } from 'gsap';
import { Stage, tick } from '../engine/stage.js';
import { homeScene } from '../scenes/home.js';
import { flightScene } from '../scenes/flight.js';
import { londonScene } from '../scenes/london.js';
import { courtScene } from '../scenes/court.js';
import { studyScene } from '../scenes/study.js';
import { contactScene } from '../scenes/contact.js';
import { smashScene, paperPlaneScene } from '../scenes/transitions.js';

const SCENES = { home: homeScene, flight: flightScene, london: londonScene, court: courtScene, study: studyScene, contact: contactScene, smash: smashScene, paperplane: paperPlaneScene };
const q = new URLSearchParams(location.search);
const el = document.getElementById('stage');
if (q.get('w')) { el.style.width = q.get('w') + 'px'; el.style.height = q.get('h') + 'px'; }
const st = new Stage(el, SCENES[q.get('scene') || 'home']);
st.state.p = +(q.get('p') ?? 0.5);
st.state.todos = [true, true, false, false, false, false];
st.state.waveUntil = -1;
gsap.ticker.add(() => tick(gsap.ticker.time + 5));

// /scenes.html?scene=home&w=1200&h=630&og=1 renders and saves the link-preview image + favicon.
if (q.get('og')) {
  Promise.all([
    import('@fontsource/press-start-2p/400.css'),
    import('@fontsource/pixelify-sans/400.css'),
  ]).then(async () => {
    await document.fonts.load('48px "Press Start 2P"');
    await document.fonts.load('28px "Pixelify Sans"');
    await new Promise((r) => setTimeout(r, 800));
    const og = document.createElement('canvas');
    og.width = 1200;
    og.height = 630;
    const c = og.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.drawImage(st.canvas, 0, 0, st.W * st.s, st.H * st.s);
    c.fillStyle = 'rgba(26,20,35,0.78)';
    c.fillRect(48, 150, 600, 300);
    c.font = '64px "Press Start 2P"';
    c.fillStyle = '#FF6FAE';
    c.fillText('NAVYA', 76, 250);
    c.fillText('SHAH', 76, 336);
    c.fillStyle = '#FFF8EC';
    c.fillText('NAVYA', 70, 244);
    c.fillText('SHAH', 70, 330);
    c.font = '28px "Pixelify Sans"';
    c.fillStyle = '#FFD166';
    c.fillText('the NavyaVerse: a pixel-world portfolio', 70, 420);
    const save = (name, cv) => fetch(`/__dev/save?name=${name}`, { method: 'POST', body: cv.toDataURL('image/png') });
    await save('og-image.png', og);

    const fav = document.createElement('canvas');
    fav.width = 64;
    fav.height = 64;
    const f = fav.getContext('2d');
    f.imageSmoothingEnabled = false;
    const heart = ['..oo...oo..', '.oppo.oppo.', 'opwppoppppo', 'oppppppppppo'.slice(0, 11), 'oppppppppppo'.slice(0, 11), '.oppppppppo', '..oppppppo.', '...oppppo..', '....oppo...', '.....oo....'];
    f.fillStyle = '#2B1B4A';
    f.fillRect(0, 0, 64, 64);
    const pal = { o: '#1A1423', p: '#FF6FAE', w: '#FFD6E8' };
    heart.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) { f.fillStyle = pal[ch]; f.fillRect(4 + x * 5, 7 + y * 5, 5, 5); } }));
    await save('favicon.png', fav);
    document.title = 'saved';
  });
}
