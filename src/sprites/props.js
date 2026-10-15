// Props: vehicles, street furniture, little creatures. Small ones are baked into
// outlined sprites; big architectural pieces are drawn straight onto the stage.
import { PixelGrid, baked, rect, px, circle, line, poly, dither, text, ellipse, OUTLINE } from '../engine/pixel.js';

const RED = '#D62828';
const RED_SH = '#A31D1D';
const RED_HI = '#F04A4A';
const GLASS = '#2C3E5C';
const GLASS_HI = '#7FA6C9';

function wheel(g, cx, cy, r) {
  g.ellipse(cx, cy, r, r, '#2B2B33');
  g.ellipse(cx, cy, Math.max(1, r - 2), Math.max(1, r - 2), '#BFC4CC');
  g.set(cx, cy, '#2B2B33');
}

// London double-decker, facing right. 66×36.
export const bus = (frame = 0) =>
  baked(`bus${frame}`, () => {
    const g = new PixelGrid(68, 38);
    g.rect(2, 3, 62, 28, RED);
    g.set(2, 3, null); g.set(63, 3, null);
    g.rect(3, 3, 60, 1, RED_HI);
    for (let i = 0; i < 6; i++) {
      g.rect(5 + i * 10, 6, 8, 6, GLASS);
      g.set(6 + i * 10, 7, GLASS_HI); g.set(7 + i * 10, 7, GLASS_HI);
    }
    g.rect(2, 14, 62, 1, '#F4E9D0');
    for (let i = 0; i < 4; i++) {
      g.rect(5 + i * 11, 17, 9, 6, GLASS);
      g.set(6 + i * 11, 18, GLASS_HI);
    }
    g.rect(50, 17, 6, 12, GLASS); g.rect(52, 17, 1, 12, RED_SH);
    g.rect(58, 17, 5, 6, GLASS); g.set(59, 18, GLASS_HI);
    g.rect(2, 29, 62, 2, RED_SH);
    g.rect(57, 5, 6, 7, '#1A1423');
    g.set(63, 26, '#FFE8A3'); g.set(63, 27, '#FFE8A3');
    wheel(g, 13, 31, 4);
    wheel(g, 52, 31, 4);
    if (frame) { g.set(13, 29, '#2B2B33'); g.set(52, 29, '#2B2B33'); }
    return g.outline().canvas();
  });

// Mumbai kaali-peeli taxi, facing right. 36×18.
export const taxi = () =>
  baked('taxi', () => {
    const g = new PixelGrid(38, 19);
    g.rect(2, 8, 33, 6, '#26242C');
    g.rect(2, 8, 33, 1, '#3A3742');
    g.rect(12, 2, 13, 1, '#F6C915');
    g.rect(10, 3, 17, 5, '#F6C915');
    g.rect(12, 4, 6, 3, GLASS); g.rect(19, 4, 6, 3, GLASS);
    g.set(13, 4, GLASS_HI); g.set(20, 4, GLASS_HI);
    g.rect(16, 1, 5, 1, '#F6C915');
    g.rect(1, 12, 2, 1, '#BFC4CC'); g.rect(34, 12, 2, 1, '#BFC4CC');
    g.set(35, 9, '#FFE8A3'); g.set(2, 9, RED);
    wheel(g, 9, 14, 3);
    wheel(g, 28, 14, 3);
    return g.outline().canvas();
  });

// Navya Air plane, facing right. 58×24.
export const plane = (blink = 0) =>
  baked(`plane${blink}`, () => {
    const g = new PixelGrid(60, 26);
    const W = '#F7F4F8';
    g.rect(7, 9, 44, 8, W);
    g.rect(51, 10, 3, 6, W); g.rect(54, 11, 2, 4, W); g.set(56, 12, W); g.set(56, 13, W);
    for (let r = 0; r < 9; r++) g.rect(2 + Math.floor(r / 3), 1 + r, 5 + Math.floor(r / 2), 1, W);
    g.rect(7, 13, 47, 1, '#FF6FAE');
    g.rect(7, 16, 44, 1, '#D9D4E6');
    for (let x = 15; x <= 45; x += 3) g.set(x, 11, GLASS);
    g.rect(49, 10, 3, 2, GLASS);
    const heart = ['.p.p.', 'ppppp', '.ppp.', '..p..'];
    g.map(3, 3, heart, { p: '#FF4FA3' });
    for (let r = 0; r < 7; r++) g.rect(24 - r, 15 + r, 12 - Math.floor(r / 2), 1, '#D9D4E6');
    g.rect(24, 17, 7, 3, '#BFC4CC'); g.set(30, 18, '#8E93A0');
    if (blink) g.set(17, 22, '#FF4D4D');
    return g.outline().canvas();
  });

