// Small pixel icons used inside the HTML cards (desserts, trophies, the quill).
import { PixelGrid, baked } from '../engine/pixel.js';
import { trophy } from '../scenes/court.js';
import { portrait } from './navya.js';

const ICONS = {
  berry: () => {
    const g = new PixelGrid(16, 16);
    g.map(2, 1, [
      '....gg.g....',
      '...ggggg....',
      '..rrrrrrr...',
      '.rrrwrrrrr..',
      '.rrrrrrwrr..',
      '.cccccccccc.',
      '.cccccCcccc.',
      '..cccccccc..',
      '..ccCccccc..',
      '...cccccc...',
      '....cccc....',
      '.....cc.....',
    ], { g: '#3E7C59', r: '#E23E57', w: '#FFD6E8', c: '#5C3424', C: '#8A5A3C' });
    return g.outline().canvas();
  },
  chocbar: () => {
    const g = new PixelGrid(16, 16);
    g.rect(3, 2, 10, 12, '#5C3424');
    for (let y = 2; y < 14; y += 4) for (let x = 3; x < 13; x += 5) { g.rect(x, y, 4, 3, '#7A4A30'); g.set(x, y, '#8A5A3C'); }
    g.rect(3, 9, 10, 5, '#FF6FAE'); g.rect(3, 11, 10, 1, '#FFD166');
    return g.outline().canvas();
  },
  cake: () => {
    const g = new PixelGrid(16, 16);
    g.map(1, 3, [
      '......w.......',
      '.....wrw......',
      '...ccccccc....',
      '..cccccccccc..',
      '.ssssssssssss.',
      '.kkkkkkkkkkkk.',
      '.ssssssssssss.',
      '.kkkkkkkkkkkk.',
      '.kkkkkkkkkkkk.',
    ], { w: '#FFFFFF', r: '#E23E57', c: '#3A2016', s: '#FFD6E8', k: '#5C3424' });
    return g.outline().canvas();
  },
  trophy: () => trophy(),
};

export const quill = () =>
  baked('quill', () => {
    const g = new PixelGrid(18, 18);
    for (let i = 0; i < 12; i++) {
      g.set(4 + i, 13 - i, '#FFF8EC');
      g.set(5 + i, 13 - i, i > 2 ? '#E6DCC8' : '#FFF8EC');
      if (i > 3 && i < 11) { g.set(4 + i, 12 - i, '#FFF8EC'); g.set(6 + i, 13 - i, '#D9CBB0'); }
    }
    g.set(2, 15, '#2A1B12'); g.set(3, 14, '#2A1B12'); g.set(3, 15, '#2A1B12');
    return g.outline().canvas();
  });

export function paintIcons() {
  document.querySelectorAll('canvas[data-icon]').forEach((cv) => {
    const src = (ICONS[cv.dataset.icon] && baked(`icon:${cv.dataset.icon}`, ICONS[cv.dataset.icon]));
    if (!src) return;
    cv.width = src.width;
    cv.height = src.height;
    cv.getContext('2d').drawImage(src, 0, 0);
  });
  document.querySelectorAll('canvas[data-portrait]').forEach((cv) => drawPortrait(cv, cv.dataset.portrait));
}

export function drawPortrait(cv, outfit = 'home', expr = 'smile') {
  const src = portrait(outfit, expr);
  cv.width = src.width;
  cv.height = src.height;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, cv.width, cv.height);
  c.drawImage(src, 0, 0);
}
