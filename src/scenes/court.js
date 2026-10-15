// World 2: The Court. Navya rallies against a very persistent opponent (a deadline)
// and the scoreboard ticks to 21–19 as you scroll.
import { rect, px, dither, draw, rng, text, seg, lerp, bands, PixelGrid, baked, poly } from '../engine/pixel.js';
import { shuttle } from '../sprites/props.js';
import { navya, blinkExpr } from '../sprites/navya.js';

// The opponent: a walking calendar page, due Friday.
const deadline = (frame = 0) =>
  baked(`deadline${frame}`, () => {
    const g = new PixelGrid(24, 34);
    g.rect(3, 4, 16, 20, '#F4F1E8');
    g.rect(3, 4, 16, 6, '#D62828');
    g.rect(6, 2, 2, 3, '#BFC4CC'); g.rect(14, 2, 2, 3, '#BFC4CC');
    // angry eyes + mouth
    g.rect(6, 13, 3, 2, '#1A1423'); g.rect(13, 13, 3, 2, '#1A1423');
    g.set(6, 12, '#1A1423'); g.set(15, 12, '#1A1423');
    g.rect(8, 18, 6, 1, '#1A1423'); g.set(7, 19, '#1A1423'); g.set(14, 19, '#1A1423');
    for (let y = 21; y < 24; y++) g.rect(4, y, 14, 1, y % 2 ? '#E2DCCD' : '#F4F1E8');
    // legs (stepping)
    g.rect(7, 24, 2, 6 - frame, '#1A1423'); g.rect(13, 24, 2, 5 + frame, '#1A1423');
    g.rect(6, 30 - frame, 4, 2, '#1A1423'); g.rect(13, 29 + frame, 4, 2, '#1A1423');
    // arm + racket
    g.stroke(3, 14, 0, 18, '#1A1423', 1);
    g.ellipse(1, 22, 2, 3, '#1A1423');
    g.ellipse(1, 22, 1, 2, '#E9EEF5');
    return g.outline().canvas();
  });

const trophy = () =>
  baked('trophy', () => {
    const g = new PixelGrid(11, 13);
    g.rect(2, 1, 7, 5, '#FFD166'); g.rect(3, 6, 5, 1, '#FFD166'); g.rect(4, 7, 3, 2, '#E0A93B');
    g.rect(3, 9, 5, 1, '#E0A93B'); g.rect(2, 10, 7, 2, '#7A4E3A');
    g.set(1, 2, '#FFD166'); g.set(0, 3, '#FFD166'); g.set(1, 4, '#FFD166');
    g.set(9, 2, '#FFD166'); g.set(10, 3, '#FFD166'); g.set(9, 4, '#FFD166');
    g.set(3, 2, '#FFF1C2'); g.set(3, 3, '#FFF1C2');
    return g.outline().canvas();
  });

