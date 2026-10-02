// Canvas motion components: falling strands, scissor cut-line, waves, marquee,
// dye brush, splash, plus scroll reveals / parallax / tilt (MBMotion.init).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAL = ['#b5abfc', '#9397ab', '#d2cefd', '#796cbf', '#cfd3e5', '#e7e5fe'];
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function drawScissors(ctx, x, y, dir, open, S) {
  const L = S * 0.6, H = S * 0.36, W = S * 0.075, lw = Math.max(1.2, S * 0.011);
  ctx.save(); ctx.translate(x, y); ctx.rotate(dir); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const side of [1, -1]) {
    ctx.save(); ctx.rotate(-open * side); ctx.scale(1, side);
    ctx.lineWidth = lw; ctx.strokeStyle = '#9184d9';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-H * 0.45, W * 1.2, -H * 0.72, W * 2.1); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-H, W * 2.6, S * 0.14, S * 0.095, -0.35, 0, Math.PI * 2); ctx.fillStyle = '#2b2d3a'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-H, W * 2.6, S * 0.085, S * 0.05, -0.35, 0, Math.PI * 2); ctx.fillStyle = '#161826'; ctx.fill(); ctx.strokeStyle = '#5d5294'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-S * 0.04, 0); ctx.quadraticCurveTo(L * 0.45, -W * 1.5, L, 0); ctx.quadraticCurveTo(L * 0.5, W * 0.35, -S * 0.04, W * 0.4); ctx.closePath();
    ctx.fillStyle = '#2e3040'; ctx.fill(); ctx.strokeStyle = '#9184d9'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L * 0.12, -W * 0.55); ctx.quadraticCurveTo(L * 0.5, -W * 1.05, L * 0.9, -W * 0.2); ctx.strokeStyle = 'rgba(210,206,253,.6)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0, 0, S * 0.03, 0, Math.PI * 2); ctx.fillStyle = '#d2cefd'; ctx.fill();
  ctx.restore();
}

function drawComb(ctx, x, y, S) {
  const H = S * 0.46, sw = S * 0.1, tl = S * 0.2, n = 13;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.12); ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1.2, S * 0.012); ctx.strokeStyle = '#9184d9';
  for (let i = 0; i < n; i++) { const ty = -H * 0.85 + i * (H * 1.7 / (n - 1)); ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(-tl * (i % 4 === 0 ? 1 : 0.82), ty); ctx.stroke(); }
  ctx.beginPath(); ctx.roundRect(0, -H, sw, H * 2, sw * 0.45); ctx.fillStyle = '#2e3040'; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sw * 0.38, -H * 0.8); ctx.lineTo(sw * 0.38, H * 0.8); ctx.strokeStyle = 'rgba(210,206,253,.55)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}
function drawBrush(ctx, x, y, S, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(-0.75); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, -S * 0.07); ctx.lineTo(S * 0.24, -S * 0.055); ctx.lineTo(S * 0.24, S * 0.055); ctx.lineTo(0, S * 0.07); ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, S * 0.24, 0); g.addColorStop(0, '#d2cefd'); g.addColorStop(1, '#796cbf'); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#cfd3e5'; ctx.fillRect(S * 0.24, -S * 0.06, S * 0.1, S * 0.12);
  ctx.beginPath(); ctx.roundRect(S * 0.34, -S * 0.032, S * 0.72, S * 0.064, S * 0.03); ctx.fillStyle = '#2e3040'; ctx.fill(); ctx.strokeStyle = '#9184d9'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S * 1.06, 0); ctx.lineTo(S * 1.36, 0); ctx.strokeStyle = '#9184d9'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}
function drawDrop(ctx, d, col) {
  const sp = Math.hypot(d.vx, d.vy), an = Math.atan2(d.vy, d.vx), st = Math.min(2.6, 1 + sp / 500);
  ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(an); ctx.globalAlpha = d.a ?? 1;
  ctx.beginPath(); ctx.ellipse(0, 0, d.r * st, d.r, 0, 0, 6.283); ctx.fillStyle = col || 'rgba(210,206,253,.9)'; ctx.fill();
  ctx.beginPath(); ctx.arc(d.r * 0.3, -d.r * 0.35, d.r * 0.3, 0, 6.283); ctx.fillStyle = '#f5f4ff'; ctx.fill(); ctx.restore();
}

