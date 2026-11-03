'use strict';

// A small arcball renderer. Geometry is built once; each frame batches paths by
// depth instead of issuing thousands of separate canvas strokes.
function createKnowledgeOrb(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const shell = canvas.parentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2, DEPTHS = 8, DRAG = 4.2, IDLE = 0.075;
  const vertices = [], edges = [], dots = [], rings = [];
  const latitude = 24, longitude = 48;
  for (let lat = 1; lat < latitude; lat++) {
    const theta = lat / latitude * Math.PI;
    for (let lon = 0; lon < longitude; lon++) {
      const phi = lon / longitude * TAU;
      const index = vertices.length / 3;
      vertices.push(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi));
      edges.push(index, (lat - 1) * longitude + (lon + 1) % longitude);
      if (lon % 2 === 0) {
        dots.push(index);
        if (lat > 1) edges.push(index - longitude, index);
      }
    }
  }
  const north = vertices.length / 3;
  vertices.push(0, 1, 0, 0, -1, 0);
  for (let lon = 0; lon < longitude; lon += 2) {
    edges.push(north, lon, north + 1, (latitude - 2) * longitude + lon);
  }
  for (let ring = 0; ring < 3; ring++) {
    const angle = ring * 1.08 + 0.25, radius = 1.39 + ring * 0.12;
    const start = vertices.length / 3;
    for (let i = 0; i < 120; i++) {
      const u = i / 120 * TAU;
      vertices.push(Math.cos(u) * radius, Math.sin(u) * Math.sin(angle) * radius, Math.sin(u) * Math.cos(angle) * radius);
    }
    rings.push({start, angle, radius});
  }
  const mesh = new Float32Array(vertices);
  const projected = new Float32Array(mesh.length);
  const lines = Array.from({length: DEPTHS}, () => []);
  const particles = Array.from({length: DEPTHS}, () => []);
  const orbitLines = Array.from({length: 4}, () => []);
  const lineColors = lines.map((_, i) => `rgba(174,216,240,${0.035 + (i + 0.5) / DEPTHS * 0.14})`);
  const dotColors = lines.map((_, i) => `rgba(205,237,255,${0.16 + (i + 0.5) / DEPTHS * 0.60})`);
  const orbitColors = rings.map((_, r) => orbitLines.map((_, i) =>
    `rgba(${r === 2 ? '230,183,133' : '158,220,255'},${0.10 + (i + 0.5) / 4 * 0.29})`));
  const backdrop = document.createElement('canvas'), bg = backdrop.getContext('2d');
  let width = 0, height = 0, radius = 1, cx = 0, cy = 0;
  let frame = 0, lastFrame = null, disposed = false, inView = true;
  let reduced = motion.matches, pointer = null, previousPoint = null, pointerRect = null;
  let lastX = 0, lastY = 0, lastMove = 0, velocity = [0, 0, 0];
  let orientation = [0, 0, 0, 1], autoSpeed = reduced ? 0 : IDLE, phase = 0.35;

  function rotate(x, y, z, angle) {
    const s = Math.sin(angle / 2), w = Math.cos(angle / 2);
    const [a, b, c, d] = orientation;
    const nx = x * s, ny = y * s, nz = z * s;
    orientation = [w * a + nx * d + ny * c - nz * b,
      w * b - nx * c + ny * d + nz * a,
      w * c + nx * b - ny * a + nz * d,
      w * d - nx * a - ny * b - nz * c];
    const length = Math.hypot(...orientation);
    orientation = orientation.map(value => value / length);
  }
  rotate(0, 1, 0, 0.35);
  rotate(1, 0, 0, -0.34);

  function wake() {
    if (!frame && !disposed && inView && !document.hidden && width && height) frame = requestAnimationFrame(draw);
  }
  function pause() {
    cancelAnimationFrame(frame); frame = 0; lastFrame = null;
  }
  function resize() {
    const rect = shell.getBoundingClientRect();
    const dpi = Math.min(devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    radius = Math.min(width, height) * 0.285; cx = width * 0.5; cy = height * 0.48;
    canvas.width = backdrop.width = Math.round(width * dpi);
    canvas.height = backdrop.height = Math.round(height * dpi);
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    bg.setTransform(dpi, 0, 0, dpi, 0, 0);
    if (width && height) {
      const glow = bg.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.9);
      glow.addColorStop(0, 'rgba(83,167,215,.14)');
      glow.addColorStop(0.5, 'rgba(61,129,184,.045)');
      glow.addColorStop(1, 'rgba(40,90,140,0)');
      bg.fillStyle = glow; bg.fillRect(0, 0, width, height);
      const core = bg.createRadialGradient(cx - radius * 0.28, cy - radius * 0.3, 0, cx, cy, radius);
      core.addColorStop(0, 'rgba(204,233,255,.07)');
      core.addColorStop(0.75, 'rgba(41,91,124,0)');
      core.addColorStop(0.99, 'rgba(172,223,255,.11)'); core.addColorStop(1, 'transparent');
      bg.fillStyle = core; bg.beginPath(); bg.arc(cx, cy, radius, 0, TAU); bg.fill();
    }
    if (pointer !== null) cancelDrag();
    lastFrame = null; wake();
  }
  function ballPoint(x, y) {
    const a = (x - pointerRect.left - cx) / radius;
    const b = (y - pointerRect.top - cy) / radius;
    const distance = a * a + b * b;
    if (distance <= 1) return [a, b, Math.sqrt(1 - distance)];
    const scale = 1 / Math.sqrt(distance);
    return [a * scale, b * scale, 0];
  }
  function down(event) {
    if (event.button !== 0 || event.isPrimary === false || pointer !== null || !radius) return;
    pointer = event.pointerId; pointerRect = shell.getBoundingClientRect();
    previousPoint = ballPoint(event.clientX, event.clientY);
    lastX = event.clientX; lastY = event.clientY; lastMove = event.timeStamp;
    velocity = [0, 0, 0]; autoSpeed = 0;
    canvas.setPointerCapture(pointer);
    shell.classList.add('is-dragging'); wake();
  }
  function move(event) {
    if (event.pointerId !== pointer || (event.clientX === lastX && event.clientY === lastY)) return;
    const point = ballPoint(event.clientX, event.clientY), a = previousPoint, b = point;
    const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    let length = Math.hypot(...cross);
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const angle = Math.atan2(length, dot);
    // An exact jump across opposite sides needs a stable perpendicular axis.
    if (length < 1e-7 && dot < 0) {
      const basis = Math.abs(a[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
      cross[0] = a[1] * basis[2] - a[2] * basis[1];
      cross[1] = a[2] * basis[0] - a[0] * basis[2];
      cross[2] = a[0] * basis[1] - a[1] * basis[0];
      length = Math.hypot(...cross);
    }
    if (length > 1e-7) {
      const axis = cross.map(value => value / length);
      rotate(...axis, angle);
      const elapsed = Math.max(4, event.timeStamp - lastMove) / 1000;
      const speed = Math.min(6, angle / elapsed), blend = 1 - Math.exp(-elapsed / 0.035);
      velocity = velocity.map((value, i) => (elapsed > 0.1 ? 0 : value) * (1 - blend) + axis[i] * speed * blend);
    }
    previousPoint = point; lastX = event.clientX; lastY = event.clientY; lastMove = event.timeStamp;
    wake();
  }
  function release() {
    const id = pointer; pointer = null; previousPoint = null;
    shell.classList.remove('is-dragging');
    if (id !== null && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
  }
  function up(event) {
    if (event.pointerId !== pointer) return;
    move(event);
    if (reduced || event.timeStamp - lastMove > 80) velocity = [0, 0, 0];
    release(); lastFrame = null; wake();
  }
  function cancelDrag() {
    velocity = [0, 0, 0]; release(); wake();
  }
  function cancel(event) { if (event.pointerId === pointer) cancelDrag(); }
  function key(event) {
    const axes = {ArrowLeft: [0, -1, 0], ArrowRight: [0, 1, 0], ArrowUp: [-1, 0, 0], ArrowDown: [1, 0, 0]};
    if (!axes[event.key]) return;
    event.preventDefault(); rotate(...axes[event.key], 0.12);
    velocity = [0, 0, 0]; autoSpeed = 0; wake();
  }

  function draw(time) {
    frame = 0;
    if (disposed || !inView || document.hidden) { lastFrame = null; return; }
    const dt = lastFrame === null ? 0 : Math.min((time - lastFrame) / 1000, 0.05);
    lastFrame = time;
    if (pointer === null && !reduced) {
      // Integrate exponential friction in seconds, independent of display refresh rate.
      const speed = Math.hypot(...velocity), decay = Math.exp(-DRAG * dt);
      if (speed > 0.0001) rotate(velocity[0] / speed, velocity[1] / speed, velocity[2] / speed, speed * (1 - decay) / DRAG);
      velocity = velocity.map(value => value * decay);
      const settle = Math.exp(-dt / 1.5);
      const idleAngle = IDLE * dt + (autoSpeed - IDLE) * (1 - settle) * 1.5;
      autoSpeed = IDLE + (autoSpeed - IDLE) * settle;
      rotate(0, 1, 0, idleAngle); phase += dt * 0.045;
    }
    const [x, y, z, w] = orientation;
    const m00 = 1 - 2 * (y * y + z * z), m01 = 2 * (x * y - z * w), m02 = 2 * (x * z + y * w);
    const m10 = 2 * (x * y + z * w), m11 = 1 - 2 * (x * x + z * z), m12 = 2 * (y * z - x * w);
    const m20 = 2 * (x * z - y * w), m21 = 2 * (y * z + x * w), m22 = 1 - 2 * (x * x + y * y);
    function project(a, b, c, output, offset) {
      const depth = m20 * a + m21 * b + m22 * c;
      const scale = radius * 3.8 / (3.8 - depth);
      output[offset] = cx + (m00 * a + m01 * b + m02 * c) * scale;
      output[offset + 1] = cy + (m10 * a + m11 * b + m12 * c) * scale;
      output[offset + 2] = depth;
    }
    for (let i = 0; i < mesh.length; i += 3) project(mesh[i], mesh[i + 1], mesh[i + 2], projected, i);
    ctx.clearRect(0, 0, width, height); ctx.drawImage(backdrop, 0, 0, width, height);
    for (let i = 0; i < DEPTHS; i++) { lines[i].length = 0; particles[i].length = 0; }
    const bucket = depth => Math.max(0, Math.min(DEPTHS - 1, Math.floor((depth + 1) * DEPTHS / 2)));
    for (let i = 0; i < edges.length; i += 2) {
      const a = edges[i] * 3, b = edges[i + 1] * 3;
      lines[bucket((projected[a + 2] + projected[b + 2]) / 2)].push(a, b);
    }
    for (const index of dots) particles[bucket(projected[index * 3 + 2])].push(index * 3);
    function strokeSegments(segments) {
      ctx.beginPath();
      for (let i = 0; i < segments.length; i += 2) {
        const a = segments[i], b = segments[i + 1];
        ctx.moveTo(projected[a], projected[a + 1]); ctx.lineTo(projected[b], projected[b + 1]);
      }
      ctx.stroke();
    }
    ctx.lineWidth = 0.65;
    for (let i = 0; i < DEPTHS; i++) {
      ctx.strokeStyle = lineColors[i]; strokeSegments(lines[i]);
      ctx.fillStyle = dotColors[i]; ctx.beginPath();
      for (const p of particles[i]) {
        const r = 0.55 + (projected[p + 2] + 1) * 0.6;
        ctx.moveTo(projected[p] + r, projected[p + 1]); ctx.arc(projected[p], projected[p + 1], r, 0, TAU);
      }
      ctx.fill();
    }
    const beacon = new Float32Array(3);
    rings.forEach((ring, r) => {
      orbitLines.forEach(list => { list.length = 0; });
      for (let i = 0; i < 120; i++) {
        const a = (ring.start + i) * 3, b = (ring.start + (i + 1) % 120) * 3;
        const depth = Math.max(0, Math.min(3, Math.floor((projected[a + 2] + projected[b + 2] + 4) / 2)));
        orbitLines[depth].push(a, b);
      }
      ctx.lineWidth = r === 0 ? 1.05 : 0.7;
      orbitLines.forEach((segments, i) => { ctx.strokeStyle = orbitColors[r][i]; strokeSegments(segments); });
      const u = phase + r * 2.1;
      project(Math.cos(u) * ring.radius, Math.sin(u) * Math.sin(ring.angle) * ring.radius,
        Math.sin(u) * Math.cos(ring.angle) * ring.radius, beacon, 0);
      ctx.fillStyle = r === 2 ? '#e7bc8b' : '#ddf4ff';
      ctx.beginPath(); ctx.arc(beacon[0], beacon[1], r === 0 ? 3.5 : 2.5, 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.07; ctx.beginPath(); ctx.arc(beacon[0], beacon[1], 9, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    });
    if (!reduced) wake();
  }
  function visibility() {
    if (document.hidden) { cancelDrag(); pause(); }
    else { lastFrame = null; wake(); }
  }
  function preference() {
    reduced = motion.matches; velocity = [0, 0, 0]; autoSpeed = 0;
    lastFrame = null; wake();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(shell);
  const intersection = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) { lastFrame = null; wake(); }
    else { cancelDrag(); pause(); }
  });
  intersection.observe(canvas);
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  canvas.addEventListener('lostpointercapture', cancel);
  canvas.addEventListener('keydown', key);
  motion.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  resize();
  return () => {
    disposed = true; release(); pause();
    resizeObserver.disconnect(); intersection.disconnect();
    canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', cancel);
    canvas.removeEventListener('lostpointercapture', cancel); canvas.removeEventListener('keydown', key);
    motion.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility);
  };
}
