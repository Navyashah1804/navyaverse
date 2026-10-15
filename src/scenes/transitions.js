// The in-between flights: a shuttlecock smash (London → Court) and a paper plane
// (Court → Study Room). Both are scrubbed by scroll progress p.
import { rect, px, dither, draw, rng, text, seg, lerp, smooth, bands, poly, line, stars, mix } from '../engine/pixel.js';
import { shuttle } from '../sprites/props.js';

export const smashScene = {
  targetH: 150,
  targetW: 110,
  stillP: 0.5,
  draw(ctx, st, t) {
    const { W, H } = st;
    const p = st.state.p;
    rect(ctx, 0, 0, W, H, '#151A2E');
    // radial speed lines
    const cx = W / 2;
    const cy = H / 2;
    const r = rng(3);
    for (let i = 0; i < 40; i++) {
      const a = r() * Math.PI * 2;
      const r0 = 20 + ((r() * 60 + t * 80 + p * 300) % 120);
      const len = 6 + r() * 14;
      line(ctx, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len), i % 3 ? '#2A3355' : '#3B4A72');
    }
    // the shuttle arcs from top-right to bottom-left, scaled up 3×
    const u = smooth(seg(p, 0.08, 0.86));
    const sp = shuttle();
    const k = 3;
    const pos = (v) => [lerp(W + 30, W * 0.12, v), lerp(-40, H * 0.82, v) - Math.sin(v * Math.PI) * H * 0.18];
    for (let i = 5; i >= 1; i--) {
      const [tx, ty] = pos(Math.max(0, u - i * 0.035));
      dither(ctx, tx - 10, ty - 10, 20, 20, '#3B4A72', i);
    }
    const [x, y] = pos(u);
    ctx.drawImage(sp, Math.round(x - sp.width * k / 2), Math.round(y - sp.height * k / 2), sp.width * k, sp.height * k);
    // white flash on impact
    const flash = seg(p, 0.86, 0.95) * (1 - seg(p, 0.95, 1));
    if (flash > 0) {
      ctx.globalAlpha = Math.min(1, flash * 1.4);
      rect(ctx, 0, 0, W, H, '#FFF8EC');
      ctx.globalAlpha = 1;
    }
  },
};

const PAGE_W = 64;
const PAGE_H = 44;

