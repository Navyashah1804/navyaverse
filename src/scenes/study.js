// World 3: The Study Room ♡. Fairy lights switch on as you scroll in, the code
// monitor types, and the to-do monitor mirrors the checklist on the page.
import { rect, px, dither, draw, rng, text, seg, bands, circle, ellipse, line, stars } from '../engine/pixel.js';
import { cat } from '../sprites/props.js';
import { navya, blinkExpr } from '../sprites/navya.js';

const CODE = [
  [['#FF8FC7', 6], ['#F4F1E8', 10]],
  [['#A2D2FF', 4], ['#FFD166', 8], ['#F4F1E8', 4]],
  [['#B8F2E6', 12]],
  [['#FF8FC7', 3], ['#A2D2FF', 9], ['#F4F1E8', 6]],
  [['#CDB4DB', 14]],
  [['#FFD166', 5], ['#F4F1E8', 8]],
  [['#B8F2E6', 7], ['#FF8FC7', 6]],
];

function sparkle(ctx, x, y, size, c) {
  px(ctx, x, y, c);
  for (let i = 1; i <= size; i++) { px(ctx, x - i, y, c); px(ctx, x + i, y, c); px(ctx, x, y - i, c); px(ctx, x, y + i, c); }
}

export const studyScene = {
  targetH: 180,
  targetW: 140,
  stillP: 1,
  draw(ctx, st, t) {
    const { W, H, landscape } = st;
    const s = st.state;
    const p = s.p;
    const floorY = Math.round(H * 0.84);
    const deskY = Math.round(H * (landscape ? 0.67 : 0.7));
    const deskW = landscape ? Math.max(120, Math.round(W * 0.38)) : W - 8;
    const deskX = landscape ? Math.round(W * 0.58 - deskW / 2) : 4;
    const win = landscape
      ? { x: Math.round(W * 0.05), y: Math.round(H * 0.17), w: Math.max(46, Math.round(W * 0.2)), h: Math.round(H * 0.36) }
      : { x: 8, y: Math.round(H * 0.12), w: Math.round(W * 0.42), h: Math.round(H * 0.22) };

    st.layer('study-bg', (c) => {
      bands(c, 0, 0, W, floorY, ['#3A2550', '#45295C', '#522E68', '#603472', '#723C7C', '#874585', '#9C4F8C']);
      // wainscot
      rect(c, 0, Math.round(H * 0.62), W, 1, '#C77FAE');
      dither(c, 0, Math.round(H * 0.62) + 1, W, floorY - Math.round(H * 0.62) - 1, '#7A4479', 0);
      // window with night sky
      rect(c, win.x - 2, win.y - 2, win.w + 4, win.h + 4, '#FFF4E6');
      bands(c, win.x, win.y, win.w, win.h, ['#141638', '#1B1F5C', '#2E3378', '#4A4688']);
      const r = rng(4);
      for (let i = 0; i < 14; i++) px(c, win.x + Math.floor(r() * win.w), win.y + Math.floor(r() * win.h * 0.6), '#FFF8EC');
      circle(c, win.x + win.w - 10, win.y + 9, 4, '#F5F3CE');
      for (let x = win.x; x < win.x + win.w; ) {
        const w = 4 + Math.floor(r() * 7);
        const h = 4 + Math.floor(r() * (win.h * 0.35));
        rect(c, x, win.y + win.h - h, w, h, '#14163A');
        for (let wy = win.y + win.h - h + 2; wy < win.y + win.h; wy += 3) if (r() < 0.5) px(c, x + 1 + Math.floor(r() * (w - 2)), wy, r() < 0.15 ? '#FF8FC7' : '#FFD27A');
        x += w;
      }
      rect(c, win.x + Math.round(win.w / 2) - 1, win.y, 2, win.h, '#FFF4E6');
      rect(c, win.x, win.y + Math.round(win.h / 2) - 1, win.w, 2, '#FFF4E6');
      rect(c, win.x - 4, win.y + win.h + 2, win.w + 8, 2, '#FFF4E6');
      // floor + rug
      rect(c, 0, floorY, W, H - floorY, '#7A4E3A');
      for (let y = floorY + 3; y < H; y += 4) rect(c, 0, y, W, 1, '#6A4232');
      ellipse(c, Math.round(W * (landscape ? 0.55 : 0.5)), floorY + Math.round((H - floorY) / 2), Math.round(W * 0.3), Math.max(3, Math.round((H - floorY) / 2) - 1), '#F7B2D9');
      ellipse(c, Math.round(W * (landscape ? 0.55 : 0.5)), floorY + Math.round((H - floorY) / 2), Math.round(W * 0.26), Math.max(2, Math.round((H - floorY) / 2) - 3), '#FFC8DD');
      // corkboard with polaroids
      const cb = landscape ? { x: Math.round(W * 0.31), y: Math.round(H * 0.18), w: 44, h: 28 } : { x: Math.round(W * 0.56), y: Math.round(H * 0.13), w: Math.round(W * 0.38), h: 26 };
      rect(c, cb.x - 2, cb.y - 2, cb.w + 4, cb.h + 4, '#7A4E3A');
      rect(c, cb.x, cb.y, cb.w, cb.h, '#C99A6B');
      dither(c, cb.x, cb.y, cb.w, cb.h, '#B8875A', 0);
      const pol = [['#A2D2FF', -1], ['#FF8FC7', 1], ['#B8F2E6', 0], ['#FFD166', 1]];
      pol.forEach(([col, tilt], i) => {
        const px0 = cb.x + 3 + i * Math.floor((cb.w - 12) / 3);
        const py0 = cb.y + 4 + (i % 2) * 6 + tilt;
        if (px0 + 9 > cb.x + cb.w) return;
        rect(c, px0, py0, 9, 11, '#FFFFFF');
        rect(c, px0 + 1, py0 + 1, 7, 6, col);
        px(c, px0 + 4, py0 - 1, '#FF4FA3');
      });
      // bookshelf (landscape)
      if (landscape && W > 260) {
        const bx = Math.round(W * 0.86);
        const by = Math.round(H * 0.24);
        rect(c, bx, by, 34, floorY - by, '#5A3A2E');
        const r2 = rng(12);
        const spines = ['#FF8FC7', '#A2D2FF', '#CDB4DB', '#FFD166', '#B8F2E6', '#F7864E', '#FFFFFF'];
        for (let sy = by + 3; sy < floorY - 12; sy += 16) {
          rect(c, bx + 2, sy + 12, 30, 2, '#7A4E3A');
          for (let sx = bx + 3; sx < bx + 31; ) {
            const w = 2 + Math.floor(r2() * 3);
            const h = 8 + Math.floor(r2() * 4);
            rect(c, sx, sy + 12 - h, w, h, spines[Math.floor(r2() * spines.length)]);
            sx += w;
          }
        }
        // plant on top
        rect(c, bx + 12, by - 6, 10, 6, '#FF8FC7');
        [[-6, -12], [0, -16], [6, -12], [-3, -8], [4, -9]].forEach(([dx, dy]) => line(c, bx + 17, by - 6, bx + 17 + dx, by - 6 + dy, '#5FA372'));
      }
    });

    // gold-star stickers (twinkle)
    const starSpots = landscape
      ? [[0.3, 0.6], [0.36, 0.55], [0.44, 0.24], [0.48, 0.42], [0.76, 0.2]]
      : [[0.58, 0.36], [0.9, 0.4], [0.72, 0.44]];
    starSpots.forEach(([fx, fy], i) => sparkle(ctx, Math.round(W * fx), Math.round(H * fy), Math.sin(t * 2 + i * 1.7) > 0.3 ? 2 : 1, '#FFD166'));

    // curtains (sway)
    const sway = Math.round(Math.sin(t * 0.9) * 1);
    rect(ctx, win.x - 7 + sway, win.y - 4, 7, win.h + 12, '#FF8FC7');
    rect(ctx, win.x + win.w + sway, win.y - 4, 7, win.h + 12, '#FF8FC7');
    rect(ctx, win.x - 3 + sway, win.y - 4, 1, win.h + 12, '#E86AA6');
    rect(ctx, win.x + win.w + 4 + sway, win.y - 4, 1, win.h + 12, '#E86AA6');
    rect(ctx, win.x - 9, win.y - 6, win.w + 18, 2, '#FFD166');

    // fairy lights switch on one by one as you scroll in
    const bulbs = Math.floor(W / 9);
    const on = Math.round(seg(p, 0, 0.35) * bulbs);
    for (let i = 0; i <= bulbs; i++) {
      const x = Math.round((i / bulbs) * W);
      const y = 5 + Math.round(Math.sin((i / bulbs) * Math.PI) * 9);
      if (i < bulbs) line(ctx, x, y, Math.round(((i + 1) / bulbs) * W), 5 + Math.round(Math.sin(((i + 1) / bulbs) * Math.PI) * 9), '#2A1E3A');
      const lit = i < on;
      const tw = Math.sin(t * 3 + i * 1.3) > -0.4;
      if (lit && tw) dither(ctx, x - 2, y, 5, 4, '#FFE7A0', i & 1);
      rect(ctx, x, y + 1, 2, 2, lit ? (tw ? '#FFF4C2' : '#FFE7A0') : '#6A5A72');
    }

    // chair back behind Navya
    const nx = Math.round(deskX + deskW / 2);
    rect(ctx, nx - 13, deskY - 36, 26, 36, '#FF8FC7');
    rect(ctx, nx - 13, deskY - 36, 26, 2, '#FFB3D1');
    rect(ctx, nx + 11, deskY - 34, 2, 34, '#E86AA6');

    // monitors behind the desk
    const mw = landscape ? 44 : Math.min(38, Math.round((deskW - 30) / 2));
    const mh = Math.round(mw * 0.62);
    const my = deskY - mh - 10;
    const mL = deskX + 3;
    const mR = deskX + deskW - mw - 3;
    [mL, mR].forEach((mx) => {
      rect(ctx, mx - 1, my - 1, mw + 2, mh + 2, '#1A1423');
      rect(ctx, mx, my, mw, mh, '#221B30');
      rect(ctx, mx + Math.round(mw / 2) - 2, my + mh + 1, 4, 8, '#1A1423');
      rect(ctx, mx + Math.round(mw / 2) - 6, deskY - 2, 12, 2, '#1A1423');
    });
    // neon sign
    const signY = my - 20;
    const flick = Math.sin(t * 7) > -0.92;
    const neon = flick ? '#FF4FA3' : '#9C3A6E';
    if (signY > 22) {
      dither(ctx, nx - 40, signY - 3, 80, 18, flick ? '#7A3F78' : '#5A3266', 0);
      text(ctx, 'HOT GIRLS', nx, signY, neon, 'center');
      text(ctx, 'STUDY DATA SCIENCE', nx, signY + 7, flick ? '#FFD6E8' : '#B07A9A', 'center');
    }

    // code that types itself
    const typed = (t * 14) % 140;
    let budget = typed;
    CODE.forEach((row, ri) => {
      let x = mL + 3;
      const y = my + 3 + ri * 3;
      if (y > my + mh - 3) return;
      row.forEach(([col, len]) => {
        const l = Math.min(len, Math.max(0, Math.floor(budget)), mL + mw - 3 - x);
        if (l > 0) rect(ctx, x, y, l, 1, col);
        budget -= len;
        x += len + 2;
      });
    });
    if (Math.floor(t * 2) % 2) rect(ctx, mL + 3, my + mh - 4, 2, 2, '#B8F2E6');
    // to-do monitor mirrors the page checklist
    text(ctx, 'TODAY', mR + 3, my + 2, '#FFD6E8');
    const todos = s.todos || [];
    const rows = Math.min(todos.length || 5, Math.floor((mh - 9) / 4));
    for (let i = 0; i < rows; i++) {
      const y = my + 9 + i * 4;
      rect(ctx, mR + 3, y, 3, 3, '#FFD6E8');
      if (todos[i]) rect(ctx, mR + 4, y + 1, 1, 1, '#FF4FA3');
      rect(ctx, mR + 8, y + 1, Math.min(mw - 12, 10 + ((i * 7) % 12)), 1, todos[i] ? '#8A6F96' : '#CDB4DB');
    }

    // Navya at the desk (sits in front of the chair)
    const celebrate = s.expr && t < (s.exprUntil || 0);
    const expr = celebrate ? s.expr : blinkExpr(t);
    const stretch = t % 9 > 8.2;
    draw(ctx, navya('study', stretch ? 'cheer' : 'sit', Math.floor(t * 6) % 2, expr), nx - 17, deskY - 41);
    st.anchor('navya', nx, deskY - 34);

    // desk: a pink-and-white study desk with legs and a drawer unit
    rect(ctx, deskX - 2, deskY, deskW + 4, 4, '#FFF4E6');
    rect(ctx, deskX - 2, deskY, deskW + 4, 1, '#FFFFFF');
    rect(ctx, deskX - 2, deskY + 3, deskW + 4, 1, '#E6C9D6');
    rect(ctx, deskX + 2, deskY + 4, 3, floorY - deskY - 2, '#E6C9D6');
    rect(ctx, deskX + deskW - 30, deskY + 4, 28, floorY - deskY - 2, '#FFD6E8');
    rect(ctx, deskX + deskW - 30, deskY + 4, 28, 1, '#E6A8C4');
    for (let dy = deskY + 8; dy < floorY - 4; dy += 9) {
      rect(ctx, deskX + deskW - 28, dy, 24, 1, '#E6A8C4');
      rect(ctx, deskX + deskW - 18, dy + 4, 4, 1, '#FF4FA3');
    }
    // keyboard in front of her
    rect(ctx, nx - 9, deskY - 2, 18, 2, '#FFD6E8');
    rect(ctx, nx - 9, deskY - 2, 18, 1, '#FFFFFF');
    for (let k = 0; k < 8; k++) px(ctx, nx - 8 + k * 2, deskY - 1, '#E6A8C4');

    // desk items: book stack + cat (left), mug, lava lamp (right)
    const leftEnd = deskX + 4;
    const books = ['#A2D2FF', '#FF8FC7', '#CDB4DB'];
    books.forEach((col, i) => rect(ctx, leftEnd, deskY - 4 - i * 4, 22 - i * 2, 4, col));
    books.forEach((col, i) => rect(ctx, leftEnd, deskY - 4 - i * 4, 22 - i * 2, 1, '#FFFFFF'));
    const ct = cat(Math.floor(t * 2) % 3);
    draw(ctx, ct, leftEnd - 1, deskY - 12 - ct.height + 2);
    st.anchor('cat', leftEnd + 10, deskY - 12 - ct.height);
    const mugX = leftEnd + 26;
    if (mugX + 8 < nx - 12) {
      rect(ctx, mugX, deskY - 6, 6, 6, '#FFF4E6'); px(ctx, mugX + 6, deskY - 4, '#FFF4E6'); px(ctx, mugX + 6, deskY - 3, '#FFF4E6');
      px(ctx, mugX + 2, deskY - 4, '#FF4FA3'); px(ctx, mugX + 3, deskY - 4, '#FF4FA3');
      for (let i = 0; i < 3; i++) px(ctx, mugX + 2 + Math.round(Math.sin(t * 3 + i) * 1), deskY - 8 - i * 2 - Math.floor((t * 4) % 2), '#E9EEF5');
    }
    const lx = deskX + deskW - 10;
    rect(ctx, lx, deskY - 4, 6, 4, '#BFC4CC');
    rect(ctx, lx + 1, deskY - 16, 4, 12, '#FF8FC7');
    rect(ctx, lx + 1, deskY - 18, 4, 2, '#BFC4CC');
    const blob = Math.round((Math.sin(t * 0.8) + 1) * 4);
    rect(ctx, lx + 2, deskY - 6 - blob, 2, 2, '#FF4FA3');
    rect(ctx, lx + 2, deskY - 14 + Math.round(blob / 2), 2, 2, '#FFD6E8');
    dither(ctx, lx - 2, deskY - 18, 10, 14, '#FFB3D1', Math.floor(t * 2) % 2);

    // floating sparkles
    const r = rng(42);
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(r() * W);
      const y = Math.round(H - ((t * (4 + r() * 4) + r() * H) % H));
      if (Math.sin(t * 2 + i) > 0.2) sparkle(ctx, x, y, 1, i % 2 ? '#FFD6E8' : '#FFF4C2');
    }
  },
};
