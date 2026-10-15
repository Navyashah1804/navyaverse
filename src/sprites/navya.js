// Pixel-Navya. One set of poses, many outfits: each outfit is a palette plus a
// few accessories, the same trick old handheld games used for costume swaps.
import { PixelGrid, baked } from '../engine/pixel.js';

// Navya: shoulder-length curly dark-brown hair with caramel ends, gold hoops.
const HAIR = '#3A2318';
const HAIR_HI = '#5C3A26';
const HAIR_END = '#94603A';
const HAIR_END_HI = '#B37C4A';
const SKIN = '#C98E6A';
const SKIN_SH = '#A86E4E';
const GOLD = '#FFD166';

// Head, 20×15, front view, middle part, curly volume at the sides.
const HEAD = [
  '......hhhhhhhh......',
  '....hhhhhHHhhhhh....',
  '...hhhhHhhhhHhhhh...',
  '..hhhhHhhhhhhHhhhh..',
  '..hhhhhhhsshhhhhhh..',
  '..hhhhhsssssshhhhh..',
  '.hhhhhsssssssshhhhh.',
  '.hhhhLeesssseeLhhhh.',
  '.hhhhsewssssewshhhh.',
  'hhhhhsbssssssbshhhhh',
  'hhhhhssssmmsssshhhhh',
  'hhhhhSssssssssShhhhh',
  '.hhhhhSssssssShhhhh.',
  '.hhhhhhhSSSShhhhhhh.',
  '.hhhhhhhhSShhhhhhhh.',
];
// curl highlights on the side hair
const CURLS = [[2, 7], [3, 9], [1, 11], [2, 13], [17, 7], [16, 9], [18, 11], [17, 13], [6, 2], [13, 2], [5, 3], [14, 3]];

export const OUTFITS = {
  home: {
    name: 'Denim day', torso: 'denim', dress: '#4A78B5', dressSh: '#355E96', seam: '#7FA3D4', sleeve: 'none',
    legs: 'mini', shoe: '#FFFFFF', shoeSh: '#BDB6CC', hair: 'long',
  },
  london: {
    name: 'London layers', torso: 'coat', top: '#F4EDE0', coat: '#C9A57A', coatSh: '#A3825B', belt: '#7A5A3C',
    sleeve: 'full', legs: 'tights', bottom: '#2D2A3A', bottomSh: '#1F1C2A', shoe: '#4A3426', shoeSh: '#2E2018',
    beret: '#8B1E1E', hair: 'long',
  },
  court: {
    name: 'Match day', torso: 'top', top: '#FF6FAE', topSh: '#D94F8E', sleeve: 'short',
    legs: 'shorts', bottom: '#1F2A44', bottomSh: '#141C30', shoe: '#FFFFFF', shoeSh: '#FF6FAE',
    band: '#FF6FAE', hair: 'ponytail',
  },
  study: {
    name: 'Study-sesh cosy', torso: 'cardigan', top: '#FFFFFF', topSh: '#E6E0EE', cardigan: '#FFB3D1', cardiganSh: '#E68FB4',
    sleeve: 'cardigan', legs: 'jeans', bottom: '#CDB4DB', bottomSh: '#A98FBF', shoe: '#FFD6E8', shoeSh: '#E6A8C4',
    bow: '#FF4FA3', hair: 'long',
  },
  night: {
    name: 'Night out', torso: 'offshoulder', top: '#7A2537', topSh: '#5A1A28', sleeve: 'full', coat: '#7A2537',
    legs: 'jeans', bottom: '#2A2236', bottomSh: '#1A1423', shoe: '#1A1423', shoeSh: '#0B0810', hair: 'long',
  },
  blazer: {
    name: 'Committee-meeting chic', torso: 'blazer', top: '#FFFFFF', coat: '#2B3A67', coatSh: '#1E2A4D',
    sleeve: 'full', legs: 'jeans', bottom: '#1A1423', bottomSh: '#2A2236', shoe: '#1A1423', shoeSh: '#0B0810', hair: 'long',
  },
  festive: {
    name: 'Festive glam', torso: 'choli', top: '#E23E8A', topSh: '#B52A6C', trim: GOLD, sleeve: 'short',
    legs: 'lehenga', skirt: '#E23E8A', skirtSh: '#B52A6C', shoe: GOLD, shoeSh: '#C99A2E', dupatta: GOLD,
    hair: 'long',
  },
};

