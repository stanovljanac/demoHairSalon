// <mb-3d> — three.js models: dryer-hair, clipper-flat, spray-hair, chair (+ legacy dryer/spray/clipper).
// three.js is code-split and only fetched once a 3D model scrolls into view.
let P; const load = () => P || (P = import('three'));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);

function sprite(T) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c);
}
function particles(T, n, color, size) {
  const geo = new T.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const pts = new T.Points(geo, new T.PointsMaterial({ size, map: sprite(T), vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  pts.frustumCulled = false;
  const L = Array.from({ length: n }, () => ({ life: 0, max: 1, p: new T.Vector3(), v: new T.Vector3() })), base = new T.Color(color); let k = 0;
  return {
    pts,
    emit(o, d, spread, speed, life) { const q = L[k = (k + 1) % n]; q.p.copy(o); q.v.set(d.x + rnd(-1, 1) * spread, d.y + rnd(-1, 1) * spread, d.z + rnd(-1, 1) * spread).normalize().multiplyScalar(speed * rnd(0.7, 1.2)); q.life = q.max = life * rnd(0.7, 1.2); },
    step(dt, drag, lift) {
      L.forEach((q, i) => { if (q.life > 0) { q.life -= dt; q.v.multiplyScalar(Math.max(0, 1 - drag * dt)); q.v.y += lift * dt; q.p.addScaledVector(q.v, dt); }
        const f = q.life > 0 ? Math.sin(Math.max(0, q.life / q.max) * Math.PI) : 0;
        pos[i * 3] = q.p.x; pos[i * 3 + 1] = q.p.y; pos[i * 3 + 2] = q.p.z; col[i * 3] = base.r * f; col[i * 3 + 1] = base.g * f; col[i * 3 + 2] = base.b * f; });
      geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    }
  };
}
function mats(T) {
  return {
    body: new T.MeshPhysicalMaterial({ color: 0x33364a, roughness: 0.3, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 }),
    dark: new T.MeshStandardMaterial({ color: 0x15161f, roughness: 0.75 }),
    acc: new T.MeshStandardMaterial({ color: 0x9184d9, emissive: 0x5d5294, emissiveIntensity: 1.1, roughness: 0.35 }),
    chrome: new T.MeshStandardMaterial({ color: 0xd2cefd, metalness: 0.7, roughness: 0.25 })
  };
}
function dryer(T, m) {
  const g = new T.Group(), add = (geo, mat, f) => { const o = new T.Mesh(geo, mat); f && f(o); g.add(o); return o; };
  add(new T.CapsuleGeometry(0.62, 1.3, 16, 48), m.body, o => { o.rotation.z = Math.PI / 2; });
  add(new T.CylinderGeometry(0.36, 0.52, 0.75, 48), m.body, o => { o.rotation.z = -Math.PI / 2; o.position.x = 1.35; });
  add(new T.CylinderGeometry(0.3, 0.3, 0.02, 40), m.dark, o => { o.rotation.z = -Math.PI / 2; o.position.x = 1.73; });
  add(new T.TorusGeometry(0.34, 0.028, 12, 48), m.acc, o => { o.rotation.y = Math.PI / 2; o.position.x = 1.725; });
  add(new T.TorusGeometry(0.625, 0.032, 12, 64), m.acc, o => { o.rotation.y = Math.PI / 2; o.position.x = 0.6; });
  add(new T.TorusGeometry(0.625, 0.014, 8, 64), m.chrome, o => { o.rotation.y = Math.PI / 2; o.position.x = 0.45; });
  add(new T.CircleGeometry(0.42, 48), m.dark, o => { o.rotation.y = -Math.PI / 2; o.position.x = -1.112; });
  [0.36, 0.26, 0.16].forEach(r => add(new T.TorusGeometry(r, 0.018, 8, 48), m.chrome, o => { o.rotation.y = Math.PI / 2; o.position.x = -1.12; }));
  const fan = new T.Group(); for (let i = 0; i < 5; i++) { const h = new T.Group(); const b = new T.Mesh(new T.BoxGeometry(0.012, 0.3, 0.07), m.chrome); b.position.y = 0.16; h.add(b); h.rotation.x = i * Math.PI * 2 / 5; fan.add(h); }
  fan.position.x = -1.14; g.add(fan);
  const handle = add(new T.CapsuleGeometry(0.21, 1.05, 12, 28), m.body, o => { o.position.set(-0.2, -1.05, 0); o.rotation.z = -0.2; });
  const grip = new T.Mesh(new T.CapsuleGeometry(0.217, 0.45, 8, 28), m.dark); grip.position.y = -0.25; handle.add(grip);
  const b1 = new T.Mesh(new T.BoxGeometry(0.08, 0.16, 0.12), m.acc); b1.position.set(0.2, 0.3, 0); handle.add(b1);
  const b2 = new T.Mesh(new T.BoxGeometry(0.08, 0.1, 0.12), m.chrome); b2.position.set(0.2, 0.1, 0); handle.add(b2);
  const curve = new T.CatmullRomCurve3([new T.Vector3(-0.35, -1.75, 0), new T.Vector3(-0.42, -2.1, 0.1), new T.Vector3(-0.2, -2.35, 0.35), new T.Vector3(0.25, -2.3, 0.25), new T.Vector3(0.55, -2.55, 0)]);
  add(new T.TubeGeometry(curve, 60, 0.045, 10), m.body);
  return { g, fan, nozzle: new T.Vector3(1.78, 0, 0) };
}
function label(T) {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 704; const x = c.getContext('2d');
  x.fillStyle = '#161826'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#9184d9'; x.fillRect(0, 28, c.width, 6); x.fillRect(0, c.height - 34, c.width, 6);
  [0.25, 0.75].forEach(u => {
    const cx = u * c.width; x.textAlign = 'center'; x.fillStyle = '#e9e9ed';
    x.font = '500 220px Inter, system-ui, sans-serif'; x.fillText('MB', cx, 330);
    x.fillStyle = '#d2cefd'; x.font = '500 52px Inter, system-ui, sans-serif'; x.fillText('F I N I S H I N G   M I S T', cx, 460);
    x.fillStyle = '#b2b6ca'; x.font = '400 40px Inter, system-ui, sans-serif'; x.fillText('Hold · Shine · 250 ml', cx, 560);
  });
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}
function spray(T, m) {
  const g = new T.Group();
  const can = new T.MeshPhysicalMaterial({ color: 0x3a3d52, metalness: 0.55, roughness: 0.28, clearcoat: 1 });
  g.add(new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 2.1, 64), can));
  const lab = new T.Mesh(new T.CylinderGeometry(0.556, 0.556, 1.35, 96, 1, true), new T.MeshStandardMaterial({ map: label(T), roughness: 0.5 })); lab.position.y = -0.1; lab.rotation.y = -Math.PI / 2; g.add(lab);
  const sh = new T.Mesh(new T.SphereGeometry(0.55, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), can); sh.scale.y = 0.42; sh.position.y = 1.05; g.add(sh);
  const rim = new T.Mesh(new T.TorusGeometry(0.55, 0.03, 10, 64), m.chrome); rim.rotation.x = Math.PI / 2; rim.position.y = 1.05; g.add(rim);
  const rimB = rim.clone(); rimB.position.y = -1.05; g.add(rimB);
  const neck = new T.Mesh(new T.CylinderGeometry(0.2, 0.24, 0.16, 32), m.chrome); neck.position.y = 1.32; g.add(neck);
  const act = new T.Group(); act.position.y = 1.5; g.add(act);
  act.add(new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.24, 32), m.acc));
  const top = new T.Mesh(new T.SphereGeometry(0.22, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.acc); top.scale.y = 0.35; top.position.y = 0.12; act.add(top);
  const tip = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.12, 12), m.dark); tip.rotation.z = -Math.PI / 2; tip.position.set(0.25, 0.03, 0); act.add(tip);
  return { g, act, nozzle: new T.Vector3(0.32, 1.53, 0) };
}