// Shuttlecock pointing down-left. 22×22.
export const shuttle = () =>
  baked('shuttle', () => {
    const g = new PixelGrid(22, 22);
    for (let i = 0; i < 12; i++) {
      const x0 = 6 + i * 0.4, y0 = 14 - i * 0.4;
      g.stroke(Math.round(x0), Math.round(y0), 9 + i, Math.round(1 + i * 0.35), '#FFFFFF', 1);
    }
    g.stroke(7, 13, 18, 3, '#D9D4E6', 1);
    g.stroke(9, 14, 20, 8, '#D9D4E6', 1);
    g.rect(11, 3, 9, 1, '#FF6FAE');
    g.ellipse(5, 16, 3, 3, '#F4F1E8');
    g.stroke(4, 13, 8, 17, '#FF4FA3', 1);
    return g.outline().canvas();
  });

// Sleeping cat loaf. Tail frame 0..2.
export const cat = (frame = 0) =>
  baked(`cat${frame}`, () => {
    const g = new PixelGrid(22, 13);
    const F = '#F4EFEA', P = '#8C8496';
    g.ellipse(10, 8, 7, 3, F);
    g.rect(3, 4, 6, 5, F);
    g.set(3, 3, F); g.set(4, 2, F); g.set(7, 3, F); g.set(8, 2, F);
    g.set(4, 3, '#F2A7BB'); g.set(8, 3, '#F2A7BB');
    g.rect(11, 6, 4, 2, P); g.rect(14, 8, 3, 2, P);
    g.set(4, 6, '#1A1423'); g.set(5, 6, '#1A1423'); g.set(7, 6, '#1A1423'); g.set(8, 6, '#1A1423');
    g.set(6, 7, '#F2A7BB');
    const tail = [[[17, 9], [19, 8], [20, 6]], [[17, 9], [19, 9], [20, 8]], [[17, 9], [19, 10], [20, 10]]][frame % 3];
    tail.forEach(([x, y]) => { g.set(x, y, P); g.set(x, y + 1, P); });
    return g.outline().canvas();
  });

export const phoneBooth = () =>
  baked('booth', () => {
    const g = new PixelGrid(16, 40);
    g.rect(1, 4, 14, 34, RED);
    g.rect(2, 1, 12, 3, RED); g.rect(4, 0, 8, 1, RED);
    g.rect(2, 5, 12, 2, '#1A1423');
    for (let x = 3; x < 13; x += 2) g.set(x, 6, '#F4F1E8');
    g.rect(3, 9, 10, 20, '#F6E7A8');
    for (let y = 9; y < 29; y += 4) g.rect(3, y, 10, 1, RED_SH);
    for (let x = 3; x < 13; x += 5) g.rect(x + 2, 9, 1, 20, RED_SH);
    g.rect(1, 37, 14, 1, RED_SH);
    g.rect(14, 4, 1, 34, RED_SH);
    g.set(12, 22, '#1A1423');
    return g.outline().canvas();
  });

