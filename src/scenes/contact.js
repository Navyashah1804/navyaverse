// World 4: back home. The camera starts on the pink study window high up in a
// Mumbai tower and tilts down to Marine Drive at night, where Navya waits by a postbox.
import { rect, px, dither, rng, seg, smooth, lerp, stars, mix } from '../engine/pixel.js';
import { marineDrive, layout } from './mumbai.js';
import { blinkExpr } from '../sprites/navya.js';

export const contactScene = {
  targetH: 150,
  targetW: 110,
  stillP: 1,
  draw(ctx, st, t) {
    const { W, H, landscape } = st;
    const s = st.state;
    const p = s.p;
    const camY = Math.round(lerp(-H * 0.95, 0, smooth(seg(p, 0, 0.7))));
    const L = layout(st);

    ctx.save();
    ctx.translate(0, -camY);
    // sky above the scene
    if (camY < 0) {
      rect(ctx, 0, -H, W, H + 1, '#0A0B26');
      dither(ctx, 0, -6, W, 6, '#0E1033', 0);
      ctx.save();
      ctx.translate(0, -H);
      stars(ctx, W, H, t, 19, '#FFF8EC', Math.round(W / 3));
      ctx.restore();
    }
    const wave = t < (s.waveUntil || 0);
    const expr = s.expr && t < (s.exprUntil || 0) ? s.expr : blinkExpr(t);
    marineDrive(ctx, st, t, { night: true, navyaPose: { pose: wave ? 'wave' : 'idle', frame: wave ? Math.floor(t * 4) % 2 : undefined, expr } });

    // the tall tower whose pink window is the study room
    const tx = Math.round(W * (landscape ? 0.14 : 0.08));
    const tw = Math.round(W * (landscape ? 0.12 : 0.26));
    const top = Math.round(-H * 0.85);
    rect(ctx, tx, top, tw, L.hz - top, '#14163A');
    rect(ctx, tx + tw - 2, top, 2, L.hz - top, '#0E1030');
    rect(ctx, tx + Math.round(tw / 2) - 1, top - 8, 2, 8, '#14163A');
    px(ctx, tx + Math.round(tw / 2) - 1, top - 9, Math.sin(t * 3) > 0 ? '#FF4D4D' : '#14163A');
    const r = rng(14);
    for (let y = top + 4; y < L.hz - 3; y += 6) for (let x = tx + 2; x < tx + tw - 4; x += 5) if (r() < 0.35) rect(ctx, x, y, 2, 3, '#FFD27A');
    const wx = tx + Math.round(tw / 2) - 3;
    const wy = top + 14;
    dither(ctx, wx - 4, wy - 4, 14, 13, mix('#14163A', '#FF8FC7', 0.7 + Math.sin(t * 2) * 0.2), 0);
    rect(ctx, wx, wy, 6, 5, '#FFC8DD');
    rect(ctx, wx + 2, wy, 1, 5, '#FF8FC7');
    ctx.restore();
  },
};
