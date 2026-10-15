// A Stage is one pixel canvas that fills its container. It picks a whole-number
// scale so pixels stay crisp, then hands the scene a small logical canvas (W×H)
// that the scene lays out with anchors instead of fixed coordinates.

const stages = new Set();

const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { e.target.__stage.visible = e.isIntersecting; }),
  { rootMargin: '120px 0px' },
);

export class Stage {
  constructor(el, scene, { frozen = false } = {}) {
    this.el = el;
    this.scene = scene;
    this.frozen = frozen;
    this.state = { p: scene.stillP ?? 0 };
    this.anchors = {};
    this.anchorCache = {};
    this.layers = new Map();
    this.visible = false;
    this.lastP = -1;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'stage-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    el.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    el.__stage = this;
    io.observe(el);
    new ResizeObserver(() => this.resize()).observe(el);
    stages.add(this);
    this.resize();
  }

  resize() {
    const cssW = this.el.clientWidth;
    const cssH = this.el.clientHeight;
    if (!cssW || !cssH) return;
    const landscape = cssW >= cssH * 0.95;
    const { targetH = 200, targetW = 140 } = this.scene;
    let s = landscape ? Math.round(cssH / targetH) : Math.round(cssW / targetW);
    s = Math.max(2, s);
    const W = Math.ceil(cssW / s);
    const H = Math.ceil(cssH / s);
    if (W === this.W && H === this.H && s === this.s) return;
    Object.assign(this, { W, H, s, landscape });
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.style.width = `${W * s}px`;
    this.canvas.style.height = `${H * s}px`;
    this.ctx.imageSmoothingEnabled = false;
    this.el.style.setProperty('--px', `${s}px`);
    this.layers.clear();
    this.anchorCache = {};
    this.scene.resize?.(this);
    this.render(this.t || 0, true);
  }

  // Cache a static layer (redrawn only when the size changes).
  layer(key, paint) {
    let cv = this.layers.get(key);
    if (!cv) {
      cv = document.createElement('canvas');
      cv.width = this.W;
      cv.height = this.H;
      const c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      paint(c, this.W, this.H);
      this.layers.set(key, cv);
    }
    this.ctx.drawImage(cv, 0, 0);
  }

  // Expose a logical point to CSS so HTML overlays can sit on top of pixel art.
  anchor(name, x, y) {
    const key = `${Math.round(x)},${Math.round(y)}`;
    if (this.anchorCache[name] === key) return;
    this.anchorCache[name] = key;
    this.anchors[name] = { x, y };
    this.el.style.setProperty(`--${name}-x`, `${Math.round(x) * this.s}px`);
    this.el.style.setProperty(`--${name}-y`, `${Math.round(y) * this.s}px`);
  }

  render(time, force = false) {
    if (!this.W) return;
    if (this.frozen && !force && this.state.p === this.lastP) return;
    this.lastP = this.state.p;
    this.t = time;
    this.scene.draw(this.ctx, this, this.frozen ? 0 : time);
  }
}

export function tick(time) {
  for (const s of stages) if (s.visible) s.render(time);
}
