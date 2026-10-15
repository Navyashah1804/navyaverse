// Marine Drive, Mumbai. Sunset for Home, night for the Contact bookend.
import { rect, px, circle, dither, bands, rng, cloud, stars, draw, line, text, mix } from '../engine/pixel.js';
import { taxi, palm, chaiStall, lampPost, skyline, postbox } from '../sprites/props.js';
import { navya, blinkExpr } from '../sprites/navya.js';

const SUNSET = {
  sky: ['#2B1B4A', '#4A2160', '#6B2D6E', '#A23A6E', '#D9496B', '#F06A5A', '#F7864E', '#FDB062'],
  sea: ['#7A4A7A', '#5A4A86', '#3A5A86', '#2F6A82', '#1F4E6B'],
  foam: '#F7C3A0',
  city: '#3A2550', cityFar: '#5A3266', win: '#FFE29A',
  wall: '#8E7F86', wallHi: '#B9A7A0', wallSh: '#6E6070',
  floor: '#C7B3AA', floorLine: '#A8949B',
  road: '#3A3340', cloud: '#F28FA8', cloudSh: '#C4637E',
};
const NIGHT = {
  sky: ['#0E1033', '#121541', '#171B4F', '#1B1F5C', '#24296B', '#2E3378', '#3A3C82', '#4A4688'],
  sea: ['#1F2466', '#1B2258', '#152A55', '#102A43', '#0B1E33'],
  foam: '#8FA6D6',
  city: '#14163A', cityFar: '#1E2150', win: '#FFD27A',
  wall: '#4A4460', wallHi: '#625B7C', wallSh: '#332E46',
  floor: '#5E5470', floorLine: '#4D4460',
  road: '#1E1B28', cloud: '#2E3378', cloudSh: '#24296B',
};

export function layout(st) {
  const { W, H, landscape } = st;
  const hz = Math.round(H * (landscape ? 0.55 : 0.5));
  const wallY = H - (landscape ? 34 : 40);
  const roadY = H - (landscape ? 8 : 10);
  const footY = roadY - 3;
  const navyaX = Math.round(landscape ? W * 0.66 : W * 0.5);
  return { W, H, hz, wallY, roadY, footY, navyaX, landscape };
}

