// World 1: London. Navya walks in, the red bus drives past as you scroll,
// Big Ben shows the real London time, and the shopfronts are clickable.
import { bands, rect, px, dither, draw, rng, text, seg, lerp, poly, line } from '../engine/pixel.js';
import { bus, phoneBooth, guard, suitcase, bigBen, towerBridge, londonEye, lampPost } from '../sprites/props.js';
import { navya, blinkExpr } from '../sprites/navya.js';

const SKY = ['#8CA3B9', '#97ADC2', '#A3B7CA', '#AFC1D1', '#BBCAD8', '#C6D3DF'];

function londonTime() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date());
  const get = (k) => +parts.find((x) => x.type === k).value;
  return { h: get('hour'), m: get('minute') };
}

function terrace(c, x, w, baseY, h, style) {
  const pal = {
    cream: ['#E6DCC8', '#C9BCA4', '#F4EDE0'],
    brick: ['#8C5F55', '#6E4A42', '#A87668'],
    slate: ['#7D8DA0', '#64748A', '#93A3B5'],
  }[style];
  rect(c, x, baseY - h, w, h, pal[0]);
  rect(c, x + w - 2, baseY - h, 2, h, pal[1]);
  rect(c, x - 1, baseY - h - 2, w + 2, 2, pal[1]);
  rect(c, x, baseY - h - 2, w, 1, pal[2]);
  for (let wy = baseY - h + 5; wy < baseY - 18; wy += 11) {
    for (let wx = x + 4; wx < x + w - 7; wx += 9) {
      rect(c, wx - 1, wy - 1, 7, 9, '#F4F1E8');
      rect(c, wx, wy, 5, 7, '#3A4A62');
      rect(c, wx, wy + 3, 5, 1, '#F4F1E8');
      px(c, wx + 1, wy + 1, '#7FA6C9');
      rect(c, wx - 1, wy + 8, 7, 1, pal[1]);
    }
  }
  // chimneys
  rect(c, x + 4, baseY - h - 7, 4, 5, pal[1]);
  rect(c, x + w - 10, baseY - h - 6, 3, 4, pal[1]);
}