class Strand {
  constructor(w, h, top, x, y, small) { this.reset(w, h, top, x, y, small); }
  reset(w, h, top, x, y, small) {
    this.x = x ?? rnd(-40, w + 40); this.y = y ?? (top ? rnd(-140, -20) : rnd(0, h));
    this.len = small ? rnd(10, 30) : rnd(26, 84); this.rot = rnd(0, 6.28); this.vr = rnd(-0.6, 0.6);
    this.vy = small ? rnd(30, 70) : rnd(14, 44); this.vx = small ? rnd(-30, 30) : 0; this.ph = rnd(0, 6.28); this.fr = rnd(0.6, 1.6);
    this.amp = rnd(8, 26); this.curl = rnd(-1, 1); this.col = PAL[(Math.random() * PAL.length) | 0];
    this.a = small ? rnd(0.5, 0.9) : rnd(0.16, 0.5); this.lw = small ? rnd(0.8, 1.4) : rnd(0.6, 1.5);
  }
  step(wind, dt) {
    this.ph += dt * this.fr;
    const tx = wind * 38 + Math.sin(this.ph) * this.amp;
    this.vx += (tx - this.vx) * Math.min(1, dt * 1.5);
    this.x += this.vx * dt; this.y += this.vy * dt; this.rot += (this.vr + this.vx * 0.01) * dt;
  }
  draw(ctx) {
    const L = this.len / 2, c = this.curl * Math.sin(this.ph * 1.3) * L * 0.5;
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot);
    ctx.beginPath(); ctx.moveTo(-L, 0); ctx.bezierCurveTo(-L / 3, c, L / 3, -c, L, c * 0.3);
    ctx.globalAlpha = this.a; ctx.strokeStyle = this.col; ctx.lineWidth = this.lw; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  }
}

class CanvasEl extends HTMLElement {
  connectedCallback() {
    if (this._cv) return;
    this.setup();
    const cv = this._cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
    const sr = this.shadowRoot || this.attachShadow({ mode: 'open' }); const css = document.createElement('style'); css.textContent = this.hostCss(); sr.append(css, cv); this.ctx = cv.getContext('2d'); this.t = 0; this.last = 0;
    this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.on = es[0].isIntersecting; this.last = 0; if (this.on) this.loop(); }, { rootMargin: '120px' }); this.io.observe(this);
    this.fit();
  }
  disconnectedCallback() { this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); this.on = false; cancelAnimationFrame(this.raf); this.raf = 0; this._cv && this._cv.remove(); this._cv = null; }
  fit() {
    const w = this.offsetWidth, h = this.offsetHeight, d = Math.min(devicePixelRatio || 1, 2); if (!w || !h || !this._cv) return;
    this.w = w; this.h = h; this._cv.width = Math.round(w * d); this._cv.height = Math.round(h * d); this.ctx.setTransform(d, 0, 0, d, 0, 0);
    this.resized && this.resized(); this.frame(0);
  }
  loop() {
    if (this.raf || reduce) return;
    const tick = ts => { this.raf = 0; if (!this.on || !this._cv) return; const dt = this.last ? Math.min(0.05, (ts - this.last) / 1000) : 0.016; this.last = ts; this.frame(dt); this.raf = requestAnimationFrame(tick); };
    this.raf = requestAnimationFrame(tick);
  }
}