// Arm paths per pose: [shoulder, elbow, hand] in body coordinates (body is 20×40).
const ARMS = {
  idle: [[[4, 16], [4, 21], [4, 25]], [[14, 16], [14, 21], [14, 25]]],
  wave0: [[[4, 16], [4, 21], [4, 25]], [[14, 16], [18, 12], [19, 6]]],
  wave1: [[[4, 16], [4, 21], [4, 25]], [[14, 16], [18, 12], [20, 6]]],
  walk0: [[[4, 16], [4, 21], [4, 26]], [[14, 16], [14, 20], [14, 24]]],
  walk2: [[[4, 16], [4, 20], [4, 24]], [[14, 16], [14, 21], [14, 26]]],
  ready: [[[4, 16], [4, 21], [7, 23]], [[14, 16], [15, 21], [17, 22]]],
  jump: [[[4, 16], [2, 12], [3, 8]], [[14, 16], [17, 11], [17, 5]]],
  smash: [[[4, 16], [5, 21], [7, 24]], [[14, 16], [16, 9], [16, 2]]],
  follow: [[[4, 16], [4, 21], [5, 25]], [[14, 16], [12, 21], [8, 25]]],
  cheer: [[[4, 16], [2, 10], [2, 4]], [[14, 16], [17, 10], [17, 4]]],
  type0: [[[4, 16], [4, 21], [8, 23]], [[14, 16], [14, 21], [10, 23]]],
  type1: [[[4, 16], [4, 21], [8, 22]], [[14, 16], [14, 21], [10, 23]]],
  umbrella: [[[4, 16], [4, 21], [4, 25]], [[14, 16], [16, 11], [16, 7]]],
};

// Racket head centre for poses that hold one.
const RACKET = {
  ready: { grip: [18, 22], head: [20, 14] },
  jump: { grip: [17, 5], head: [14, -3] },
  smash: { grip: [16, 2], head: [15, -7] },
  follow: { grip: [8, 25], head: [3, 28] },
  cheer: { grip: [17, 4], head: [17, -4] },
  idle: { grip: [14, 25], head: [16, 31] },
};