function hairLock(T, cx = -0.95) {
  const N = 260, P = 24, segs = P - 1;
  const pos = new Float32Array(N * segs * 6), col = new Float32Array(N * segs * 6), S = [];
  const cA = new T.Color(0x3f424d), cB = new T.Color(0x796cbf), cC = new T.Color(0xe7e5fe), c = new T.Color();
  const grad = s => s < 0.45 ? c.copy(cA).lerp(cB, s / 0.45) : c.copy(cB).lerp(cC, (s - 0.45) / 0.55);
  for (let i = 0; i < N; i++) S.push({ rx: cx + rnd(-0.34, 0.34), rz: rnd(-0.22, 0.22), len: rnd(2.6, 3.3), a: rnd(0.015, 0.05), f: rnd(4, 9), ph: rnd(0, 6.28), br: rnd(0.7, 1.15) });
  let o = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < segs; j++) for (const s of [j / segs, (j + 1) / segs]) { grad(s); col[o++] = c.r * S[i].br; col[o++] = c.g * S[i].br; col[o++] = c.b * S[i].br; }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const obj = new T.LineSegments(geo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })); obj.frustumCulled = false;
  const pts = new Float32Array(P * 3), v = new T.Vector3(), d = new T.Vector3();
  return { obj, update(t, n, f, gust) {
    let w = 0;
    for (let i = 0; i < N; i++) {
      const q = S[i], ds = q.len / segs; let acc = 0;
      for (let j = 0; j < P; j++) {
        const s = j / segs, x = q.rx + (q.rx - cx) * s * 0.4 + Math.sin(s * q.f + q.ph) * q.a * s, y = 1.95 - s * q.len, z = q.rz * (1 + s * 0.35);
        v.set(x, y, z).sub(n); const along = v.dot(f); d.copy(v).addScaledVector(f, -along); const sig = 0.3 + Math.max(0, along) * 0.22;
        acc += (along > 0 ? Math.exp(-d.lengthSq() / (2 * sig * sig)) / (1 + along * 0.5) : 0) * ds;
        const fl = Math.sin(t * 17 + i * 1.37 + s * 9) * 0.06 * acc + Math.sin(t * 0.9 + q.ph) * 0.03 * s * s, k = acc * 1.0 * gust;
        pts[j * 3] = x + f.x * k + fl * 0.3; pts[j * 3 + 1] = y + f.y * k + acc * 0.14 + fl; pts[j * 3 + 2] = z + f.z * k + fl * 0.8;
      }
      for (let j = 0; j < segs; j++) { pos.set(pts.subarray(j * 3, j * 3 + 6), w); w += 6; }
    }
    geo.attributes.position.needsUpdate = true;
  } };
}
function clipper(T, m) {
  const g = new T.Group(), add = (geo, mat, f) => { const o = new T.Mesh(geo, mat); f && f(o); g.add(o); return o; };
  add(new T.CapsuleGeometry(0.34, 1.5, 12, 36), m.body, o => { o.rotation.z = Math.PI / 2; o.scale.z = 0.62; o.position.x = 1.15; });
  add(new T.BoxGeometry(0.16, 0.95, 0.34), m.chrome, o => { o.position.x = 0.04; });
  for (let i = 0; i < 17; i++) add(new T.BoxGeometry(0.16, 0.022, 0.05), m.chrome, o => { o.position.set(-0.1, -0.42 + i * 0.0525, 0.1); });
  const blade = add(new T.BoxGeometry(0.05, 0.9, 0.2), m.dark, o => { o.position.set(-0.05, 0, -0.04); });
  add(new T.TorusGeometry(0.34, 0.026, 10, 48), m.acc, o => { o.rotation.y = Math.PI / 2; o.scale.x = 0.62; o.position.x = 0.34; });
  for (let k = 0; k < 5; k++) add(new T.TorusGeometry(0.345, 0.012, 8, 48), m.dark, o => { o.rotation.y = Math.PI / 2; o.scale.x = 0.62; o.position.x = 1.35 + k * 0.13; });
  add(new T.BoxGeometry(0.28, 0.05, 0.12), m.acc, o => { o.position.set(0.95, 0.345, 0); });
  const curve = new T.CatmullRomCurve3([new T.Vector3(2.2, 0, 0), new T.Vector3(2.6, -0.2, 0.1), new T.Vector3(2.8, -0.8, 0.2), new T.Vector3(2.7, -1.7, 0)]);
  add(new T.TubeGeometry(curve, 40, 0.045, 10), m.body);
  return { g, blade };
}
function patch(T) {
  const rows = 46, per = 4, N = rows * per, segs = 3, S = [];
  const pos = new Float32Array(N * segs * 6), col = new Float32Array(N * segs * 6);
  const cA = new T.Color(0x3f424d), cB = new T.Color(0xb5abfc), c = new T.Color();
  for (let r = 0; r < rows; r++) for (let k = 0; k < per; k++) { const rest = rnd(1.0, 1.2); S.push({ y: -1.25 + r * (2.5 / (rows - 1)) + rnd(-0.02, 0.02), z: rnd(-0.3, 0.3), rx: -1.55 + rnd(-0.04, 0.04), rest, len: rest, ph: rnd(0, 6.28), br: rnd(0.75, 1.1) }); }
  let o = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < segs; j++) for (const s of [j / segs, (j + 1) / segs]) { c.copy(cA).lerp(cB, s); col[o++] = c.r * S[i].br; col[o++] = c.g * S[i].br; col[o++] = c.b * S[i].br; }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const obj = new T.LineSegments(geo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })); obj.frustumCulled = false;
  return { obj, update(t, dt, cutX, y0, y1, onTrim) {
    let w = 0, trims = 0;
    for (const q of S) {
      if (q.y > y0 && q.y < y1) { const allow = cutX - q.rx; if (q.len > allow + 0.01) { if (trims++ < 6) onTrim(q.rx + q.len, q.y, q.z); q.len = allow; } }
      else q.len = Math.min(q.rest, q.len + dt * 0.05);
      let px = q.rx, py = q.y, pz = q.z;
      for (let j = 1; j <= segs; j++) { const s = j / segs, x = q.rx + s * q.len, y = q.y - 0.07 * (s * q.len) ** 2 + Math.sin(t * 1.2 + q.ph) * 0.015 * s;
        pos[w++] = px; pos[w++] = py; pos[w++] = pz; pos[w++] = x; pos[w++] = y; pos[w++] = q.z; px = x; py = y; }
    }
    geo.attributes.position.needsUpdate = true;
  } };
}
function clipperFlat(T, m) {
  const g = new T.Group(), add = (geo, mat, f) => { const o = new T.Mesh(geo, mat); f && f(o); g.add(o); return o; };
  add(new T.CapsuleGeometry(0.3, 1.7, 12, 36), m.body, o => { o.rotation.z = Math.PI / 2; o.scale.z = 0.7; o.position.x = 0.55; });
  add(new T.BoxGeometry(1.25, 0.1, 0.4), m.chrome, o => { o.position.set(0.15, -0.31, 0); });
  for (let i = 0; i < 22; i++) add(new T.BoxGeometry(0.022, 0.14, 0.05), m.chrome, o => { o.position.set(-0.45 + i * 0.057, -0.42, 0.12); });
  const blade = add(new T.BoxGeometry(1.15, 0.05, 0.22), m.dark, o => { o.position.set(0.15, -0.38, -0.05); });
  add(new T.TorusGeometry(0.3, 0.024, 10, 48), m.acc, o => { o.rotation.y = Math.PI / 2; o.scale.x = 0.7; o.position.x = 1.0; });
  for (let k = 0; k < 3; k++) add(new T.TorusGeometry(0.305, 0.012, 8, 48), m.dark, o => { o.rotation.y = Math.PI / 2; o.scale.x = 0.7; o.position.x = 1.15 + k * 0.1; });
  add(new T.BoxGeometry(0.28, 0.05, 0.12), m.acc, o => { o.position.set(0.3, 0.3, 0); });
  const curve = new T.CatmullRomCurve3([new T.Vector3(1.8, 0, 0), new T.Vector3(2.2, 0.1, 0.1), new T.Vector3(2.5, -0.3, 0.2), new T.Vector3(2.7, -1.2, 0)]);
  add(new T.TubeGeometry(curve, 40, 0.04, 10), m.body);
  return { g, blade, bx: 0.15 };
}
function lawn(T) {
  const N = 380, segs = 3, S = [], pos = new Float32Array(N * segs * 6), col = new Float32Array(N * segs * 6);
  const cA = new T.Color(0x3f424d), cB = new T.Color(0xb5abfc), c = new T.Color();
  for (let i = 0; i < N; i++) { const rest = rnd(1.0, 1.25); S.push({ x: rnd(-2.3, 2.3), z: rnd(-0.35, 0.35), ry: -1.35 + rnd(-0.03, 0.03), rest, len: rest, lean: rnd(-0.15, 0.15), ph: rnd(0, 6.28), br: rnd(0.75, 1.1) }); }
  let o = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < segs; j++) for (const s of [j / segs, (j + 1) / segs]) { c.copy(cA).lerp(cB, s); col[o++] = c.r * S[i].br; col[o++] = c.g * S[i].br; col[o++] = c.b * S[i].br; }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const obj = new T.LineSegments(geo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })); obj.frustumCulled = false;
  return { obj, update(t, dt, cutY, x0, x1, onTrim) {
    let w = 0, trims = 0;
    for (const q of S) {
      const allow = Math.max(0.15, cutY - q.ry);
      if (q.x > x0 && q.x < x1 && q.len > allow + 0.01) { if (trims++ < 6) onTrim(q.x + q.lean * q.len, q.ry + q.len, q.z); q.len = allow; }
      else if (!(q.x > x0 && q.x < x1)) q.len = Math.min(q.rest, q.len + dt * 0.06);
      let px = q.x, py = q.ry;
      for (let j = 1; j <= segs; j++) { const s = j / segs, x = q.x + q.lean * s * q.len + Math.sin(t * 1.3 + q.ph) * 0.02 * s, y = q.ry + s * q.len;
        pos[w++] = px; pos[w++] = py; pos[w++] = q.z; pos[w++] = x; pos[w++] = y; pos[w++] = q.z; px = x; py = y; }
    }
    geo.attributes.position.needsUpdate = true;
  } };
}
function shadowDisc(T, r) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const o = new T.Mesh(new T.CircleGeometry(r, 48), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false })); o.rotation.x = -Math.PI / 2; return o;
}
function chair(T, m) {
  const g = new T.Group(), top = new T.Group(); g.add(top);
  const add = (geo, mat, f, p = g) => { const o = new T.Mesh(geo, mat); f && f(o); p.add(o); return o; };
  const leather = new T.MeshPhysicalMaterial({ color: 0x2b2741, roughness: 0.5, metalness: 0, sheen: 1, sheenColor: new T.Color(0x9184d9), sheenRoughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const wheels = [];
  for (let i = 0; i < 5; i++) {
    const arm = new T.Group(); arm.rotation.y = i * Math.PI * 2 / 5 + 0.3; g.add(arm);
    add(new T.BoxGeometry(0.82, 0.07, 0.12), m.chrome, o => { o.position.set(0.41, -1.5, 0); o.rotation.z = -0.08; }, arm);
    add(new T.BoxGeometry(0.06, 0.1, 0.06), m.dark, o => { o.position.set(0.8, -1.58, 0); }, arm);
    wheels.push(add(new T.CylinderGeometry(0.085, 0.085, 0.07, 20), m.dark, o => { o.position.set(0.8, -1.66, 0); o.rotation.x = Math.PI / 2; }, arm));
  }
  add(new T.CylinderGeometry(0.14, 0.16, 0.12, 24), m.chrome, o => { o.position.y = -1.48; });
  add(new T.CylinderGeometry(0.1, 0.13, 0.3, 24), m.dark, o => { o.position.y = -1.3; });
  add(new T.CylinderGeometry(0.075, 0.075, 0.75, 24), m.chrome, o => { o.position.y = -1.0; });
  { const sh = shadowDisc(T, 1.3); sh.position.y = -1.745; g.add(sh); }
  add(new T.CylinderGeometry(0.3, 0.3, 0.06, 32), m.dark, o => { o.position.y = -0.72; }, top);
  add(new T.CylinderGeometry(0.64, 0.6, 0.26, 48), leather, o => { o.position.y = -0.56; o.scale.z = 0.92; }, top);
  add(new T.TorusGeometry(0.63, 0.035, 12, 64), leather, o => { o.rotation.x = Math.PI / 2; o.scale.y = 0.92; o.position.y = -0.43; }, top);
  add(new T.TorusGeometry(0.6, 0.008, 6, 64), m.acc, o => { o.rotation.x = Math.PI / 2; o.scale.y = 0.92; o.position.y = -0.41; }, top);
  const back = new T.Group(); back.position.set(0, 0.25, -0.5); back.rotation.x = -0.14; top.add(back);
  add(new T.CapsuleGeometry(0.46, 0.62, 12, 32), leather, o => { o.scale.z = 0.3; }, back);
  for (const bx of [-0.2, 0, 0.2]) for (const by of [-0.25, 0, 0.25]) add(new T.SphereGeometry(0.025, 12, 8), m.acc, o => { o.position.set(bx, by, 0.135); }, back);
  add(new T.BoxGeometry(0.1, 0.5, 0.05), m.chrome, o => { o.position.set(0, -0.32, -0.58); }, top);
  for (const sx of [-1, 1]) {
    add(new T.CapsuleGeometry(0.075, 0.7, 8, 20), leather, o => { o.rotation.x = Math.PI / 2; o.position.set(sx * 0.66, -0.2, -0.02); }, top);
    for (const z of [0.2, -0.25]) add(new T.CylinderGeometry(0.025, 0.025, 0.3, 12), m.chrome, o => { o.position.set(sx * 0.66, -0.38, z); }, top);
  }
  add(new T.BoxGeometry(0.7, 0.04, 0.06), m.chrome, o => { o.position.set(0, -1.02, 0.45); }, top);
  add(new T.BoxGeometry(0.04, 0.04, 0.45), m.chrome, o => { o.position.set(0, -1.02, 0.22); }, top);
  return { g, top, wheels };
}
function build3(T, m, model, scene, look, el) {
  const tmp = new T.Vector3(), dir = new T.Vector3();
  if (model === 'chair') {
    const obj = chair(T, m); scene.add(obj.g); look.set(0, -0.5, 0);
    let spin = 0, x0 = 0; el.bk = () => { spin = 1; }; addEventListener('mb-book', el.bk);
    return { obj, fx: null, base: 6.4, half: 2.2, camY: 1.1, upd: (dt, t, px, py) => {
      const x = Math.sin(t * 0.55) * 0.7, vx = (x - x0) / Math.max(dt, 1e-3); x0 = x;
      obj.g.position.x = x; obj.g.rotation.x = py * 0.06;
      if (spin > 0) spin = Math.max(0, spin - dt / 1.4);
      const extra = spin > 0 ? (1 - Math.pow(spin, 3)) * Math.PI * 2 : 0;
      obj.top.rotation.y = Math.sin(t * 0.55 + 1.3) * 0.5 + px * 0.5 + extra;
      obj.wheels.forEach(w => { w.rotation.y += vx * dt / 0.085; });
    } };
  }
  if (model === 'spray-hair') {
    const hair = hairLock(T, 0.95); scene.add(hair.obj);
    const obj = spray(T, m); obj.g.position.set(-1.35, -0.55, 0); obj.g.scale.setScalar(0.85); scene.add(obj.g);
    const fx = particles(T, 700, 0xd2cefd, 0.14); scene.add(fx.pts); look.set(-0.15, 0.1, 0);
    let burst = 0, next = 0.8, g2 = 0; el.sp2 = () => { burst = 1.4; next = 3.5; }; addEventListener('mb-spray', el.sp2);
    return { obj, fx, base: 6.6, half: 2.45, upd: (dt, t, px, py) => {
      obj.g.rotation.set(py * 0.1, -0.25 + Math.sin(t * 0.5) * 0.12 + px * 0.3, -0.12);
      next -= dt; if (next <= 0 && burst <= 0) { burst = 0.9; next = 3.2; }
      obj.act.position.y += ((burst > 0 ? 1.44 : 1.5) - obj.act.position.y) * Math.min(1, dt * 20);
      obj.g.updateMatrixWorld(true);
      tmp.copy(obj.nozzle); obj.g.localToWorld(tmp); dir.set(1, 0, 0).transformDirection(obj.g.matrixWorld);
      const on = burst > 0; if (on) { burst -= dt; const n = Math.round(dt * 300); for (let i = 0; i < n; i++) fx.emit(tmp, dir, 0.22, 3.4, 1.1); }
      g2 += ((on ? 0.45 : 0.04) - g2) * Math.min(1, dt * 4);
      hair.update(t, tmp, dir, g2); fx.step(dt, 1.8, 0.1);
    } };
  }
  if (model === 'clipper-flat') {
    const hp = lawn(T); scene.add(hp.obj);
    const obj = clipperFlat(T, m), root = new T.Group(); root.add(obj.g); scene.add(root);
    const fx = particles(T, 300, 0xcfd3e5, 0.05); scene.add(fx.pts); look.set(0, -0.35, 0);
    const down = new T.Vector3(0, -1, 0.2);
    return { obj, fx, base: 6.6, half: 2.5, upd: (dt, t, px, py) => {
      const cy = 0.15 + Math.sin(t * 1.1) * 0.38, cx = Math.sin(t * 0.33) * 0.7 + px * 0.4;
      root.position.set(cx, cy, 0); root.rotation.set(0.25 + py * 0.1, -0.35 + px * 0.2, 0);
      obj.g.position.x = Math.sin(t * 95) * 0.006; obj.blade.position.x = obj.bx + Math.sin(t * 160) * 0.014;
      hp.update(t, dt, cy - 0.5, cx - 0.45, cx + 0.75, (x, y, z) => { tmp.set(x, y, z); fx.emit(tmp, down, 0.6, 0.6, 1.4); });
      fx.step(dt, 0.6, -2.2);
    } };
  }
  if (model === 'dryer-hair') {
    const s = parseFloat(el.getAttribute('scale')) || 0.55, k = s - 0.55;
    const hair = hairLock(T); scene.add(hair.obj);
    const obj = dryer(T, m), root = new T.Group(); obj.g.scale.setScalar(s); root.add(obj.g); scene.add(root);
    const fx = particles(T, 420, 0xb5abfc, 0.07 + k * 0.08); scene.add(fx.pts); look.set(0.4 + k * 1.5, 0.05, 0);
    return { obj, fx, base: 6.2, half: 2.3 + k * 0.6, upd: (dt, t, px, py) => {
      root.position.set(1.6 + k * 1.2 + px * 0.25, 0.25 + Math.sin(t * 0.7) * 0.6 - py * 0.3, 0.15);
      root.rotation.set(0, Math.PI + Math.sin(t * 1.3) * 0.16, Math.sin(t * 0.7 + 0.6) * 0.14);
      obj.fan.rotation.x += dt * 28; root.updateMatrixWorld(true);
      tmp.copy(obj.nozzle); obj.g.localToWorld(tmp); dir.set(1, 0, 0).transformDirection(obj.g.matrixWorld);
      const gust = 0.85 + Math.sin(t * 2.1) * 0.15 + Math.sin(t * 5.3) * 0.08;
      hair.update(t, tmp, dir, gust); window.__mbWind = dir.x * gust;
      const n = Math.round(dt * 110); for (let i = 0; i < n; i++) fx.emit(tmp, dir, 0.16, 3.6, 0.55);
      fx.step(dt, 1.4, 0.05);
    } };
  }
  const hp = patch(T); scene.add(hp.obj);
  const obj = clipper(T, m), root = new T.Group(); root.add(obj.g); scene.add(root);
  const fx = particles(T, 300, 0xcfd3e5, 0.05); scene.add(fx.pts); look.set(0.5, 0, 0);
  const cutX = -0.85, down = new T.Vector3(0.25, -0.3, 0.35);
  return { obj, fx, base: 6.6, half: 2.5, upd: (dt, t, px, py) => {
    const cy = Math.sin(t * 1.1) * 0.45;
    root.position.set(cutX + 0.18, cy, 0); root.rotation.set(py * 0.15, -0.3 + px * 0.3, 0);
    obj.g.position.y = Math.sin(t * 95) * 0.006; obj.blade.position.y = Math.sin(t * 160) * 0.014;
    hp.update(t, dt, cutX, cy - 0.42, cy + 0.42, (x, y, z) => { tmp.set(x, y, z); fx.emit(tmp, down, 0.5, 0.9, 1.6); });
    fx.step(dt, 0.6, -2.2);
  } };
}

class MB3D extends HTMLElement {
  connectedCallback() {
    if (this._on) return; this._on = true;
    if (!this.shadowRoot) { const sr = this.attachShadow({ mode: 'open' }); const css = document.createElement('style'); css.textContent = ':host{display:block;position:relative}'; sr.append(css); }
    this.io = new IntersectionObserver(es => {
      this.vis = es[0].isIntersecting; clearTimeout(this._rel);
      if (this.vis) { this.build(); this.kick && this.kick(); }
      else this._rel = setTimeout(() => this.release(), 3000);
    }, { rootMargin: '150px' });
    this.io.observe(this);
  }
  build() {
    if (this.r || this._building || !this._on) return; this._building = true;
    const cv = this.cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', '3D ' + (this.getAttribute('model') || 'dryer'));
    this.shadowRoot.append(cv);
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); if (this.cv !== cv) return; this.release(); if (this._on && this.vis) setTimeout(() => this.build(), 500); });
    Promise.all([load(), document.fonts ? document.fonts.ready : 0]).then(([T]) => {
      this._building = false; if (!this._on || this.cv !== cv) return;
      try { this.setup(T); } catch (e) { console.warn('[mb-3d]', e && e.message); this.release(); }
    }).catch(e => { this._building = false; console.warn('[mb-3d]', e && e.message); });
  }
  release() {
    cancelAnimationFrame(this.raf); this.raf = 0; this.kick = null; this.ro && this.ro.disconnect(); this.ro = null;
    removeEventListener('pointermove', this.pm); removeEventListener('mb-spray', this.sp); removeEventListener('mb-book', this.bk); removeEventListener('mb-spray', this.sp2);
    const r = this.r; this.r = null; const cv = this.cv; this.cv = null;
    if (r) { try { r.forceContextLoss(); } catch (e) {} r.dispose(); }
    cv && cv.remove();
  }
  disconnectedCallback() { this._on = false; clearTimeout(this._rel); this.io && this.io.disconnect(); this.io = null; this.release(); }
  setup(T) {
    const r = this.r = new T.WebGLRenderer({ canvas: this.cv, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.2;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new T.HemisphereLight(0xd2cefd, 0x161826, 1.2));
    const key = new T.DirectionalLight(0xffffff, 2.6); key.position.set(3, 4, 6); scene.add(key);
    const rim = new T.DirectionalLight(0x9184d9, 4.5); rim.position.set(-5, 2, -4); scene.add(rim);
    const rim2 = new T.DirectionalLight(0xb5abfc, 2.2); rim2.position.set(5, -2, -3); scene.add(rim2);
    const m = mats(T), model = this.getAttribute('model') || 'dryer', outer = new T.Group(); scene.add(outer);
    let obj, fx, base, half, upd = null; const look = new T.Vector3();
    let camY = 0.2;
    if (['dryer-hair', 'clipper', 'clipper-flat', 'spray-hair', 'chair'].includes(model)) { const b = build3(T, m, model, scene, look, this); ({ obj, fx, base, half, upd } = b); if (b.camY != null) camY = b.camY; }
    else if (model === 'spray') { obj = spray(T, m); obj.g.position.set(-0.9, -0.2, 0); fx = particles(T, 800, 0xd2cefd, 0.17); base = 6.4; half = 2.4; }
    else { obj = dryer(T, m); obj.g.position.set(0.2, 0.6, 0); fx = particles(T, 520, 0xb5abfc, 0.1); base = 7.4; half = 2.1; }
    if (!upd) { outer.add(obj.g); scene.add(fx.pts); }
    const fit = () => { const w = this.offsetWidth, h = this.offsetHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; const t = Math.tan(16 * Math.PI / 180); cam.position.set(look.x, look.y + camY, Math.max(base, half / (t * cam.aspect))); cam.lookAt(look); cam.updateProjectionMatrix(); };
    this.ro = new ResizeObserver(fit); this.ro.observe(this); fit();
    let t = 0, last = 0, burst = 0, next = 1.2, px = 0, py = 0, tx = 0, ty = 0;
    this.pm = e => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }; addEventListener('pointermove', this.pm, { passive: true });
    this.sp = () => { burst = 1.6; next = 4; }; if (model === 'spray') addEventListener('mb-spray', this.sp);
    const tmp = new T.Vector3(), dir = new T.Vector3();
    const tick = ts => {
      this.raf = 0; if (!this._on || this.r !== r) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts; t += dt;
      px += (tx - px) * Math.min(1, dt * 3); py += (ty - py) * Math.min(1, dt * 3);
      if (upd) upd(dt, t, px, py);
      else if (model === 'spray') {
        obj.g.rotation.y = -0.55 + Math.sin(t * 0.45) * 0.4 + px * 0.5; obj.g.rotation.x = py * 0.15; obj.g.position.y = -0.2 + Math.sin(t * 1.2) * 0.04;
        next -= dt; if (next <= 0 && burst <= 0) { burst = 0.7; next = 4.2; }
        obj.act.position.y += ((burst > 0 ? 1.44 : 1.5) - obj.act.position.y) * Math.min(1, dt * 20);
        outer.updateMatrixWorld(true);
        if (burst > 0) { burst -= dt; dir.set(1, 0, 0).transformDirection(obj.g.matrixWorld); const n = Math.round(dt * 280); for (let i = 0; i < n; i++) { tmp.copy(obj.nozzle); obj.g.localToWorld(tmp); fx.emit(tmp, dir, 0.26, 3.2, 1.3); } }
        fx.step(dt, 1.7, 0.2);
      } else {
        outer.rotation.y = -Math.PI / 2 + Math.sin(t * 0.55) * 1.2 + px * 0.4; outer.rotation.x = 0.12 + py * 0.25; outer.position.y = Math.sin(t * 1.1) * 0.05;
        obj.fan.rotation.x += dt * 28; outer.updateMatrixWorld(true);
        dir.set(1, 0, 0).transformDirection(obj.g.matrixWorld); window.__mbWind = dir.x;
        const n = Math.round(dt * 120); for (let i = 0; i < n; i++) { tmp.copy(obj.nozzle); obj.g.localToWorld(tmp); fx.emit(tmp, dir, 0.14, 4.4, 0.85); }
        fx.step(dt, 1.3, 0.05);
      }
      r.render(scene, cam);
      if (this.vis && !reduce) this.raf = requestAnimationFrame(tick);
    };
    this.kick = () => { if (!this.raf && this.vis && this.r === r) { last = 0; this.raf = requestAnimationFrame(tick); } };
    if (this.vis) this.kick(); else r.render(scene, cam);
  }
}
customElements.get('mb-3d') || customElements.define('mb-3d', MB3D);