export const courtScene = {
  targetH: 180,
  targetW: 140,
  stillP: 1,
  draw(ctx, st, t) {
    const { W, H, landscape } = st;
    const p = st.state.p;
    const floorY = Math.round(H * (landscape ? 0.6 : 0.64));
    const courtTop = floorY + 4;
    const footY = Math.round(H * (landscape ? 0.86 : 0.86));

    st.layer('court-bg', (c) => {
      bands(c, 0, 0, W, floorY, ['#1B2236', '#1F2840', '#232E4A', '#253047', '#2A3652']);
      // bunting
      for (let x = 0; x < W; x += 8) {
        const y = 4 + Math.round(Math.sin(x / W * Math.PI) * 6);
        poly(c, [[x, y], [x + 6, y], [x + 3, y + 5]], ['#FF6FAE', '#FFD166', '#A2D2FF', '#B8F2E6'][(x / 8) % 4]);
      }
      // bleachers + seats
      const bTop = Math.round(H * 0.24);
      for (let i = 0; i < 4; i++) {
        const y = bTop + i * 9;
        rect(c, 0, y + 6, W, 3, i % 2 ? '#3B4A6B' : '#34425F');
        rect(c, 0, y + 6, W, 1, '#4A5A7E');
      }
      // trophy shelf on the wall (landscape only)
      if (landscape) {
        const sx = Math.round(W * 0.04);
        const sy = Math.round(H * 0.16);
        rect(c, sx - 2, sy + 13, 52, 2, '#7A4E3A');
        for (let i = 0; i < 4; i++) c.drawImage(trophy(), sx + i * 13, sy);
      }
      // wooden floor
      rect(c, 0, floorY, W, H - floorY, '#C58B4E');
      for (let y = floorY + 3; y < H; y += 4) rect(c, 0, y, W, 1, '#AD7742');
      const r = rng(2);
      for (let y = floorY; y < H; y += 4) for (let x = Math.floor(r() * 30); x < W; x += 30 + Math.floor(r() * 20)) rect(c, x, y, 1, 4, '#9C6A35');
      // court mat
      const cx0 = Math.round(W * 0.05);
      const cx1 = Math.round(W * 0.95);
      rect(c, cx0, courtTop, cx1 - cx0, footY - courtTop + 4, '#2F7D5B');
      rect(c, cx0, courtTop, cx1 - cx0, 1, '#F4F1E8');
      rect(c, cx0, footY + 3, cx1 - cx0, 1, '#F4F1E8');
      [cx0, cx1 - 1, Math.round(W * 0.2), Math.round(W * 0.38), Math.round(W * 0.62), Math.round(W * 0.8)].forEach((x) => rect(c, x, courtTop, 1, footY - courtTop + 4, '#F4F1E8'));
      dither(c, cx0, courtTop + 1, cx1 - cx0, 2, '#3A8F69', 0);
    });

    // spotlights
    [0.25, 0.5, 0.75].forEach((f, i) => {
      const lx = Math.round(W * f);
      rect(ctx, lx - 4, 12, 8, 3, '#1A1423');
      rect(ctx, lx - 3, 15, 6, 1, '#FFF6D5');
      const flick = Math.sin(t * 3 + i) > -0.98;
      if (flick) for (let y = 16; y < floorY; y += 2) {
        const w = Math.round(3 + (y - 16) * 0.35);
        dither(ctx, lx - w, y, w * 2, 1, '#3A4766', (y / 2) & 1);
      }
    });

    // crowd (cheers on the final smash)
    const cheering = p > 0.9;
    const r = rng(9);
    const bTop = Math.round(H * 0.24);
    const shirts = ['#FF6FAE', '#A2D2FF', '#FFD166', '#B8F2E6', '#CDB4DB', '#F7864E', '#F4F1E8'];
    for (let i = 0; i < 4; i++) {
      for (let x = 3 + (i % 2) * 4; x < W - 3; x += 8) {
        if (r() < 0.25) continue;
        const y = bTop + i * 9;
        const bob = cheering ? Math.round(Math.abs(Math.sin(t * 8 + x)) * 2) : Math.round(Math.sin(t * 1.5 + x) * 0.4);
        rect(ctx, x, y + 2 - bob, 4, 4, shirts[Math.floor(r() * shirts.length)]);
        rect(ctx, x + 1, y - 1 - bob, 2, 3, r() > 0.5 ? '#C98E6A' : '#8C5A3C');
        rect(ctx, x + 1, y - 2 - bob, 2, 1, r() > 0.5 ? '#3A2318' : '#1A1423');
        if (cheering && (x / 8) % 2) { px(ctx, x - 1, y - 2 - bob, '#C98E6A'); px(ctx, x + 4, y - 2 - bob, '#C98E6A'); }
      }
    }

    // net
    const netX = Math.round(W * 0.5);
    rect(ctx, netX - 1, footY - 34, 2, 38, '#1A1423');
    for (let y = footY - 32; y < footY - 14; y++) dither(ctx, netX - 2, y, 5, 1, '#E9EEF5', y & 1);
    rect(ctx, netX - 3, footY - 33, 7, 1, '#F4F1E8');

    // the rally: shuttle flies between Navya and the deadline
    const nx = Math.round(W * (landscape ? 0.28 : 0.24));
    const dx = Math.round(W * (landscape ? 0.74 : 0.78));
    const N = 6;
    const u = seg(p, 0.06, 0.9) * N;
    const k = Math.min(N - 1, Math.floor(u));
    const f = u - k;
    const toDeadline = k % 2 === 0;
    const last = k === N - 1;
    let pose = 'ready';
    let lift = 0;
    if (p >= 0.9) pose = 'cheer';
    else if (toDeadline && f < 0.14) { pose = 'smash'; lift = 6; }
    else if (toDeadline && f < 0.32) pose = 'follow';
    else if (!toDeadline && f > 0.72) { pose = 'jump'; lift = 4; }
    if (p < 0.06) pose = 'ready';
    const expr = pose === 'cheer' ? 'star' : blinkExpr(t);
    const bounce = pose === 'cheer' ? Math.round(Math.abs(Math.sin(t * 6)) * 3) : 0;
    draw(ctx, navya('court', pose, Math.floor(t * 3) % 2, expr), nx - 17, footY - 56 - lift - bounce);
    const dl = deadline(Math.floor(t * 3) % 2);
    const dSad = p >= 0.9;
    draw(ctx, dl, dx - 12, footY - dl.height + 1 + (dSad ? 2 : 0), true);
    if (dSad) text(ctx, 'NOO', dx, footY - dl.height - 8, '#FF4D4D', 'center');

    if (p > 0.06 && p < 0.9) {
      const ax = toDeadline ? nx + 8 : dx - 10;
      const bx = toDeadline ? dx - 10 : nx + 8;
      const ay = footY - 52;
      const by = toDeadline && last ? footY - 4 : footY - 48;
      const peak = toDeadline && (k === 2 || last) ? 6 : 22;
      const sx = lerp(ax, bx, f);
      const sy = lerp(ay, by, f) - Math.sin(f * Math.PI) * peak;
      const sp = shuttle();
      for (let i = 1; i < 4; i++) {
        const tf = Math.max(0, f - i * 0.04);
        const tx = lerp(ax, bx, tf);
        const ty = lerp(ay, by, tf) - Math.sin(tf * Math.PI) * peak;
        dither(ctx, tx - 2, ty - 2, 4, 4, '#F4F1E8', i);
      }
      draw(ctx, sp, sx - 11, sy - 11, !toDeadline);
    }

    // scoreboard numbers (HTML lives in the overlay)
    const score = st.state.score;
    if (score) {
      const a = Math.round(lerp(14, 21, seg(p, 0.06, 0.9)));
      const b = Math.round(lerp(13, 19, seg(p, 0.06, 0.82)));
      if (score.a.textContent !== String(a)) score.a.textContent = a;
      if (score.b.textContent !== String(b)) score.b.textContent = b;
    }
  },
};

export { trophy };