export const paperPlaneScene = {
  targetH: 150,
  targetW: 110,
  stillP: 0.55,
  draw(ctx, st, t) {
    const { W, H, landscape } = st;
    const p = st.state.p;
    bands(ctx, 0, 0, W, H, ['#1E1A3E', '#2B2152', '#3B2860', '#55306C', '#7A3B78', '#A24A84', '#C85A8E']);
    stars(ctx, W, H * 0.6, t, 12, '#FFF8EC', Math.round(W / 5));

    // the building with Navya's window
    const bx = Math.round(W * (landscape ? 0.76 : 0.6));
    const bw = Math.round(W * (landscape ? 0.16 : 0.3));
    const by = Math.round(H * 0.42);
    rect(ctx, bx, by, bw, H - by, '#1A1638');
    const r = rng(6);
    for (let wy = by + 4; wy < H - 2; wy += 7) for (let wx = bx + 3; wx < bx + bw - 4; wx += 6) if (r() < 0.4) rect(ctx, wx, wy, 3, 4, '#3A2E5C');
    const wx = bx + Math.round(bw / 2) - 3;
    const wy = by + 10;
    const glow = 0.6 + Math.sin(t * 2) * 0.2;
    dither(ctx, wx - 4, wy - 4, 14, 14, mix('#3B2860', '#FF8FC7', glow), 0);
    rect(ctx, wx, wy, 6, 6, '#FFC8DD');
    rect(ctx, wx + 2, wy, 1, 6, '#FF8FC7'); rect(ctx, wx, wy + 2, 6, 1, '#FF8FC7');

    // 1. the notebook page, then it folds into a plane
    const fold = seg(p, 0.12, 0.28);
    const px0 = Math.round(W * (landscape ? 0.28 : 0.5));
    const py0 = Math.round(H * 0.5);
    if (p < 0.28) {
      const w = Math.round(lerp(PAGE_W, 14, smooth(fold)));
      const h = Math.round(lerp(PAGE_H, 8, smooth(fold)));
      const x = px0 - Math.round(w / 2);
      const y = py0 - Math.round(h / 2);
      if (fold < 0.6) {
        rect(ctx, x, y, w, h, '#FFF8EC');
        for (let ly = y + 6; ly < y + h - 2; ly += 4) rect(ctx, x + 1, ly, w - 2, 1, '#A2C4E8');
        rect(ctx, x + 6, y, 1, h, '#F28FA8');
        if (fold === 0) {
          text(ctx, 'TO-DO:', x + 9, y + 2, '#2B2350');
          text(ctx, 'ML ASSIGNMENT', x + 9, y + 10, '#2B2350');
          text(ctx, 'DUE FRI *', x + 9, y + 18, '#FF4FA3');
          text(ctx, 'STAY CUTE', x + 9, y + 26, '#2B2350');
        }
      } else {
        poly(ctx, [[x, y], [x + w, y + Math.round(h / 2)], [x, y + h]], '#FFF8EC');
        line(ctx, x, y + Math.round(h / 2), x + w, y + Math.round(h / 2), '#C9C3D9');
      }
    }

    // 2. the paper plane loops toward the window
    const u = seg(p, 0.28, 0.86);
    if (p >= 0.28 && u < 1) {
      const loop = seg(u, 0.25, 0.6);
      const R = Math.round(H * 0.16);
      const x = lerp(px0, wx + 3, smooth(u)) - Math.sin(loop * Math.PI * 2) * R;
      const y = lerp(py0, wy + 3, smooth(u)) - (1 - Math.cos(loop * Math.PI * 2)) * R;
      const sc = lerp(1, 0.4, seg(u, 0.7, 1));
      const L = Math.round(16 * sc);
      const Hh = Math.max(2, Math.round(5 * sc));
      const upside = loop > 0.25 && loop < 0.75;
      const dir = loop > 0 && loop < 0.5 ? -1 : 1;
      const tipX = x + (dir * L) / 2;
      const tailX = x - (dir * L) / 2;
      const yy = upside ? -1 : 1;
      poly(ctx, [[tailX, y - Hh * yy], [tipX, y], [tailX, y + Math.round(Hh / 2) * yy]], '#FFF8EC');
      line(ctx, tailX, y, tipX, y, '#C9C3D9');
      for (let i = 1; i < 8; i++) {
        const tu = Math.max(0, u - i * 0.02);
        const tl = seg(tu, 0.25, 0.6);
        const tx = lerp(px0, wx + 3, smooth(tu)) - Math.sin(tl * Math.PI * 2) * R;
        const ty = lerp(py0, wy + 3, smooth(tu)) - (1 - Math.cos(tl * Math.PI * 2)) * R;
        if ((i + Math.floor(t * 8)) % 2) px(ctx, tx, ty, '#FFD6E8');
      }
    }

    // 3. the window grows to fill the screen
    const zoom = smooth(seg(p, 0.86, 1));
    if (zoom > 0) {
      const zw = lerp(6, W * 1.6, zoom);
      const zh = lerp(6, H * 1.6, zoom);
      const zx = lerp(wx + 3, W / 2, zoom) - zw / 2;
      const zy = lerp(wy + 3, H / 2, zoom) - zh / 2;
      rect(ctx, zx, zy, zw, zh, '#FFC8DD');
      rect(ctx, zx + zw / 2 - 1, zy, Math.max(1, zw / 30), zh, '#FF8FC7');
      rect(ctx, zx, zy + zh / 2 - 1, zw, Math.max(1, zh / 30), '#FF8FC7');
    }
  },
};