export function marineDrive(ctx, st, t, { night = false, navyaPose, showNavya = true } = {}) {
  const P = night ? NIGHT : SUNSET;
  const L = layout(st);
  const { W, H, hz, wallY, roadY, footY, navyaX, landscape } = L;

  // static backdrop: sky, skyline, wall, floor
  st.layer(night ? 'md-night' : 'md-sunset', (c) => {
    bands(c, 0, 0, W, hz, P.sky);
    const r = rng(11);
    // Malabar Hill far right
    for (let x = Math.round(W * 0.7); x < W; x++) {
      const h = Math.round(4 + Math.sin(((x - W * 0.7) / (W * 0.3)) * Math.PI) * 6);
      rect(c, x, hz - h, 1, h, P.cityFar);
    }
    skyline(c, Math.round(W * 0.72), W, hz, 2, 8, P.cityFar, night ? P.win : null, r, 0.4);
    skyline(c, -4, Math.round(W * (landscape ? 0.34 : 0.46)), hz, 6, Math.round(H * 0.2), P.city, P.win, r, night ? 0.5 : 0.22);
    bands(c, 0, hz, W, wallY - hz, P.sea);
    // parapet
    rect(c, 0, wallY, W, 8, P.wall);
    rect(c, 0, wallY, W, 1, P.wallHi);
    rect(c, 0, wallY + 7, W, 1, P.wallSh);
    for (let x = 12; x < W; x += 24) rect(c, x, wallY + 1, 1, 6, P.wallSh);
    // promenade tiles
    rect(c, 0, wallY + 8, W, roadY - wallY - 8, P.floor);
    for (let y = wallY + 11; y < roadY; y += 4) rect(c, 0, y, W, 1, P.floorLine);
    for (let y = wallY + 8, k = 0; y < roadY; y += 4, k++) for (let x = (k % 2) * 6; x < W; x += 12) rect(c, x, y, 1, 4, P.floorLine);
    // road
    rect(c, 0, roadY, W, H - roadY, P.road);
    for (let x = 2; x < W; x += 10) rect(c, x, roadY + Math.round((H - roadY) / 2), 5, 1, night ? '#5A5470' : '#E9E2D0');
  });

  // sun or moon + stars
  if (night) {
    stars(ctx, W, hz - 6, t, 3, '#FFF8EC', Math.round(W / 4));
    const mx = Math.round(W * 0.8);
    const my = Math.round(hz * 0.32);
    circle(ctx, mx, my, 8, '#F5F3CE');
    circle(ctx, mx - 2, my - 2, 2, '#E3DFB2');
    px(ctx, mx + 3, my + 2, '#E3DFB2'); px(ctx, mx + 4, my + 3, '#E3DFB2');
  } else {
    const sx = Math.round(W * (landscape ? 0.84 : 0.76));
    const r = landscape ? 11 : 9;
    const sy = hz - 3;
    for (let dy = -r; dy <= r; dy++) {
      if (sy + dy >= hz) break;
      if (dy > 1 && dy % 3 === 0) continue;
      const dx = Math.floor(Math.sqrt(r * r - dy * dy) + 0.35);
      rect(ctx, sx - dx, sy + dy, dx * 2 + 1, 1, dy < -r / 2 ? '#FFE29A' : '#FFC66D');
    }
  }

  // drifting clouds
  const r = rng(5);
  for (let i = 0; i < 4; i++) {
    const cw = 18 + Math.floor(r() * 20);
    const span = W + cw * 2;
    const cx = ((r() * span + t * (1.2 + i * 0.6)) % span) - cw;
    const cy = 6 + Math.floor(r() * hz * 0.45);
    cloud(ctx, cx, cy, cw, P.cloud, P.cloudSh);
  }

  // Queen's Necklace: an arc of lights hugging the bay
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const x = Math.round(W * 0.32 + u * W * 0.6);
    const y = Math.round(hz + 1 + Math.sin(u * Math.PI) * 3);
    if (night) {
      const on = Math.sin(t * 2 + i * 0.9) > -0.85;
      if (on) px(ctx, x, y, '#FFD27A');
    } else if (i % 3 === 0) px(ctx, x, y, '#E8C9A0');
  }

  // sea shimmer + light reflections
  const rr = rng(21);
  for (let i = 0; i < Math.round(W / 6); i++) {
    const x = Math.floor(((rr() * W + t * (2 + rr() * 3)) % (W + 10)) - 5);
    const y = hz + 2 + Math.floor(rr() * (wallY - hz - 3));
    rect(ctx, x, y, 2 + Math.floor(rr() * 3), 1, P.foam);
  }
  const refX = Math.round(W * (night ? 0.8 : landscape ? 0.84 : 0.76));
  for (let y = hz + 1; y < wallY; y += 2) {
    const k = (y - hz) / (wallY - hz);
    const w = Math.max(2, Math.round((night ? 6 : 10) * (1 - k * 0.6)));
    const wob = Math.round(Math.sin(t * 3 + y * 0.8) * 2);
    rect(ctx, refX - w + wob, y, w * 2, 1, night ? '#C9C6E8' : y % 4 ? '#FFC66D' : '#F7864E');
  }

  // promenade props
  if (W > 140) lampPost(ctx, Math.round(W * 0.5), wallY + 9, 30, night, t);
  lampPost(ctx, Math.round(W * (landscape ? 0.96 : 0.1)), wallY + 9, 30, night, t);
  if (landscape) palm(ctx, Math.round(W * 0.04), wallY + 10, 46, t, night ? '#1E3D3A' : '#3E5C3A', night ? '#2E5248' : '#5C7F45', night ? '#3A2D2A' : '#6B4A33');
  if (landscape && W > 200) chaiStall(ctx, Math.round(W * 0.8), roadY - 2, true);
  if (night) {
    const pb = postbox();
    const bx = navyaX + (landscape ? 18 : 16);
    draw(ctx, pb, bx, footY - pb.height + 1);
    st.anchor('postbox', bx + pb.width / 2, footY - pb.height);
  }

  // seagulls (sunset only)
  if (!night) {
    for (let i = 0; i < 3; i++) {
      const gx = Math.round(((t * (6 + i * 2) + i * 70) % (W + 40)) - 20);
      const gy = Math.round(hz * 0.5 + i * 9 + Math.sin(t * 1.5 + i) * 2);
      const up = Math.sin(t * 8 + i) > 0;
      px(ctx, gx, gy, '#2B1B4A'); px(ctx, gx + 4, gy, '#2B1B4A');
      px(ctx, gx + 1, gy + (up ? -1 : 1), '#2B1B4A'); px(ctx, gx + 3, gy + (up ? -1 : 1), '#2B1B4A');
      px(ctx, gx + 2, gy + 1, '#2B1B4A');
    }
  }

  // Navya
  if (showNavya) {
    const { pose = 'idle', frame = Math.floor(t * 1.6) % 2, expr = blinkExpr(t) } = navyaPose || {};
    const bob = pose === 'idle' && frame === 1 ? 1 : 0;
    const spr = navya(night ? 'night' : 'home', pose, pose === 'idle' ? 0 : frame, expr);
    draw(ctx, spr, navyaX - 17, footY - 56 + bob);
    st.anchor('navya', navyaX, footY - 42);
  }

  // kaali-peeli taxi on the road, every ~14s
  const tx = taxi();
  const cycle = 14;
  const k = (t % cycle) / cycle;
  if (k < 0.55) {
    const x = Math.round(-40 + (k / 0.55) * (W + 80));
    draw(ctx, tx, x, H - tx.height + 1);
    if (night) dither(ctx, x + 36, H - 14, 8, 3, '#FFE8A3', 0);
  }

  return L;
}

export const MUMBAI_SKY_NIGHT = NIGHT.sky;
export { mix, line, text };
