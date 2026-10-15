import { navya, portrait, OUTFITS } from '../sprites/navya.js';

const out = document.getElementById('out');
const params = new URLSearchParams(location.search);
const only = params.get('only') || 'outfits';
const scale = +(params.get('scale') || 7);
const show = (label, cv, s = scale) => {
  const wrap = document.createElement('div');
  wrap.style.display = 'inline-block';
  wrap.style.textAlign = 'center';
  const c = document.createElement('canvas');
  c.width = cv.width; c.height = cv.height;
  c.style.width = cv.width * s + 'px';
  c.getContext('2d').drawImage(cv, 0, 0);
  wrap.append(c, document.createElement('br'), label);
  out.append(wrap);
};
if (only === 'outfits') for (const k of Object.keys(OUTFITS)) show(k, navya(k, 'idle'));
if (only === 'poses') {
  ['wave', 'walk'].forEach((p) => [0, 1, 2].forEach((f) => show(`${p}${f}`, navya('home', p, f))));
  show('sit0', navya('study', 'sit', 0));
  show('umbrella', navya('london', 'umbrella'));
}
if (only === 'court') ['ready', 'jump', 'smash', 'follow', 'cheer'].forEach((p) => show(p, navya('court', p)));
if (only === 'faces') ['smile', 'blink', 'talk', 'wink', 'star', 'think'].forEach((e) => show(e, portrait('home', e)));