export const londonScene = {
  targetH: 200,
  targetW: 140,
  stillP: 0.9,
  draw(ctx, st, t) {
    const { W, H, landscape } = st;
    const s = st.state;
    const p = s.p;
    const roadY = H - 16;
    const walkY = roadY - 2;
    const baseY = H - 30;

    st.layer('london-bg', (c) => {
      bands(c, 0, 0, W, baseY, SKY);
      const far = '#8EA2B6';
      const far2 = '#7F93A8';
      londonEye(c, Math.round(W * (landscape ? 0.84 : 0.74)), Math.round(baseY - H * (landscape ? 0.36 : 0.3)), Math.round(H * (landscape ? 0.15 : 0.11)), far, 0);
      if (landscape) towerBridge(c, Math.round(W * 0.42), baseY - 30, 1, far, far2);
      poly(c, [[Math.round(W * 0.64) - 9, baseY], [Math.round(W * 0.64) + 9, baseY], [Math.round(W * 0.64), baseY - Math.round(H * 0.55)]], far2);
      // terraces
      const r = rng(31);
      const styles = ['cream', 'brick', 'slate', 'cream', 'brick'];
      let x = landscape ? Math.round(W * 0.12) : 22;
      let i = 0;
      while (x < W) {
        const w = 38 + Math.floor(r() * 16);
        const h = Math.round(H * (0.3 + r() * 0.12));
        terrace(c, x, w, baseY, h, styles[i % styles.length]);
        x += w + 1;
        i++;
      }
      // pavement and kerb
      rect(c, 0, baseY, W, roadY - baseY, '#9AA1AC');
      for (let xx = 0; xx < W; xx += 10) rect(c, xx, baseY, 1, roadY - baseY, '#8A919C');
      rect(c, 0, roadY - 2, W, 2, '#6B717C');
      // road
      rect(c, 0, roadY, W, H - roadY, '#3B3F4A');
      for (let xx = 4; xx < W; xx += 16) rect(c, xx, roadY + 8, 8, 1, '#F4F1E8');
      dither(c, 0, roadY + 1, W, 3, '#454A57', 0);
    });

    // Big Ben (live clock)
    const bbX = landscape ? Math.round(W * 0.04) : 3;
    bigBen(ctx, bbX, baseY, Math.round(H * (landscape ? 0.82 : 0.66)), t, londonTime());
    st.anchor('hs-bigben', bbX + 8, baseY - Math.round(H * 0.5));

    // shopfronts: boutique + café
    const boutiqueX = Math.round(W * (landscape ? 0.27 : 0.3));
    const cafeX = Math.round(W * (landscape ? 0.56 : 0.52));
    const shopH = 30;
    if (landscape || W > 200) {
      rect(ctx, boutiqueX, baseY - shopH, 46, shopH, '#F4B6CF');
      rect(ctx, boutiqueX, baseY - shopH, 46, 7, '#1A1423');
      text(ctx, 'NAVYA & CO', boutiqueX + 23, baseY - shopH + 1, '#FFD166', 'center');
      rect(ctx, boutiqueX + 3, baseY - shopH + 9, 26, 19, '#FFF4FA');
      // mannequin in a dress + mirror
      rect(ctx, boutiqueX + 9, baseY - shopH + 11, 3, 3, '#E6D6C8');
      poly(ctx, [[boutiqueX + 7, baseY - shopH + 14], [boutiqueX + 14, baseY - shopH + 14], [boutiqueX + 16, baseY - 4], [boutiqueX + 5, baseY - 4]], '#FF6FAE');
      rect(ctx, boutiqueX + 19, baseY - shopH + 11, 7, 15, '#C8D6E5');
      rect(ctx, boutiqueX + 20, baseY - shopH + 12, 2, 6, '#FFFFFF');
      rect(ctx, boutiqueX + 33, baseY - shopH + 10, 10, 20, '#B5487A');
      px(ctx, boutiqueX + 34, baseY - 12, '#FFD166');
      st.anchor('hs-boutique', boutiqueX + 23, baseY - shopH - 4);
    }
    const cw = 54;
    rect(ctx, cafeX, baseY - shopH, cw, shopH, '#FFF4E6');
    for (let i = 0; i < cw; i += 6) rect(ctx, cafeX + i, baseY - shopH - 2, 6, 6, (i / 6) % 2 ? '#FFF4E6' : '#FF8FC7');
    for (let i = 0; i < cw; i += 6) rect(ctx, cafeX + i + 1, baseY - shopH + 4, 4, 1, (i / 6) % 2 ? '#FFF4E6' : '#FF8FC7');
    rect(ctx, cafeX, baseY - shopH - 9, cw, 7, '#3A2A3F');
    text(ctx, 'SWEET SPOT', cafeX + cw / 2, baseY - shopH - 8, '#FFD6E8', 'center');
    rect(ctx, cafeX + 4, baseY - shopH + 8, 30, 16, '#F7E3C8');
    rect(ctx, cafeX + 4, baseY - shopH + 8, 30, 1, '#C9A57A');
    // cake stand in the window
    rect(ctx, cafeX + 10, baseY - 13, 12, 1, '#BFC4CC'); rect(ctx, cafeX + 15, baseY - 12, 2, 4, '#BFC4CC');
    rect(ctx, cafeX + 11, baseY - 17, 10, 4, '#FFB3D1'); rect(ctx, cafeX + 11, baseY - 17, 10, 1, '#FFFFFF'); px(ctx, cafeX + 16, baseY - 18, '#D62828');
    rect(ctx, cafeX + 38, baseY - shopH + 8, 12, 22, '#7A4E3A');
    px(ctx, cafeX + 40, baseY - 12, '#FFD166');
    // outdoor table
    rect(ctx, cafeX + cw + 3, baseY + 3, 12, 2, '#3A3350'); rect(ctx, cafeX + cw + 8, baseY + 5, 2, 6, '#3A3350');
    rect(ctx, cafeX + cw + 5, baseY + 1, 3, 2, '#FFFFFF');
    st.anchor('hs-cafe', cafeX + cw / 2, baseY - shopH - 12);

    // street furniture
    const lamps = landscape ? [0.22, 0.52, 0.76] : [0.26, 0.92];
    lamps.forEach((f) => lampPost(ctx, Math.round(W * f), walkY, 36, true, t));
    const boothX = Math.round(W * (landscape ? 0.86 : 0.86));
    const pb = phoneBooth();
    draw(ctx, pb, boothX, walkY - pb.height + 1);
    st.anchor('hs-booth', boothX + 8, walkY - pb.height - 4);
    if (landscape) {
      const gd = guard(t % 10 > 9.7 ? 1 : 0);
      const gx = Math.round(W * 0.94);
      draw(ctx, gd, gx, walkY - gd.height + 1);
      st.anchor('hs-guard', gx + 6, walkY - gd.height - 4);
      // bench with quill and inkpot
      const bx = Math.round(W * 0.73);
      rect(ctx, bx, walkY - 9, 22, 2, '#5E4430'); rect(ctx, bx, walkY - 14, 22, 2, '#5E4430');
      rect(ctx, bx + 1, walkY - 7, 2, 7, '#1A1423'); rect(ctx, bx + 19, walkY - 7, 2, 7, '#1A1423');
      rect(ctx, bx + 13, walkY - 12, 3, 3, '#1A1423');
      line(ctx, bx + 14, walkY - 12, bx + 19, walkY - 22, '#FFF8EC');
      line(ctx, bx + 15, walkY - 12, bx + 20, walkY - 21, '#E6DCC8');
      st.anchor('hs-quill', bx + 15, walkY - 26);
    }

    // Navya walks in, then stops
    const startX = Math.round(W * (landscape ? 0.14 : 0.12));
    const endX = Math.round(W * (landscape ? 0.46 : 0.36));
    const wk = seg(p, 0, 0.45);
    const nx = Math.round(lerp(startX, endX, wk));
    const walking = wk > 0 && wk < 1;
    let pose = walking ? 'walk' : s.umbrella ? 'umbrella' : 'idle';
    const frame = walking ? Math.floor(nx / 3) % 4 : 0;
    const expr = s.expr && t < (s.exprUntil || 0) ? s.expr : blinkExpr(t);
    const sc = suitcase();
    draw(ctx, sc, nx - 26, walkY - sc.height + 1);
    st.anchor('hs-suitcase', nx - 19, walkY - sc.height - 4);
    draw(ctx, navya('london', pose, frame, expr), nx - 17, walkY - 56);
    st.anchor('hs-navya', nx, walkY - 46);

    // drizzle
    if (!s.umbrella) {
      const r = rng(77);
      for (let i = 0; i < Math.round(W / 3); i++) {
        const sp = 60 + r() * 30;
        const y = Math.round(((r() * (H + 10) + t * sp) % (H + 10)) - 5);
        const x = Math.round(((((r() * (W + 40) - t * sp * 0.25) % (W + 40)) + W + 40) % (W + 40)) - 20);
        px(ctx, x, y, '#D2DEEA');
        px(ctx, x - 1, y + 1, '#B6C9D9');
      }
    }

    // the bus drives through as you scroll
    const bu = seg(p, 0.05, 0.75);
    if (bu > 0 && bu < 1) {
      const b = bus(Math.floor(t * 6) % 2);
      const bx = Math.round(lerp(-b.width - 4, W + 4, bu));
      const by = H - b.height + 2;
      draw(ctx, b, bx, by);
      rect(ctx, bx + 5, by + 12, 42, 7, '#1A1423');
      text(ctx, '21 HOBBIES', bx + 7, by + 13, '#FFD166');
      dither(ctx, bx + 4, H - 1, b.width - 8, 1, '#8B1E1E', 0);
    }
  },
};