function build(o, pose, frame, expr) {
  const g = new PixelGrid(34, 60);
  const X = 7;
  const Y = 16;
  const R = (x, y, w, h, c) => g.rect(X + x, Y + y, w, h, c);
  const P = (x, y, c) => g.set(X + x, Y + y, c);

  const armKey =
    pose === 'wave' ? `wave${frame % 2}` :
    pose === 'walk' ? (frame === 0 ? 'walk0' : frame === 2 ? 'walk2' : 'idle') :
    pose === 'sit' ? `type${frame % 2}` :
    ARMS[pose] ? pose : 'idle';
  const [armL, armR] = ARMS[armKey];
  const liftL = pose === 'walk' && frame === 2 ? 1 : 0;
  const liftR = pose === 'walk' && frame === 0 ? 1 : 0;

  // 1. hair behind the body
  if (o.hair === 'long') {
    R(0, 12, 20, 8, HAIR);
    R(0, 18, 4, 3, HAIR_END); R(16, 18, 4, 3, HAIR_END);
    [0, 2, 17, 19].forEach((x) => P(x, 21, HAIR_END));
    [[1, 14], [2, 16], [18, 15], [17, 17]].forEach(([x, y]) => P(x, y, HAIR_HI));
    [[1, 19], [3, 20], [17, 19], [18, 20]].forEach(([x, y]) => P(x, y, HAIR_END_HI));
  } else if (o.hair === 'ponytail') {
    const sw = frame % 2;
    R(15, 2, 3, 3, HAIR);
    R(16 + sw, 5, 4, 5, HAIR);
    R(17 + sw, 10, 3, 3, HAIR_END);
    P(18 + sw, 6, HAIR_HI); P(17 + sw, 8, HAIR_HI); P(18 + sw, 11, HAIR_END_HI);
  }

  // 2. legs + shoes
  const shoes = (x0, x1, top = 37) => {
    R(x0, top - liftL, 4, 2, o.shoe); R(x0, top + 2 - liftL, 4, 1, o.shoeSh);
    R(x1, top - liftR, 4, 2, o.shoe); R(x1, top + 2 - liftR, 4, 1, o.shoeSh);
  };
  if (o.legs === 'jeans') {
    R(6, 26, 8, 2, o.bottom);
    R(6, 28, 4, 9 - liftL, o.bottom); R(9, 28, 1, 9 - liftL, o.bottomSh);
    R(10, 28, 4, 9 - liftR, o.bottom); R(13, 28, 1, 9 - liftR, o.bottomSh);
    shoes(6, 10);
  } else if (o.legs === 'tights') {
    R(7, 30, 3, 6 - liftL, o.bottom); R(10, 30, 3, 6 - liftR, o.bottom);
    R(7, 34 - liftL, 3, 4, o.shoe); R(10, 34 - liftR, 3, 4, o.shoe);
    R(6, 38 - liftL, 4, 1, o.shoe); R(10, 38 - liftR, 4, 1, o.shoe);
    R(6, 39 - liftL, 4, 1, o.shoeSh); R(10, 39 - liftR, 4, 1, o.shoeSh);
  } else if (o.legs === 'shorts') {
    R(6, 26, 8, 5, o.bottom); R(9, 29, 2, 2, o.bottomSh);
    R(7, 31, 3, 6 - liftL, SKIN); R(10, 31, 3, 6 - liftR, SKIN);
    R(9, 31, 1, 6, SKIN_SH);
    shoes(6, 10);
  } else if (o.legs === 'mini') {
    R(6, 26, 8, 5, o.dress); R(13, 26, 1, 5, o.dressSh); R(6, 30, 8, 1, o.dressSh); R(9, 26, 1, 4, o.seam);
    R(7, 31, 3, 6 - liftL, SKIN); R(10, 31, 3, 6 - liftR, SKIN); R(9, 31, 1, 6, SKIN_SH);
    shoes(6, 10);
  } else if (o.legs === 'dress') {
    R(6, 26, 8, 2, o.dress); R(5, 28, 10, 2, o.dress); R(4, 30, 12, 2, o.dress); R(4, 31, 12, 1, o.dressSh);
    R(7, 32, 3, 5, SKIN); R(10, 32, 3, 5, SKIN); R(9, 32, 1, 5, SKIN_SH);
    R(7, 37, 3, 2, o.shoe); R(10, 37, 3, 2, o.shoe); P(7, 39, o.shoe); P(12, 39, o.shoe);
  } else if (o.legs === 'lehenga') {
    for (let r = 0; r < 13; r++) {
      const half = 4 + Math.floor(r / 2);
      R(10 - half, 26 + r, half * 2, 1, r % 4 === 3 ? o.skirtSh : o.skirt);
    }
    R(4, 36, 12, 2, o.trim); R(5, 31, 10, 1, o.trim);
    R(6, 39, 3, 1, o.shoe); R(11, 39, 3, 1, o.shoe);
  }

  // 3. torso
  if (o.torso === 'top') {
    R(6, 15, 8, 11, o.top); R(13, 16, 1, 10, o.topSh); R(6, 25, 8, 1, o.topSh);
    R(8, 15, 4, 1, SKIN); R(9, 16, 2, 1, SKIN);
  } else if (o.torso === 'coat') {
    R(5, 15, 10, 17, o.coat); R(9, 15, 2, 5, o.top);
    R(8, 15, 1, 6, o.coatSh); R(11, 15, 1, 6, o.coatSh);
    R(5, 23, 10, 1, o.belt); P(9, 23, GOLD); P(10, 23, GOLD);
    R(9, 24, 1, 8, o.coatSh); R(14, 16, 1, 15, o.coatSh); R(5, 31, 10, 1, o.coatSh);
  } else if (o.torso === 'blazer') {
    R(5, 15, 10, 12, o.coat); R(8, 15, 4, 5, o.top); R(9, 20, 2, 2, o.top);
    R(7, 15, 1, 6, o.coatSh); R(12, 15, 1, 6, o.coatSh); P(9, 23, GOLD); R(14, 16, 1, 11, o.coatSh);
  } else if (o.torso === 'cardigan') {
    R(5, 15, 10, 12, o.cardigan); R(8, 15, 4, 11, o.top); R(8, 15, 4, 1, SKIN);
    R(7, 16, 1, 10, o.cardiganSh); R(12, 16, 1, 10, o.cardiganSh); R(5, 26, 10, 1, o.cardiganSh);
  } else if (o.torso === 'denim') {
    R(6, 15, 8, 1, SKIN); R(7, 15, 1, 1, o.dress); R(12, 15, 1, 1, o.dress);
    R(6, 16, 8, 10, o.dress); R(13, 16, 1, 10, o.dressSh);
    R(7, 19, 6, 1, o.seam); R(8, 16, 1, 3, o.seam); R(11, 16, 1, 3, o.seam); R(9, 20, 1, 6, o.seam);
  } else if (o.torso === 'offshoulder') {
    R(5, 15, 10, 1, SKIN); R(6, 16, 8, 10, o.top); R(13, 16, 1, 10, o.topSh); R(6, 16, 8, 1, o.topSh);
  } else if (o.torso === 'dress') {
    R(6, 15, 8, 1, SKIN); R(6, 16, 8, 10, o.dress); R(13, 17, 1, 9, o.dressSh);
    [8, 10].forEach((x) => P(x, 15, o.necklace)); P(9, 16, o.necklace);
  } else if (o.torso === 'choli') {
    R(6, 15, 8, 6, o.top); R(6, 21, 8, 1, o.trim); R(7, 22, 6, 4, SKIN); R(8, 15, 4, 1, SKIN);
    for (let i = 0; i < 11; i++) R(5 + Math.round(i * 0.85), 15 + i, 2, 1, o.dupatta);
  }

  // 4. arms (sleeve colour for the first part of the arm, skin after)
  const sleeveFrac = { puff: 0.3, short: 0.3, full: 0.88, cardigan: 0.92, none: 0 }[o.sleeve] ?? 0.3;
  const sleeveCol = o.sleeve === 'full' ? o.coat : o.sleeve === 'cardigan' ? o.cardigan : o.top;
  const arm = ([a, b, c]) => {
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const lb = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const total = la + lb;
    const colorAt = (offset) => (len) => ((offset + len) / total < sleeveFrac ? sleeveCol : SKIN);
    g.stroke(X + a[0], Y + a[1], X + b[0], Y + b[1], (k) => colorAt(0)(k * la), o.sleeve === 'cardigan' ? 3 : 2);
    g.stroke(X + b[0], Y + b[1], X + c[0], Y + c[1], (k) => colorAt(la)(k * lb), o.sleeve === 'cardigan' ? 3 : 2);
  };
  const raised = (a) => a[2][1] < 12;
  if (!raised(armL)) arm(armL);
  if (!raised(armR)) arm(armR);
  if (o.sleeve === 'puff') { P(3, 16, o.top); P(16, 16, o.top); P(3, 17, o.topSh); P(16, 17, o.topSh); }

  // 5. racket (court)
  const rk = o.hair === 'ponytail' && (RACKET[pose] || RACKET.idle);
  if (rk) {
    const [gx, gy] = rk.grip;
    const [hx, hy] = rk.head;
    g.stroke(X + gx, Y + gy, X + hx, Y + hy, '#2B2350', 1);
    g.ellipse(X + hx, Y + hy, 3, 4, '#FF4FA3');
    g.ellipse(X + hx, Y + hy, 2, 3, '#E9EEF5');
    P(hx - 1, hy - 1, '#C7D0DC'); P(hx + 1, hy + 1, '#C7D0DC'); P(hx + 1, hy - 1, '#C7D0DC'); P(hx - 1, hy + 1, '#C7D0DC');
  }

  // 6. head
  g.map(X, Y, HEAD, { h: HAIR, H: HAIR_HI, s: SKIN, S: SKIN_SH, e: '#1A1423', L: '#1A1423', w: '#FFFFFF', b: '#E98A9A', m: '#8E3B46' });
  CURLS.forEach(([x, y]) => P(x, y, HAIR_HI));
  if (o.hair === 'ponytail') {
    // hair pulled back: clear the curly side volume below the ears
    for (let y = 9; y < 15; y++) [0, 1, 2, 17, 18, 19].forEach((x) => g.set(X + x, Y + y, null));
  } else {
    [[0, 13], [1, 14], [18, 13], [17, 14]].forEach(([x, y]) => P(x, y, HAIR_END));
  }
  if (o.band) R(2, 4, 16, 1, o.band);
  // gold hoops
  P(4, 12, GOLD); P(4, 13, GOLD); P(15, 12, GOLD); P(15, 13, GOLD);
  const closeEye = (x) => { P(x, 7, SKIN); P(x + 1, 7, SKIN); P(x, 8, '#1A1423'); P(x + 1, 8, '#1A1423'); };
  if (expr === 'blink') { closeEye(6); closeEye(12); }
  if (expr === 'wink') closeEye(12);
  if (expr === 'talk') { R(9, 10, 2, 2, '#8E3B46'); P(9, 11, '#5C1F2B'); }
  if (expr === 'star') {
    [[6, 7], [13, 7], [7, 8], [12, 8]].forEach(([x, y]) => P(x, y, GOLD));
    [[7, 7], [12, 7], [6, 8], [13, 8]].forEach(([x, y]) => P(x, y, '#FFFFFF'));
  }
  if (expr === 'think') { P(7, 8, '#1A1423'); P(7, 7, '#FFFFFF'); P(13, 8, '#1A1423'); P(13, 7, '#FFFFFF'); R(9, 10, 2, 1, SKIN); P(10, 10, '#8E3B46'); }

  // raised arms go in front of the hair
  if (raised(armL)) arm(armL);
  if (raised(armR)) arm(armR);

  // 7. accessories
  if (o.beret) {
    R(5, -2, 9, 1, o.beret); R(3, -1, 13, 2, o.beret); R(2, 1, 15, 1, o.beret); R(4, 2, 12, 1, '#5E1414');
    P(9, -3, o.beret);
  }
  if (o.bow) {
    R(13, -1, 3, 4, o.bow); R(17, -1, 3, 4, o.bow); R(16, 0, 1, 2, '#C2185B');
    P(14, 0, '#FFD6E8'); P(18, 0, '#FFD6E8');
  }
  if (pose === 'umbrella') {
    g.stroke(X + 16, Y + 7, X + 16, Y - 4, '#2B2350', 1);
    for (let r = 0; r <= 8; r++) {
      const w = Math.round(Math.sqrt(64 - (8 - r) * (8 - r)) * 1.3);
      for (let i = -w; i <= w; i++) g.set(X + 16 + i, Y - 13 + r, Math.abs(Math.floor(i / 4)) % 2 ? '#FF6FAE' : '#FF4FA3');
    }
  }
  if (o === OUTFITS.london && pose !== 'umbrella') {
    // iced latte in the left hand
    const [hx, hy] = armL[2];
    R(hx - 2, hy - 3, 3, 5, '#E9EEF5'); R(hx - 2, hy - 1, 3, 3, '#9C6B45'); R(hx - 1, hy - 6, 1, 3, '#FF6FAE');
  }

  return g.outline().canvas();
}

// Public: anchor is bottom-centre of the feet.
export const NAVYA_ANCHOR = { x: 17, y: 56 };

export function navya(outfit = 'home', pose = 'idle', frame = 0, expr = 'smile') {
  const o = OUTFITS[outfit];
  return baked(`navya:${outfit}:${pose}:${frame}:${expr}`, () => build(o, pose, frame, expr));
}

// Head-and-shoulders crop for dialog portraits.
export function portrait(outfit = 'home', expr = 'smile') {
  return baked(`portrait:${outfit}:${expr}`, () => {
    const full = navya(outfit, 'idle', 0, expr);
    const cv = document.createElement('canvas');
    cv.width = 26;
    cv.height = 30;
    cv.getContext('2d').drawImage(full, -4, -11);
    return cv;
  });
}

// Expression for "now": blinks every few seconds.
export function blinkExpr(t, base = 'smile') {
  return t % 4.2 > 4.05 ? 'blink' : base;
}
