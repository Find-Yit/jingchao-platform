const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../static/orb.js'), 'utf8');

function setup(reduced = false) {
  function target() {
    const listeners = new Map();
    return {
      addEventListener(name, fn) { listeners.set(name, fn); },
      removeEventListener(name) { listeners.delete(name); },
      emit(name, event = {}) { listeners.get(name)?.(event); },
      listeners,
    };
  }
  function context() {
    return {
      points: [], strokes: 0, arcs: 0,
      clearRect() { this.points = []; this.strokes = this.arcs = 0; },
      moveTo(x, y) { this.points.push(x, y); },
      lineTo(x, y) { this.points.push(x, y); },
      arc(x, y, r) { this.points.push(x, y, r); this.arcs++; },
      stroke() { this.strokes++; },
      beginPath() {}, fill() {}, fillRect() {}, drawImage() {}, setTransform() {},
      createRadialGradient() { return {addColorStop() {}}; },
    };
  }
  const ctx = context(), shell = {classList: {add() {}, remove() {}},
    getBoundingClientRect: () => ({left: 0, top: 0, width: 500, height: 470})};
  const captured = new Set();
  const canvas = Object.assign(target(), {parentElement: shell, getContext: () => ctx,
    setPointerCapture: id => captured.add(id), hasPointerCapture: id => captured.has(id),
    releasePointerCapture: id => captured.delete(id)});
  const document = Object.assign(target(), {hidden: false,
    createElement: () => ({getContext: () => context()})});
  const motion = Object.assign(target(), {matches: reduced});
  const queue = new Map(); let next = 0, observer;
  const scope = vm.createContext({document, matchMedia: () => motion, devicePixelRatio: 2,
    requestAnimationFrame(fn) { queue.set(++next, fn); return next; },
    cancelAnimationFrame(id) { queue.delete(id); },
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} disconnect() {} },
  });
  vm.runInContext(source, scope);
  const dispose = scope.createKnowledgeOrb(canvas);
  const step = time => { const frames = [...queue.values()]; queue.clear(); frames.forEach(fn => fn(time)); };
  const event = (name, x, y, time, extra = {}) => canvas.emit(name,
    {pointerId: 1, button: 0, isPrimary: true, clientX: x, clientY: y, timeStamp: time, ...extra});
  return {ctx, canvas, document, motion, queue, captured, dispose, step, event,
    visible: value => observer([{isIntersecting: value}])};
}
function closePoints(a, b, tolerance = 0.0001) {
  assert.equal(a.length, b.length);
  assert.ok(a.every((value, i) => Math.abs(value - b[i]) < tolerance));
}

test('drag changes orientation; release and pointer leave never snap back', () => {
  const e = setup(true); e.step(0);
  const initial = [...e.ctx.points];
  e.event('pointerdown', 250, 225, 10);
  assert.ok(e.captured.has(1));
  e.event('pointermove', 330, 250, 30); e.step(32);
  const dragged = [...e.ctx.points]; assert.notDeepEqual(dragged, initial);
  e.event('pointerleave', 330, 250, 35);
  e.event('pointerup', 330, 250, 40); e.step(48);
  closePoints(e.ctx.points, dragged); assert.equal(e.captured.size, 0);
  assert.equal(e.queue.size, 0, 'reduced motion stops after drawing input');
  e.event('pointermove', 200, 150, 60); e.step(64);
  closePoints(e.ctx.points, dragged); e.dispose();
});

test('drag stays captured outside the canvas; a second pointer cannot steal it', () => {
  const e = setup(true); e.step(0);
  e.event('pointerdown', 250, 225, 10);
  e.event('pointerdown', 200, 225, 20, {pointerId: 2, isPrimary: false});
  e.event('pointermove', 540, 225, 30); e.step(32);
  const moved = [...e.ctx.points];
  assert.ok(e.captured.has(1)); assert.ok(!e.captured.has(2));
  e.event('pointercancel', 540, 225, 40); e.step(48);
  assert.equal(e.captured.size, 0); closePoints(e.ctx.points, moved); e.dispose();
});

test('auto-rotation uses elapsed time consistently at 30, 60 and 120 Hz', () => {
  const results = [30, 60, 120].map(hz => {
    const e = setup(); e.step(0);
    for (let i = 1; i <= hz; i++) e.step(i * 1000 / hz);
    const points = [...e.ctx.points]; e.dispose(); return points;
  });
  closePoints(results[0], results[1]); closePoints(results[1], results[2]);
});

test('inertia continues after a flick, with no return to the initial orientation', () => {
  const e = setup(); e.step(0);
  e.event('pointerdown', 250, 225, 10);
  e.event('pointermove', 320, 225, 40); e.step(40);
  const held = [...e.ctx.points];
  e.event('pointerup', 320, 225, 45); e.step(50);
  closePoints(e.ctx.points, held);
  e.step(66); assert.notDeepEqual(e.ctx.points, held);
  e.dispose(); assert.equal(e.queue.size, 0);
});

test('hidden and offscreen canvases pause, then resume without a time jump', () => {
  const e = setup(); e.step(0); e.step(16);
  const before = [...e.ctx.points];
  e.document.hidden = true; e.document.emit('visibilitychange'); assert.equal(e.queue.size, 0);
  e.document.hidden = false; e.document.emit('visibilitychange'); e.step(90000);
  closePoints(e.ctx.points, before);
  e.visible(false); assert.equal(e.queue.size, 0);
  e.visible(true); e.step(120000); closePoints(e.ctx.points, before);
  e.dispose(); assert.equal(e.canvas.listeners.size, 0);
});

test('reduced-motion preference updates live, and arrow keys remain usable', () => {
  const e = setup(); e.step(0);
  e.motion.matches = true; e.motion.emit('change'); e.step(16);
  assert.equal(e.queue.size, 0); const initial = [...e.ctx.points]; let prevented = false;
  e.canvas.emit('keydown', {key: 'ArrowRight', preventDefault() { prevented = true; }}); e.step(32);
  assert.ok(prevented); assert.notDeepEqual(e.ctx.points, initial); assert.equal(e.queue.size, 0);
  e.dispose();
});

test('dense geometry is retained while strokes are batched', () => {
  const e = setup(true); e.step(0);
  assert.ok(e.ctx.arcs > 500, 'keep the globe dot detail');
  assert.ok(e.ctx.strokes <= 24, `expected batch rendering, got ${e.ctx.strokes} strokes`);
  assert.ok(e.ctx.points.every(Number.isFinite)); e.dispose();
});