export const guard = (blink = 0) =>
  baked(`guard${blink}`, () => {
    const g = new PixelGrid(12, 34);
    g.ellipse(6, 5, 4, 5, '#1A1423');
    g.rect(2, 4, 9, 6, '#1A1423');
    g.set(4, 2, '#3A3350'); g.set(5, 3, '#3A3350');
    g.rect(3, 10, 6, 3, '#C68A63');
    if (!blink) { g.set(4, 11, '#1A1423'); g.set(7, 11, '#1A1423'); } else { g.set(4, 11, '#A56B4B'); g.set(7, 11, '#A56B4B'); }
    g.rect(2, 13, 8, 9, RED); g.rect(2, 19, 8, 1, '#F4F1E8');
    g.set(6, 15, '#FFD166'); g.set(6, 17, '#FFD166');
    g.rect(1, 13, 1, 8, RED); g.rect(10, 13, 1, 8, RED);
    g.rect(3, 22, 3, 9, '#1A1423'); g.rect(6, 22, 3, 9, '#1A1423');
    g.rect(5, 22, 1, 9, RED);
    g.rect(2, 31, 4, 2, '#0B0810'); g.rect(6, 31, 4, 2, '#0B0810');
    return g.outline().canvas();
  });

export const postbox = () =>
  baked('postbox', () => {
    const g = new PixelGrid(14, 26);
    g.rect(2, 4, 10, 18, RED);
    g.rect(1, 2, 12, 3, RED); g.rect(3, 1, 8, 1, RED);
    g.rect(3, 8, 8, 1, '#1A1423');
    g.rect(1, 22, 12, 3, '#26242C');
    g.rect(11, 4, 1, 18, RED_SH);
    g.set(3, 5, RED_HI); g.set(3, 6, RED_HI);
    g.rect(5, 12, 4, 3, '#FFD166');
    return g.outline().canvas();
  });

export const suitcase = () =>
  baked('suitcase', () => {
    const g = new PixelGrid(14, 15);
    g.rect(1, 4, 12, 10, '#FF8FC7');
    g.rect(5, 1, 4, 1, '#3A3350'); g.set(5, 2, '#3A3350'); g.set(8, 2, '#3A3350'); g.set(5, 3, '#3A3350'); g.set(8, 3, '#3A3350');
    g.rect(1, 8, 12, 1, '#E86AA6');
    g.rect(3, 5, 3, 2, '#FFD166'); g.rect(8, 10, 3, 2, '#A2D2FF'); g.set(10, 5, '#B8F2E6'); g.set(11, 6, '#B8F2E6');
    return g.outline().canvas();
  });

// ---------- big pieces drawn straight on the stage ----------

export function lampPost(ctx, x, groundY, h = 34, lit = true, t = 0) {
  if (lit) {
    dither(ctx, x - 6, groundY - h - 6, 13, 12, '#FFE8A3', 0);
  }
  rect(ctx, x, groundY - h, 2, h, '#1A1423');
  rect(ctx, x - 1, groundY - 3, 4, 3, '#1A1423');
  rect(ctx, x - 2, groundY - h - 5, 6, 1, '#1A1423');
  rect(ctx, x - 2, groundY - h - 4, 6, 4, lit ? '#FFE8A3' : '#5A6273');
  rect(ctx, x - 1, groundY - h - 6, 4, 1, '#1A1423');
  px(ctx, x, groundY - h - 7, '#1A1423');
  rect(ctx, x - 2, groundY - h, 6, 1, '#1A1423');
}

export function palm(ctx, x, groundY, h = 40, t = 0, dark = '#3E7C59', lite = '#5FA372', trunk = '#7A5A3C') {
  const sway = Math.round(Math.sin(t * 0.8) * 1);
  for (let i = 0; i < h; i++) {
    const bx = x + Math.round(Math.sin(i / h * 1.4) * 4);
    rect(ctx, bx, groundY - i, 3, 1, i % 4 === 0 ? '#5E4430' : trunk);
  }
  const tx = x + Math.round(Math.sin(1.4) * 4) + 1;
  const ty = groundY - h;
  const fronds = [[-14, 4], [-9, 9], [14, 4], [9, 9], [-11, -3], [11, -3], [0, -6]];
  fronds.forEach(([dx, dy], i) => {
    const ex = tx + dx + sway;
    const ey = ty + dy;
    line(ctx, tx, ty, ex, ey, i % 2 ? lite : dark);
    line(ctx, tx, ty + 1, ex, ey + 1, dark);
  });
  circle(ctx, tx, ty + 1, 2, '#5E4430');
}

