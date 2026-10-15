import { marineDrive } from './mumbai.js';
import { blinkExpr } from '../sprites/navya.js';

// Home: Marine Drive at sunset. Navya waves on arrival and "talks" while the chat types.
export const homeScene = {
  targetH: 150,
  targetW: 110,
  stillP: 0,
  draw(ctx, st, t) {
    const s = st.state;
    let pose = 'idle';
    let frame;
    let expr;
    if (s.talking) expr = Math.floor(t * 9) % 2 ? 'talk' : 'smile';
    else if (s.thinking) expr = 'think';
    else if (s.expr && t < (s.exprUntil || 0)) expr = s.expr;
    if (t < (s.waveUntil ?? 2.6)) {
      pose = 'wave';
      frame = Math.floor(t * 4) % 2;
    }
    marineDrive(ctx, st, t, { navyaPose: { pose, frame, expr: expr ?? blinkExpr(t) } });
  },
};