class Strands extends CanvasEl {
  hostCss() { return ':host{position:absolute;inset:0;display:block;overflow:hidden;pointer-events:none}'; }
  setup() { this.amb = []; this.bits = []; this.pc = 0; }
  lockFrame(ctx, dt, wind, corner) {
    const { w, h } = this, S = 130 * clamp(w / 900, 0.6, 1), right = !corner.includes('l');
    const lx = right ? w - 22 - S * 0.95 : 22 + S * 0.95;
    let L = this.lock;
    if (!L) L = this.lock = { st: 'cut', sx: 0, cyc: 0.1, pc: 0.1, sy: 0, len: 0, yo: 0, al: 1, hair: Array.from({ length: 16 }, (_, i) => ({ off: (i - 7.5) * 2.4, jit: rnd(-5, 5), ph: rnd(0, 6.28), col: PAL[(Math.random() * PAL.length) | 0], a: rnd(0.55, 0.95), lw: rnd(0.8, 1.6), fan: rnd(-6, 6) })) };
    const max = Math.min(h * 0.5, 230 * clamp(w / 900, 0.7, 1)), min = max * 0.5, cut = max * 0.075;
    if (!L.len) { L.len = max; L.sy = max; }
    const at = (q, s) => [lx + q.off * (1 + s * 0.9) + q.fan * s + Math.sin(this.t * 1.3 + q.ph + s * 3) * Math.pow(s, 1.5) * 5 + wind * s * s * 8, -6 + L.yo + s * (L.len + q.jit * 0.5)];
    if (L.st === 'cut') {
      L.cyc = (L.cyc + dt * 1.05) % 1;
      if (L.cyc < L.pc) {
        for (const q of L.hair) { const [x, y] = at(q, 1); const b = new Strand(w, h, false, x, y - 2, true); b.len = rnd(6, cut + 8); b.vy = rnd(10, 30); b.vx = rnd(-10, 10); b.a = q.a * 0.9; b.col = q.col; b.lw = q.lw; b.rot = Math.PI / 2 + rnd(-0.3, 0.3); this.bits.push(b); }
        L.len -= cut; if (L.len <= min) L.st = 'away';
      }
      L.pc = L.cyc; L.sx += (0 - L.sx) * Math.min(1, dt * 6);
    } else if (L.st === 'away') {
      L.sx += (S * 1.9 - L.sx) * Math.min(1, dt * 3); L.al -= dt * 1.4;
      if (L.al <= 0) { L.len = max; L.yo = -max - 30; L.al = 1; L.st = 'drop'; }
    } else if (L.st === 'drop') {
      L.yo += (0 - L.yo) * Math.min(1, dt * 3.2); if (L.yo > -1) { L.yo = 0; L.st = 'back'; }
    } else { L.sx += (0 - L.sx) * Math.min(1, dt * 4); if (L.sx < 2) { L.st = 'cut'; L.cyc = 0.1; L.pc = 0.1; } }
    L.sy += (L.len + L.yo - 2 - L.sy) * Math.min(1, dt * 5);
    ctx.lineCap = 'round';
    for (const q of L.hair) { ctx.beginPath(); for (let k = 0; k <= 12; k++) { const [x, y] = at(q, k / 12); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.globalAlpha = q.a * Math.max(0, L.al); ctx.strokeStyle = q.col; ctx.lineWidth = q.lw; ctx.stroke(); }
    ctx.globalAlpha = 1;
    const open = L.st === 'cut' ? 0.04 + 0.32 * (L.cyc < 0.72 ? Math.sin((L.cyc / 0.72) * Math.PI / 2) : Math.cos(((L.cyc - 0.72) / 0.28) * Math.PI / 2)) : 0.3;
    drawScissors(ctx, right ? lx + S * 0.42 + L.sx : lx - S * 0.42 - L.sx, L.sy, right ? Math.PI : 0, open, S);
  }
  resized() {
    const n = Math.round((+this.getAttribute('count') || 40) * clamp(this.w * this.h / 1e6, 0.4, 1.2));
    while (this.amb.length < n) this.amb.push(new Strand(this.w, this.h, false)); this.amb.length = n;
  }
  frame(dt) {
    const { ctx, w, h } = this; if (!w) return; this.t += dt;
    const g = this.getAttribute('wind') === 'global' ? (window.__mbWind || 0) : 0;
    const wind = g * 1.6 + Math.sin(this.t * 0.35) * 0.35 + (+(this.getAttribute('breeze') ?? 0.25));
    ctx.clearRect(0, 0, w, h);
    for (const s of this.amb) { s.step(wind, dt); if (s.y > h + 60 || s.x < -140 || s.x > w + 140) s.reset(w, h, true); s.draw(ctx); }
    const corner = this.getAttribute('scissors');
    if (corner && corner !== 'none' && this.getAttribute('scissors-mode') === 'lock') this.lockFrame(ctx, dt, wind, corner);
    else if (corner && corner !== 'none') {
      const S = 150 * clamp(w / 900, 0.56, 1), m = 22 + S * 0.5;
      const r = corner.includes('r'), b = corner.includes('b');
      const px = r ? w - m : m, py = b ? h - m : m;
      const dir = Math.atan2(b ? -1 : 1, r ? -1 : 1) + Math.sin(this.t * 0.8) * 0.07;
      const cyc = (this.t * 1.05) % 1;
      const open = 0.04 + 0.32 * (cyc < 0.72 ? Math.sin((cyc / 0.72) * Math.PI / 2) : Math.cos(((cyc - 0.72) / 0.28) * Math.PI / 2));
      if (cyc < this.pc) { const k = S * 0.42; for (let i = 0; i < 5; i++) this.bits.push(new Strand(w, h, false, px + Math.cos(dir) * k + rnd(-8, 8), py + Math.sin(dir) * k + rnd(-8, 8), true)); }
      this.pc = cyc;
      drawScissors(ctx, px, py, dir, open, S);
    }
    this.bits = this.bits.filter(s => { s.step(wind * 0.6, dt); s.draw(ctx); return s.y < h + 40; });
  }
}

class Cutline extends CanvasEl {
  hostCss() { return ':host{display:block;position:relative;overflow:hidden;height:120px}'; }
  setup() { this.p = 0; this.bits = []; this.lx = -1e9; }
  frame(dt) {
    const { ctx, w, h } = this; if (!w) return; this.t += dt;
    let target; const mode = this.getAttribute('mode'), comb = this.getAttribute('reverse') === 'comb';
    const S = 110 * clamp(w / 900, 0.6, 1), mid = h / 2, z = 14;
    if (this.getAttribute('auto')) target = (this.t * 0.18) % 1.25;
    else if (mode === 'loop') { const run = (w + S * 1.6) / 280, ph = (this.t / run) % 2.5; target = ph < 1 ? ph : ph < 1.25 ? 1 : ph < 2.25 ? 2.25 - ph : 0; }
    else { const r = this.getBoundingClientRect(), vh = innerHeight; target = clamp((vh * 0.95 - r.top) / (vh * 0.6), 0, 1); }
    this.p += (target - this.p) * Math.min(1, dt * 6 || 1); if (this.getAttribute('auto') || mode === 'loop') this.p = target;
    const cx = -S * 0.8 + Math.min(1, this.p) * (w + S * 1.6);
    const dcx = cx - (this.pcx ?? cx); this.pcx = cx; if (Math.abs(dcx) > 0.3) this.dirn = Math.sign(dcx);
    const combing = comb && this.dirn < 0;
    const top = this.getAttribute('top') || '#161826', bot = this.getAttribute('bottom') || '#232532';
    ctx.fillStyle = top; ctx.fillRect(0, 0, w, h);
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w + z; x += z / 2) {
      const zz = x < cx ? (((x / (z / 2)) | 0) % 2 ? 6 : -6) : 0; ctx.lineTo(Math.min(x, w), mid + zz);
    }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = bot; ctx.fill();
    if (cx < w) { ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = '#5d5294'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.max(0, cx), mid); ctx.lineTo(w, mid); ctx.stroke(); ctx.restore(); }
    if (!combing && cx - this.lx > z && cx > 0 && cx < w) { this.lx = cx; this.bits.push({ x: cx, y: mid, vx: rnd(-20, 20), vy: rnd(10, 40), r: rnd(0, 6), vr: rnd(-4, 4), s: rnd(4, 8), a: 1 }); }
    if (cx < this.lx - z) this.lx = cx;
    this.bits = this.bits.filter(b => { b.vy += 120 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt; b.a -= dt * 0.9; if (b.a <= 0) return false;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.globalAlpha = b.a; ctx.fillStyle = '#b5abfc'; ctx.beginPath(); ctx.moveTo(-b.s / 2, 0); ctx.lineTo(0, -b.s * 0.6); ctx.lineTo(b.s / 2, 0); ctx.closePath(); ctx.fill(); ctx.restore(); return true; });
    if (cx > -S && cx < w + S) { if (combing) drawComb(ctx, cx, mid, S); else drawScissors(ctx, cx, mid, 0, 0.08 + 0.24 * Math.abs(Math.sin(cx * 0.045)), S); }
  }
}