export function chaiStall(ctx, x, groundY, open = true) {
  // little cart with a striped awning
  rect(ctx, x, groundY - 14, 30, 12, '#8C5A3C');
  rect(ctx, x, groundY - 14, 30, 1, '#A8714D');
  rect(ctx, x + 2, groundY - 12, 26, 1, '#6B4430');
  circle(ctx, x + 6, groundY - 2, 2, '#2B2B33');
  circle(ctx, x + 24, groundY - 2, 2, '#2B2B33');
  rect(ctx, x + 1, groundY - 28, 1, 14, '#5E4430');
  rect(ctx, x + 28, groundY - 28, 1, 14, '#5E4430');
  for (let i = 0; i < 8; i++) rect(ctx, x - 2 + i * 4, groundY - 31, 4, 4, i % 2 ? '#FFF4E6' : '#F7864E');
  for (let i = 0; i < 8; i++) px(ctx, x - 1 + i * 4, groundY - 27, i % 2 ? '#FFF4E6' : '#F7864E');
  rect(ctx, x + 8, groundY - 24, 15, 7, '#1A1423');
  text(ctx, 'CHAI', x + 16, groundY - 23, open ? '#FFD166' : '#8C8496', 'center');
  // kettle and cups
  rect(ctx, x + 4, groundY - 18, 5, 4, '#BFC4CC'); px(ctx, x + 9, groundY - 17, '#BFC4CC');
  [14, 18, 22].forEach((cx) => rect(ctx, x + cx, groundY - 16, 2, 2, '#E9EEF5'));
  if (open) dither(ctx, x + 5, groundY - 22, 2, 3, '#E9EEF5', 0);
}

export function bigBen(ctx, x, groundY, h, t, clockTime) {
  const stone = '#C9A66B', stoneSh = '#8C6B3F', stoneHi = '#E2C48D', slate = '#3E4A5C', gold = '#F2C14E';
  const w = 16;
  const bodyTop = groundY - Math.round(h * 0.62);
  rect(ctx, x, bodyTop, w, groundY - bodyTop, stone);
  rect(ctx, x + w - 3, bodyTop, 3, groundY - bodyTop, stoneSh);
  for (let y = bodyTop + 3; y < groundY - 2; y += 6) {
    rect(ctx, x + 2, y, 2, 4, stoneSh); rect(ctx, x + 7, y, 2, 4, stoneSh);
    px(ctx, x + 2, y, stoneHi); px(ctx, x + 7, y, stoneHi);
  }
  // clock block
  const cw = w + 4;
  const ch = 20;
  const cy0 = bodyTop - ch;
  rect(ctx, x - 2, cy0, cw, ch, stone);
  rect(ctx, x - 2 + cw - 3, cy0, 3, ch, stoneSh);
  rect(ctx, x - 2, cy0, cw, 1, stoneHi);
  rect(ctx, x - 2, bodyTop - 1, cw, 1, stoneSh);
  const cx = x + w / 2 - 1;
  const ccy = cy0 + ch / 2;
  circle(ctx, cx, ccy, 7, gold);
  circle(ctx, cx, ccy, 6, '#FFF8EC');
  [[0, -5], [5, 0], [0, 5], [-5, 0]].forEach(([dx, dy]) => px(ctx, cx + dx, ccy + dy, '#1A1423'));
  const { h: hh, m } = clockTime;
  const ma = (m / 60) * Math.PI * 2;
  const ha = ((hh % 12) / 12 + m / 720) * Math.PI * 2;
  line(ctx, cx, ccy, cx + Math.round(Math.sin(ma) * 5), ccy - Math.round(Math.cos(ma) * 5), '#1A1423');
  line(ctx, cx, ccy, cx + Math.round(Math.sin(ha) * 3), ccy - Math.round(Math.cos(ha) * 3), '#8B1E1E');
  // belfry + spire
  const by0 = cy0 - 8;
  rect(ctx, x, by0, w, 8, stone);
  for (let i = 0; i < 3; i++) rect(ctx, x + 2 + i * 4, by0 + 2, 2, 5, '#5C4A33');
  rect(ctx, x + w - 3, by0, 3, 8, stoneSh);
  const sh = Math.round(h * 0.22);
  poly(ctx, [[x - 1, by0], [x + w + 1, by0], [x + w / 2 + 1, by0 - sh], [x + w / 2 - 1, by0 - sh]], slate);
  line(ctx, x + w / 2, by0 - sh, x + w / 2, by0 - sh - 5, gold);
  for (let i = 1; i < 4; i++) rect(ctx, x + 1 + i * 0.5, by0 - Math.round((sh * i) / 4), w - 2 - i, 1, gold);
  // corner pinnacles
  [x - 2, x + w].forEach((px0) => { rect(ctx, px0, by0 - 3, 2, 3, stone); px(ctx, px0, by0 - 4, gold); });
  return { clock: { x: cx, y: ccy }, top: by0 - sh - 5 };
}

