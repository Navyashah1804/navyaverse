// Mumbai → London: sunset sky turns to night, then to a grey-blue London morning
// while the Navya Air plane crosses the screen. Driven entirely by scroll (p).
import { bands, rect, px, cloud, draw, rng, mix, mixPalette, seg, lerp, smooth, stars, circle, poly } from '../engine/pixel.js';
import { plane } from '../sprites/props.js';

const SUNSET = ['#2B1B4A', '#4A2160', '#6B2D6E', '#A23A6E', '#D9496B', '#F06A5A', '#F7864E', '#FDB062'];
const NIGHT = ['#0B0C29', '#0E1033', '#121541', '#171B4F', '#1B1F5C', '#24296B', '#2E3378', '#3A3C82'];
const LONDON = ['#7E95AE', '#8CA3B9', '#9AB0C4', '#A8BDCF', '#B6C9D9', '#C4D4E2', '#D2DEEA', '#DFE8F1'];

function skyAt(p) {
  if (p < 0.55) return mixPalette(SUNSET, NIGHT, smooth(seg(p, 0.3, 0.55)));
  return mixPalette(NIGHT, LONDON, smooth(seg(p, 0.6, 0.86)));
}

function cloudColors(p) {
  const a = p < 0.55 ? mix('#F28FA8', '#2E3378', seg(p, 0.3, 0.55)) : mix('#2E3378', '#F4F7FB', seg(p, 0.6, 0.86));
  const b = p < 0.55 ? mix('#C4637E', '#24296B', seg(p, 0.3, 0.55)) : mix('#24296B', '#C9D5E2', seg(p, 0.6, 0.86));
  return [a, b];
}

export const flightScene = {
  targetH: 150,
  targetW: 110,
  stillP: 0.62,
  draw(ctx, st, t) {
    const { W, H } = st;
    const p = st.state.p;
    bands(ctx, 0, 0, W, H, skyAt(p));

    const night = Math.max(0, 1 - Math.abs(p - 0.56) / 0.16);
    if (night > 0.25) stars(ctx, W, H * 0.7, t, 9, '#FFF8EC', Math.round((W / 3) * night));
    if (night > 0.4) {
      circle(ctx, Math.round(W * 0.18), Math.round(H * 0.2), 6, '#F5F3CE');
      circle(ctx, Math.round(W * 0.18) + 3, Math.round(H * 0.2) - 2, 5, skyAt(p)[1]);
    }

    // three cloud layers moving left as you scroll (parallax)
    const [cA, cB] = cloudColors(p);
    const layers = [
      { n: 5, size: [12, 20], speed: 0.6, y: [0.08, 0.35], seed: 3 },
      { n: 4, size: [22, 34], speed: 1.2, y: [0.3, 0.7], seed: 8 },
      { n: 3, size: [40, 60], speed: 2.2, y: [0.65, 0.95], seed: 13 },
    ];
    layers.forEach((L, li) => {
      const r = rng(L.seed);
      for (let i = 0; i < L.n; i++) {
        const w = L.size[0] + Math.floor(r() * (L.size[1] - L.size[0]));
        const span = W + w * 2;
        const base = r() * span;
        const x = ((((base - p * W * L.speed - t * (0.5 + li)) % span) + span) % span) - w;
        const y = Math.round(H * (L.y[0] + r() * (L.y[1] - L.y[0])));
        cloud(ctx, x, y, w, cA, cB);
      }
    });

    // Mumbai skyline sinks away at take-off
    const down = smooth(seg(p, 0.2, 0.42));
    if (down < 1) {
      const r = rng(4);
      const base = H + Math.round(down * 40);
      for (let x = -2; x < W; ) {
        const w = 6 + Math.floor(r() * 12);
        const h = 8 + Math.floor(r() * 26);
        rect(ctx, x, base - h, w, h, '#3A2550');
        for (let wy = base - h + 3; wy < base; wy += 4) for (let wx = x + 2; wx < x + w - 1; wx += 3) if (r() < 0.25) px(ctx, wx, wy, '#FFE29A');
        x += w;
      }
    }

    // London rises at landing
    const up = smooth(seg(p, 0.8, 0.98));
    if (up > 0) {
      const base = H + Math.round((1 - up) * 60);
      const c = '#5C7088';
      const r = rng(17);
      for (let x = -2; x < W; ) {
        const w = 8 + Math.floor(r() * 14);
        const h = 10 + Math.floor(r() * 18);
        rect(ctx, x, base - h, w, h, c);
        x += w;
      }
      const bx = Math.round(W * 0.22);
      rect(ctx, bx, base - 64, 8, 64, c);
      rect(ctx, bx - 1, base - 72, 10, 9, c);
      poly(ctx, [[bx - 1, base - 72], [bx + 9, base - 72], [bx + 4, base - 86]], c);
      circle(ctx, bx + 3, base - 67, 2, '#DFE8F1');
      const ex = Math.round(W * 0.72);
      for (let a = 0; a < 360; a += 4) {
        const rad = (a * Math.PI) / 180;
        px(ctx, ex + Math.round(Math.cos(rad) * 18), base - 30 + Math.round(Math.sin(rad) * 18), c);
      }
      poly(ctx, [[Math.round(W * 0.5) - 8, base], [Math.round(W * 0.5) + 8, base], [Math.round(W * 0.5), base - 58]], c);
    }

    // the plane
    const u = seg(p, 0.28, 0.94);
    if (u > 0 && u < 1) {
      const spr = plane(Math.floor(t * 3) % 2);
      const x = Math.round(lerp(-spr.width - 4, W + 4, u));
      const y = Math.round(H * 0.58 - Math.sin(u * Math.PI) * H * 0.26 + Math.sin(t * 2.4) * 1.2);
      for (let i = 1; i < 22; i++) {
        if ((i + Math.floor(t * 6)) % 3 === 0) continue;
        const cx = x - i * 3;
        const cy = y + 12 + Math.round(Math.sin((u * Math.PI) - i * 0.02) * 0.5 + i * 0.12 * Math.cos(u * Math.PI));
        px(ctx, cx, cy, '#FFF8EC');
      }
      draw(ctx, spr, x, y);
    }
  },
};
