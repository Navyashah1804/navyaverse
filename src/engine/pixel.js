// Tiny pixel-art toolkit: every helper snaps to whole pixels so nothing blurs.

export const OUTLINE = '#1A1423';

// ---------- colour ----------
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}

// Blend two equal-length palettes; returns a new array of hex colours.
export function mixPalette(pa, pb, t) {
  return pa.map((c, i) => mix(c, pb[Math.min(i, pb.length - 1)], t));
}

// ---------- maths ----------
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
// progress of p inside [a, b], clamped to 0..1
export const seg = (p, a, b) => clamp((p - a) / (b - a));

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- primitives ----------
export function rect(ctx, x, y, w, h, c) {
  if (!c || w <= 0 || h <= 0) return;
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function px(ctx, x, y, c) {
  rect(ctx, x, y, 1, 1, c);
}

export function circle(ctx, cx, cy, r, c) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy) + 0.35);
    rect(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, c);
  }
}

export function ellipse(ctx, cx, cy, rx, ry, c) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  for (let dy = -ry; dy <= ry; dy++) {
    const dx = Math.floor(rx * Math.sqrt(1 - (dy * dy) / (ry * ry)) + 0.35);
    rect(ctx, cx - dx, cy + dy, dx * 2 + 1, 1, c);
  }
}

export function line(ctx, x0, y0, x1, y1, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = c;
  for (;;) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

// Scanline polygon fill on whole pixels.
export function poly(ctx, pts, c) {
  const ys = pts.map((p) => p[1]);
  const minY = Math.floor(Math.min(...ys));
  const maxY = Math.ceil(Math.max(...ys));
  ctx.fillStyle = c;
  for (let y = minY; y < maxY; y++) {
    const yc = y + 0.5;
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) {
        xs.push(ax + ((yc - ay) / (by - ay)) * (bx - ax));
      }
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = Math.round(xs[i]);
      const xb = Math.round(xs[i + 1]);
      if (xb > xa) ctx.fillRect(xa, y, xb - xa, 1);
    }
  }
}

// Checkerboard dither over a rectangle.
export function dither(ctx, x, y, w, h, c, phase = 0) {
  x = Math.round(x); y = Math.round(y);
  ctx.fillStyle = c;
  for (let j = 0; j < h; j++) {
    for (let i = (j + phase) & 1; i < w; i += 2) ctx.fillRect(x + i, y + j, 1, 1);
  }
}

// Vertical banded gradient with a dithered row between bands (the classic 16-bit sky).
export function bands(ctx, x, y, w, h, colors) {
  const n = colors.length;
  const bh = h / n;
  for (let i = 0; i < n; i++) {
    const y0 = Math.round(y + i * bh);
    const y1 = Math.round(y + (i + 1) * bh);
    rect(ctx, x, y0, w, y1 - y0, colors[i]);
    if (i > 0) dither(ctx, x, y0, w, 2, colors[i - 1], i);
  }
}

// ---------- 3x5 bitmap font for signs ----------
const GLYPHS = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
  Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111',
  0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
  4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010',
  8: '111101111101111', 9: '111101111001110',
  '&': '010101010101011', '.': '000000000000010', '!': '010010010000010', ':': '000010000010000',
  '-': '000000111000000', "'": '010010000000000', '*': '000101111111010', '/': '001001010100100',
  ' ': '000000000000000',
};

export const textWidth = (s) => s.length * 4 - 1;

export function text(ctx, str, x, y, c, align = 'left') {
  str = str.toUpperCase();
  let cx = Math.round(align === 'center' ? x - textWidth(str) / 2 : align === 'right' ? x - textWidth(str) : x);
  y = Math.round(y);
  ctx.fillStyle = c;
  for (const ch of str) {
    const g = GLYPHS[ch] || GLYPHS[' '];
    for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3), y + ((i / 3) | 0), 1, 1);
    cx += 4;
  }
}

// ---------- sprite grids ----------
export class PixelGrid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Array(w * h).fill(null);
  }
  set(x, y, c) {
    x = Math.round(x); y = Math.round(y);
    if (!c || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.d[y * this.w + x] = c;
  }
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.d[y * this.w + x];
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  // rows of characters looked up in a palette; '.' and unknown chars are transparent
  map(x, y, rows, pal) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const c = pal[row[i]];
        if (c) this.set(x + i, y + j, c);
      }
    });
  }
  ellipse(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const dx = Math.floor(rx * Math.sqrt(1 - (dy * dy) / (ry * ry)) + 0.35);
      for (let i = -dx; i <= dx; i++) this.set(cx + i, cy + dy, c);
    }
  }
  // thick-ish line used for limbs
  stroke(x0, y0, x1, y1, colorAt, thick = 2) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const horiz = Math.abs(x1 - x0) > Math.abs(y1 - y0);
    for (let k = 0; k <= n; k++) {
      const x = Math.round(x0 + ((x1 - x0) * k) / n);
      const y = Math.round(y0 + ((y1 - y0) * k) / n);
      const c = typeof colorAt === 'function' ? colorAt(k / n) : colorAt;
      for (let t = 0; t < thick; t++) horiz ? this.set(x, y + t, c) : this.set(x + t, y, c);
    }
  }
  // any empty pixel touching a filled one becomes the outline colour
  outline(c = OUTLINE) {
    const src = this.d.slice();
    const at = (x, y) => (x < 0 || y < 0 || x >= this.w || y >= this.h ? null : src[y * this.w + x]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (src[y * this.w + x]) continue;
        if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) this.d[y * this.w + x] = c;
      }
    }
    return this;
  }
  canvas() {
    const cv = document.createElement('canvas');
    cv.width = this.w;
    cv.height = this.h;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(this.w, this.h);
    this.d.forEach((c, i) => {
      if (!c) return;
      const [r, g, b] = hexToRgb(c);
      img.data.set([r, g, b, 255], i * 4);
    });
    ctx.putImageData(img, 0, 0);
    return cv;
  }
}

const spriteCache = new Map();
export function baked(key, build) {
  if (!spriteCache.has(key)) spriteCache.set(key, build());
  return spriteCache.get(key);
}

export function draw(ctx, sprite, x, y, flip = false) {
  x = Math.round(x);
  y = Math.round(y);
  if (!flip) return ctx.drawImage(sprite, x, y);
  ctx.save();
  ctx.translate(x + sprite.width, y);
  ctx.scale(-1, 1);
  ctx.drawImage(sprite, 0, 0);
  ctx.restore();
}

// ---------- reusable scenery ----------
export function cloud(ctx, x, y, w, c, shade) {
  const h = Math.max(3, Math.round(w / 4));
  ellipse(ctx, x + w * 0.5, y + h * 0.6, Math.round(w / 2), Math.round(h / 2), shade || c);
  ellipse(ctx, x + w * 0.5, y + h * 0.4, Math.round(w / 2) - 1, Math.round(h / 2), c);
  circle(ctx, x + w * 0.35, y + h * 0.2, Math.round(h / 1.6), c);
  circle(ctx, x + w * 0.62, y + h * 0.05, Math.round(h / 1.3), c);
}

export function stars(ctx, W, H, t, seed = 7, color = '#FFF8EC', count = 40) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * W);
    const y = Math.floor(r() * H);
    const tw = Math.sin(t * 2 + i * 1.7);
    if (tw > -0.6) px(ctx, x, y, color);
    if (tw > 0.92) {
      px(ctx, x - 1, y, color); px(ctx, x + 1, y, color);
      px(ctx, x, y - 1, color); px(ctx, x, y + 1, color);
    }
  }
}