export function towerBridge(ctx, x, baseY, s, c, c2) {
  const tw = 10 * s;
  const th = 34 * s;
  const gap = 34 * s;
  [x, x + tw + gap].forEach((tx) => {
    rect(ctx, tx, baseY - th, tw, th, c);
    poly(ctx, [[tx - 1, baseY - th], [tx + tw + 1, baseY - th], [tx + tw / 2, baseY - th - 8 * s]], c2);
    for (let i = 0; i < 3; i++) rect(ctx, tx + 2 * s, baseY - th + 5 * s + i * 8 * s, 2 * s, 4 * s, c2);
  });
  rect(ctx, x + tw, baseY - th + 4 * s, gap, 3 * s, c);
  rect(ctx, x + tw, baseY - 10 * s, gap, 2 * s, c);
  line(ctx, x, baseY - th + 10 * s, x - 18 * s, baseY - 6 * s, c);
  line(ctx, x + 2 * tw + gap, baseY - th + 10 * s, x + 2 * tw + gap + 18 * s, baseY - 6 * s, c);
}

export function londonEye(ctx, cx, cy, r, c, t) {
  const rot = t * 0.05;
  for (let a = 0; a < 360; a += 3) {
    const rad = (a * Math.PI) / 180;
    px(ctx, cx + Math.round(Math.cos(rad) * r), cy + Math.round(Math.sin(rad) * r), c);
  }
  for (let i = 0; i < 12; i++) {
    const a = rot + (i / 12) * Math.PI * 2;
    const ex = cx + Math.round(Math.cos(a) * r);
    const ey = cy + Math.round(Math.sin(a) * r);
    line(ctx, cx, cy, ex, ey, c);
    rect(ctx, ex - 1, ey - 1, 3, 2, c);
  }
  line(ctx, cx, cy, cx - Math.round(r * 0.5), cy + r + 6, c);
  line(ctx, cx, cy, cx + Math.round(r * 0.5), cy + r + 6, c);
}

// A row of simple buildings (skyline). Returns nothing; deterministic by seed.
export function skyline(ctx, x0, x1, baseY, minH, maxH, color, windowColor, r, litChance = 0.3, t = 0) {
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = 8 + Math.floor(r() * 14);
    const h = minH + Math.floor(r() * (maxH - minH));
    rect(ctx, x, baseY - h, w, h, color);
    if (r() > 0.6) rect(ctx, x + Math.floor(w / 2) - 1, baseY - h - 4, 1, 4, color);
    if (windowColor) {
      for (let wy = baseY - h + 3; wy < baseY - 2; wy += 4) {
        for (let wx = x + 2; wx < x + w - 2; wx += 3) {
          const on = r() < litChance;
          const flick = Math.sin(t * 0.3 + wx * 7.1 + wy * 3.3) > 0.97;
          if (on !== flick) px(ctx, wx, wy, windowColor);
        }
      }
    }
    x += w + (r() > 0.7 ? 1 : 0);
    i++;
  }
}

export { OUTLINE, ellipse };