class Wave extends CanvasEl {
  hostCss() { return ':host{display:block;position:relative;overflow:hidden;height:110px}'; }
  setup() {}
  frame(dt) {
    const { ctx, w, h } = this; if (!w) return; this.t += dt; const t = this.t;
    const y = x => h * 0.52 + Math.sin(x * 0.006 + t * 0.8) * h * 0.18 + Math.sin(x * 0.013 - t * 0.5) * h * 0.1;
    ctx.fillStyle = this.getAttribute('top') || '#161826'; ctx.fillRect(0, 0, w, h);
    ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, y(x)); ctx.lineTo(w, h); ctx.closePath();
    ctx.fillStyle = this.getAttribute('bottom') || '#262a60'; ctx.fill();
    [[-9, 0.55], [-18, 0.28], [-27, 0.14]].forEach(([o, a]) => { ctx.beginPath(); for (let x = 0; x <= w + 8; x += 8) ctx[x ? 'lineTo' : 'moveTo'](x, y(x + o * 6) + o); ctx.strokeStyle = `rgba(145,132,217,${a})`; ctx.lineWidth = 1; ctx.stroke(); });
  }
}

class Dye extends CanvasEl {
  hostCss() { return ':host{position:absolute;inset:0;display:block;overflow:hidden;pointer-events:none}'; }
  setup() { this.drips = []; }
  resized() {
    const n = 38; this.lw = Math.min(this.w * 0.46, 230); this.cx = this.w * 0.44;
    this.sd = Array.from({ length: n }, (_, i) => ({ x: this.cx - this.lw / 2 + (i / (n - 1)) * this.lw + rnd(-3, 3), ph: rnd(0, 6.28), a: rnd(4, 11), f: rnd(4, 7), w: rnd(1, 2), l: rnd(0.9, 1) }));
  }
  frame(dt) {
    const { ctx, w, h } = this; if (!w || !this.sd) return; this.t += dt; const t = this.t;
    const T = 7.5, p = (t % T) / T, top = h * 0.04, bot = h * 0.96, span = bot - top;
    const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const paint = p < 0.6 ? ease(p / 0.6) : 1, fade = p < 0.82 ? 1 : 1 - (p - 0.82) / 0.18;
    ctx.clearRect(0, 0, w, h); ctx.lineCap = 'round';
    const pt = (q, s) => [q.x + (q.x - this.cx) * s * 0.35 + Math.sin(s * q.f + q.ph + t * 0.7) * q.a * s, top + s * span * q.l];
    const g = ctx.createLinearGradient(0, top, 0, bot); g.addColorStop(0, '#5d5294'); g.addColorStop(0.45, '#9184d9'); g.addColorStop(1, '#e7e5fe');
    for (const q of this.sd) {
      ctx.beginPath(); for (let k = 0; k <= 24; k++) { const [x, y] = pt(q, k / 24); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.globalAlpha = 0.9; ctx.strokeStyle = '#595d6c'; ctx.lineWidth = q.w; ctx.stroke();
      if (paint > 0.001 && fade > 0) {
        ctx.beginPath(); let k = 0; for (; k / 24 <= paint; k++) { const [x, y] = pt(q, k / 24); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        const [ex, ey] = pt(q, paint); ctx.lineTo(ex, ey);
        ctx.globalAlpha = fade; ctx.strokeStyle = g; ctx.lineWidth = q.w + 0.5; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    const S = Math.min(150, w * 0.32);
    if (p < 0.72) {
      const lift = p > 0.6 ? (p - 0.6) / 0.12 : 0, by = top + paint * span * 0.97, bx = this.cx + Math.sin(t * 3.4) * this.lw * 0.42;
      drawBrush(ctx, bx + lift * 70, by - lift * 50, S, 1 - lift);
      if (lift === 0 && Math.random() < dt * 2.4) this.drips.push({ x: bx, y: by + 6, vx: 0, vy: 0, r: rnd(1.6, 2.6), a: 1 });
    }
    this.drips = this.drips.filter(d => { d.vy += 520 * dt; d.y += d.vy * dt; d.a -= dt * 0.7; if (d.a <= 0 || d.y > h + 10) return false; drawDrop(ctx, d, '#b5abfc'); return true; });
  }
}

class Splash extends CanvasEl {
  hostCss() { return ':host{position:absolute;inset:0;display:block;overflow:hidden;pointer-events:none}'; }
  setup() { this.drops = []; this.rips = []; this.next = 0.3; }
  resized() {
    this.bub = Array.from({ length: 14 }, () => ({ x: rnd(0, this.w), y: rnd(this.h * 0.65, this.h), r: rnd(1.5, 4), v: rnd(10, 26), ph: rnd(0, 6) }));
    this.lock = Array.from({ length: 16 }, (_, i) => ({ dx: (i - 7.5) * 3.2 + rnd(-1, 1), ph: rnd(0, 6.28), w: rnd(0.8, 1.5), c: PAL[(Math.random() * PAL.length) | 0] }));
  }
  frame(dt) {
    const { ctx, w, h } = this; if (!w || !this.lock) return; this.t += dt; const t = this.t, sy = h * 0.6, lx = w * 0.26;
    const surf = x => { let y = sy + Math.sin(x * 0.018 + t * 1.5) * 3 + Math.sin(x * 0.041 - t * 1.1) * 1.5; for (const r of this.rips) { const d = Math.abs(x - r.x); y += r.amp * Math.exp(-r.age * 1.6) * Math.sin(d * 0.09 - r.age * 11) * Math.exp(-d / (40 + r.age * 160)); } return y; };
    ctx.clearRect(0, 0, w, h); ctx.lineCap = 'round';
    for (const q of this.lock) { ctx.beginPath(); for (let k = 0; k <= 30; k++) { const s = k / 30, y = s * h * 0.96, u = Math.max(0, (y - sy) / (h - sy)); const x = lx + q.dx * (1 + s * 0.8) + Math.sin(t * 0.6 + q.ph + s * 4) * (2 + u * 24) + u * u * 26 * Math.sin(t * 0.3 + q.ph); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = q.c; ctx.globalAlpha = 0.8; ctx.lineWidth = q.w; ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(0, h); for (let x = 0; x <= w + 6; x += 6) ctx.lineTo(x, surf(x)); ctx.lineTo(w, h); ctx.closePath();
    const g = ctx.createLinearGradient(0, sy, 0, h); g.addColorStop(0, 'rgba(53,59,128,.55)'); g.addColorStop(1, 'rgba(38,42,96,.9)'); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); for (let x = 0; x <= w + 6; x += 6) ctx[x ? 'lineTo' : 'moveTo'](x, surf(x)); ctx.strokeStyle = 'rgba(210,206,253,.85)'; ctx.lineWidth = 1.2; ctx.stroke();
    for (const r of this.rips) { r.age += dt; const rx = r.age * 150, a = Math.max(0, 0.7 - r.age * 0.45); if (a > 0) { ctx.beginPath(); ctx.ellipse(r.x, sy + 2, rx, rx * 0.16, 0, 0, 6.283); ctx.strokeStyle = 'rgba(181,171,252,' + a + ')'; ctx.lineWidth = 1; ctx.stroke(); } }
    this.rips = this.rips.filter(r => r.age < 3);
    ctx.lineWidth = 1;
    for (const b of this.bub) { b.y -= b.v * dt; b.ph += dt * 2; if (b.y < surf(b.x) + 4) { b.y = h + rnd(0, 40); b.x = rnd(0, w); } ctx.beginPath(); ctx.arc(b.x + Math.sin(b.ph) * 3, b.y, b.r, 0, 6.283); ctx.strokeStyle = 'rgba(210,206,253,.45)'; ctx.stroke(); }
    this.next -= dt; if (this.next <= 0) { this.next = rnd(0.9, 1.7); this.drops.push({ x: rnd(w * 0.45, w * 0.85), y: -10, vx: 0, vy: 60, r: rnd(4, 6.5), big: true }); }
    const spawn = [];
    this.drops = this.drops.filter(d => {
      d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.vy > 0 && d.y >= surf(d.x)) {
        if (d.big) { this.rips.push({ x: d.x, age: 0, amp: 9 }); const n = 12 + (Math.random() * 6 | 0); for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + rnd(-1.1, 1.1), sp = rnd(160, 380); spawn.push({ x: d.x, y: d.y - 3, vx: Math.cos(an) * sp * 0.8, vy: Math.sin(an) * sp, r: rnd(1.2, 3), big: false }); } spawn.push({ x: d.x, y: d.y - 3, vx: 0, vy: -rnd(300, 420), r: 3.5, big: false }); }
        else this.rips.push({ x: d.x, age: 0.6, amp: 2 });
        return false;
      }
      drawDrop(ctx, d); return d.y < h + 20;
    }).concat(spawn);
  }
}

class Marquee extends HTMLElement {
  connectedCallback() {
    if (this._t) return;
    const words = (this.getAttribute('text') || '').split('|');
    const track = this._t = document.createElement('div'); track.style.cssText = 'display:flex;width:max-content;will-change:transform';
    const mk = () => { const g = document.createElement('div'); g.style.cssText = 'display:flex;align-items:center;flex:none';
      words.forEach(t => { const s = document.createElement('span'); s.textContent = t; s.style.cssText = 'padding:0 .3em;white-space:nowrap'; const i = document.createElement('span'); i.style.cssText = 'flex:none;width:.16em;height:.16em;border-radius:50%;background:#9184d9;margin:0 .35em'; g.append(s, i); }); return g; };
    track.append(mk(), mk(), mk());
    const css = document.createElement('style'); css.textContent = ':host{display:block;overflow:hidden}'; this.attachShadow({ mode: 'open' }).append(css, track);
    const rev = this.hasAttribute('reverse'), dur = (+this.getAttribute('duration') || 30) * 1000;
    const kf = [{ transform: 'translateX(0)' }, { transform: 'translateX(-33.333%)' }];
    this.anim = track.animate(rev ? kf.reverse() : kf, { duration: dur, iterations: Infinity });
    if (reduce) this.anim.pause();
    let ly = scrollY;
    this._sc = () => { const v = Math.abs(scrollY - ly); ly = scrollY; this.anim.playbackRate = 1 + Math.min(5, v * 0.1); clearTimeout(this._to); this._to = setTimeout(() => { this.anim.playbackRate = 1; }, 140); };
    addEventListener('scroll', this._sc, { passive: true });
  }
  disconnectedCallback() { removeEventListener('scroll', this._sc); }
}

const para = [];
let bound = false;
const upd = () => { const vh = innerHeight; para.forEach(el => { if (!el.isConnected) return; const r = el.parentElement.getBoundingClientRect(); const c = r.top + r.height / 2 - vh / 2; el.style.transform = `translate3d(0,${(-c * (+el.dataset.speed || 0)).toFixed(1)}px,0)`; }); };
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; io.unobserve(el); el.style.opacity = '';
  el.animate([{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: +el.dataset.delay || 0, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
}), { threshold: 0.1 });

window.MBMotion = {
  drawScissors, drawComb,
  init(root = document) {
    if (reduce) return;
    root.querySelectorAll('[data-reveal]:not([data-mb])').forEach(el => { el.dataset.mb = '1'; el.style.opacity = '0'; io.observe(el); });
    root.querySelectorAll('[data-rise]:not([data-mb])').forEach((el, i) => { el.dataset.mb = '1'; el.animate([{ transform: 'translateY(108%)' }, { transform: 'none' }], { duration: 1300, delay: 150 + i * 160, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }); });
    root.querySelectorAll('[data-speed]:not([data-mb])').forEach(el => { el.dataset.mb = '1'; para.push(el); });
    root.querySelectorAll('[data-tilt]:not([data-mb])').forEach(el => {
      el.dataset.mb = '1';
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transition = 'transform .12s'; el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`; });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1)'; el.style.transform = ''; });
    });
    if (!bound) { bound = true; addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); addEventListener('resize', upd); }
    upd();
  }
};
customElements.get('mb-strands') || customElements.define('mb-strands', Strands);
customElements.get('mb-cutline') || customElements.define('mb-cutline', Cutline);
customElements.get('mb-wave') || customElements.define('mb-wave', Wave);
customElements.get('mb-marquee') || customElements.define('mb-marquee', Marquee);
customElements.get('mb-dye') || customElements.define('mb-dye', Dye);
customElements.get('mb-splash') || customElements.define('mb-splash', Splash);

export const MBMotion = window.MBMotion;
