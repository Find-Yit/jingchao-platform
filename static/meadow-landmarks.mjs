import * as T from './vendor/three/three.module.min.js';

// Original, geometry-only learning landmarks. +Z is the entrance; Y=0 is ground.
// Static architectural details are merged by material. Shared primitives and
// materials survive until the last landmark is disposed, so sibling scenes are safe.
const TAU = Math.PI * 2;
const geometries = new Map();
const materials = new Map();
let liveLandmarks = 0;
const colors = {
  plaster: '#f0e9d4', white: '#fff6df', stone: '#d4cbb3', stoneLight: '#e7dec7',
  stoneDark: '#a9ab96', sage: '#8baca0', sageDark: '#607f78', wood: '#a57c54',
  timber: '#735c45', brass: '#c8aa69', dark: '#435953', glass: '#b1d3c8',
  leaf: '#8ea775', leafLight: '#b0be87', blossom: '#e9c2a7', blue: '#83acae',
  book: '#a7b8a3', paper: '#f7efda', earth: '#81735a', coral: '#c9987d',
};

function geometry(key, make) {
  if (!geometries.has(key)) geometries.set(key, make());
  return geometries.get(key);
}
function material(name) {
  if (!materials.has(name)) {
    materials.set(name, new T.MeshStandardMaterial({
      color: colors[name] || name, roughness: name === 'brass' ? .43 : .88,
      metalness: name === 'brass' ? .46 : .02,
      ...(name === 'glass' ? { transparent: true, opacity: .36, depthWrite: false, side: T.DoubleSide } : {}),
      ...(name === 'paper' ? { side: T.DoubleSide } : {}),
    }));
  }
  return materials.get(name);
}
function releaseShared() {
  if (liveLandmarks !== 0) return;
  for (const g of geometries.values()) g.dispose();
  for (const m of materials.values()) m.dispose();
  geometries.clear();
  materials.clear();
}
function lathe(points) {
  return geometry(`lathe:${JSON.stringify(points)}`, () => new T.LatheGeometry(points.map(p => new T.Vector2(...p)), 48));
}
function arcTube(points, radius = .06, segments = 40) {
  return geometry(`tube:${radius}:${segments}:${JSON.stringify(points)}`, () => new T.TubeGeometry(
    new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), segments, radius, 6, false));
}
function torus(radius, tube = .05, arc = TAU) {
  return geometry(`torus:${radius}:${tube}:${arc}`, () => new T.TorusGeometry(radius, tube, 6, Math.max(24, Math.round(48 * arc / TAU)), arc));
}
function cylinder(top = 1, bottom = 1, open = false, segments = 32) {
  return geometry(`cylinder:${top}:${bottom}:${open}:${segments}`, () => new T.CylinderGeometry(top, bottom, 1, segments, 1, open));
}
function archPath(path, width, height) {
  const r = width / 2, spring = height - r;
  path.moveTo(-r, 0);
  path.lineTo(r, 0);
  path.lineTo(r, spring);
  path.absarc(0, spring, r, 0, Math.PI, false);
  path.closePath();
  return path;
}
function arch(width, height, depth, border = 0) {
  return geometry(`arch:${width}:${height}:${depth}:${border}`, () => {
    const shape = archPath(new T.Shape(), width + border * 2, height + border);
    if (border) shape.holes.push(archPath(new T.Path(), width, height));
    const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20, steps: 1 });
    g.translate(0, 0, -depth / 2);
    return g;
  });
}
function starGeometry() {
  return geometry('star', () => {
    const s = new T.Shape();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, r = i % 2 ? .23 : 1;
      const x = Math.sin(a) * r, y = Math.cos(a) * r;
      if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
    }
    s.closePath();
    return new T.ExtrudeGeometry(s, { depth: .08, bevelEnabled: true, bevelThickness: .025, bevelSize: .025, bevelSegments: 1 });
  });
}

// A batch takes immutable shared geometries and owns only the merged output.
function batch(parent, owned, shadows = true, collisions = null, gate = false) {
  const buckets = new Map(), dummy = new T.Object3D();
  function add(g, m, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    if (typeof m === 'string') m = material(m);
    dummy.position.set(...position); dummy.rotation.set(...rotation); dummy.scale.set(...scale); dummy.updateMatrix();
    const transformed = (g.index ? g.toNonIndexed() : g.clone()).applyMatrix4(dummy.matrix);
    if (!transformed.attributes.normal) transformed.computeVertexNormals();
    if (collisions) {
      const type=g.type, params=g.parameters||{};
      const addBounds=geometry=>{
        geometry.computeBoundingBox();const box=geometry.boundingBox,size=new T.Vector3();box.getSize(size);
        if(size.y<.085||Math.min(size.x,size.z)<.075||Math.max(size.x,size.z)<.25)return;
        const c=new T.Vector3();box.getCenter(c);
        collisions.push({x:c.x,z:c.z,hx:size.x/2,hz:size.z/2,r:Math.hypot(size.x,size.z)/2,base:box.min.y,height:size.y,walkable:true});
      };
      if(type==='BoxGeometry'||(gate&&type==='ExtrudeGeometry'))addBounds(transformed);
      if(type==='CylinderGeometry'&&Math.max(params.radiusTop,params.radiusBottom)>.13){
        if(Math.abs(rotation[0])+Math.abs(rotation[2])<.01){
          const r=Math.max(params.radiusTop,params.radiusBottom)*Math.max(scale[0],scale[2]);
          collisions.push({x:position[0],z:position[2],r,base:position[1]-scale[1]/2,height:scale[1],walkable:true});
        }else addBounds(transformed);
      }
      if(type==='LatheGeometry'){
        const points=params.points;
        for(let i=1;i<points.length;i++){const a=points[i-1],c=points[i],h=Math.abs(c.y-a.y)*scale[1],r=Math.max(a.x,c.x)*Math.max(scale[0],scale[2]);
          if(h>.08&&r>.1)collisions.push({x:position[0],z:position[2],r,base:position[1]+Math.min(a.y,c.y)*scale[1],height:h,walkable:true});
        }
      }
      if(type==='TubeGeometry'&&params.radius>=.07){
        const points=params.path.getPoints(18);
        for(let i=1;i<points.length;i++){
          const a=points[i-1].clone().applyMatrix4(dummy.matrix),c=points[i].clone().applyMatrix4(dummy.matrix),r=params.radius*Math.max(...scale);
          const hx=Math.abs(c.x-a.x)/2+r,hz=Math.abs(c.z-a.z)/2+r;
          collisions.push({x:(a.x+c.x)/2,z:(a.z+c.z)/2,hx,hz,r:Math.hypot(hx,hz),base:Math.min(a.y,c.y)-r,height:Math.abs(a.y-c.y)+2*r,walkable:true});
        }
      }
    }
    if (!buckets.has(m)) buckets.set(m, []);
    buckets.get(m).push(transformed);
  }
  function finish() {
    for (const [m, chunks] of buckets) {
      const count = chunks.reduce((sum, g) => sum + g.attributes.position.count, 0);
      const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3), uvs = new Float32Array(count * 2);
      let offset = 0;
      for (const chunk of chunks) {
        positions.set(chunk.attributes.position.array, offset * 3);
        normals.set(chunk.attributes.normal.array, offset * 3);
        if (chunk.attributes.uv) uvs.set(chunk.attributes.uv.array, offset * 2);
        offset += chunk.attributes.position.count;
        chunk.dispose();
      }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(positions, 3));
      g.setAttribute('normal', new T.BufferAttribute(normals, 3));
      g.setAttribute('uv', new T.BufferAttribute(uvs, 2));
      g.computeBoundingSphere();
      owned.add(g);
      const mesh = new T.Mesh(g, m);
      mesh.castShadow = shadows && !m.transparent && !m.userData.luminous;
      mesh.receiveShadow = !m.userData.luminous;
      parent.add(mesh);
    }
    buckets.clear();
  }
  return { add, finish };
}

function primitives(b) {
  const boxGeo = geometry('box', () => new T.BoxGeometry(1, 1, 1));
  const sphereGeo = geometry('sphere', () => new T.SphereGeometry(1, 20, 12));
  const box = (w, h, d, m, x = 0, y = 0, z = 0, ry = 0, rz = 0) => b.add(boxGeo, m, [x, y, z], [0, ry, rz], [w, h, d]);
  const sphere = (r, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => b.add(sphereGeo, m, [x, y, z], [0, 0, 0], [r * sx, r * sy, r * sz]);
  const cyl = (rt, rb, h, m, x = 0, y = 0, z = 0) => b.add(cylinder(rt, rb), m, [x, y, z], [0, 0, 0], [1, h, 1]);
  const ring = (r, thickness, m, x = 0, y = 0, z = 0, rx = -Math.PI / 2, ry = 0, rz = 0) => b.add(torus(r, thickness), m, [x, y, z], [rx, ry, rz]);
  const rod = (start, end, radius, m) => {
    const a = new T.Vector3(...start), c = new T.Vector3(...end), delta = c.clone().sub(a);
    const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), delta.clone().normalize());
    const e = new T.Euler().setFromQuaternion(q);
    b.add(cylinder(1, 1), m, a.add(c).multiplyScalar(.5).toArray(), [e.x, e.y, e.z], [radius, delta.length(), radius]);
  };
  return { box, sphere, cyl, ring, rod };
}

function doorway(b, width, height, z, x = 0, y = .28, angle = 0) {
  b.add(arch(width, height, .08), 'dark', [x, y, z], [0, angle, 0]);
  b.add(arch(width, height, .18, .18), 'stoneLight', [x, y, z + .07], [0, angle, 0]);
  const p = primitives(b);
  for (const side of [-1, 1]) p.box(.09, height * .68, .06, 'wood', x + side * width * .38, y + height * .34, z + .1);
  p.box(width * .74, .07, .09, 'brass', x, y + height * .68, z + .12);
  p.sphere(.045, 'brass', x + width * .22, y + height * .43, z + .13);
}
function windowArch(b, x, y, z, angle = 0, width = .65, height = 1.15) {
  b.add(arch(width, height, .04), 'dark', [x, y, z], [0, angle, 0]);
  b.add(arch(width, height, .12, .1), 'stoneLight', [x, y, z], [0, angle, 0]);
  const offset = new T.Vector3(0, height * .43, .08).applyAxisAngle(new T.Vector3(0, 1, 0), angle);
  primitives(b).box(width * .8, .045, .04, 'brass', x + offset.x, y + offset.y, z + offset.z, angle);
}
function book(b, x, y, z, w = .65, angle = 0, color = 'book') {
  const p = primitives(b);
  p.box(w, .11, .45, 'paper', x, y, z, angle);
  for (const h of [-.065, .065]) p.box(w + .055, .025, .49, color, x, y + h, z, angle);
}
function bench(b, x, z, angle = 0, width = 2) {
  const p = primitives(b), transform = (px, py, pz) => [x + px * Math.cos(angle) + pz * Math.sin(angle), py, z - px * Math.sin(angle) + pz * Math.cos(angle)];
  for (const dz of [-.2, 0, .2]) p.box(width, .13, .17, 'wood', ...transform(0, .75, dz), angle);
  for (const dx of [-width * .37, width * .37]) {
    p.box(.17, .68, .5, 'stone', ...transform(dx, .38, 0), angle);
    p.box(.09, .7, .09, 'timber', ...transform(dx, 1.05, -.29), angle);
  }
  p.box(width, .28, .08, 'wood', ...transform(0, 1.29, -.3), angle);
}
function planter(b, x, z, size = 1) {
  const p = primitives(b);
  p.cyl(.49 * size, .35 * size, .65 * size, 'stoneLight', x, .33 * size, z);
  p.ring(.48 * size, .045 * size, 'stone', x, .64 * size, z);
  p.cyl(.42 * size, .42 * size, .03, 'earth', x, .65 * size, z);
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4, r = i ? .22 * size : 0;
    p.sphere(.24 * size, i % 2 ? 'leaf' : 'leafLight', x + Math.sin(a) * r, (.78 + .07 * (i % 3)) * size, z + Math.cos(a) * r, 1, 1.35, .8);
    if (i % 2) p.sphere(.08 * size, 'blossom', x + Math.sin(a) * r, 1.1 * size, z + Math.cos(a) * r);
  }
}
function lantern(b, glow, x, y, z, size = 1) {
  const p = primitives(b);
  p.cyl(.24 * size, .28 * size, .09 * size, 'brass', x, y - .35 * size, z);
  p.cyl(.3 * size, .21 * size, .16 * size, 'sageDark', x, y + .35 * size, z);
  p.sphere(.19 * size, glow, x, y, z, 1, 1.35, 1);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    p.rod([x + Math.cos(a) * .21 * size, y - .3 * size, z + Math.sin(a) * .21 * size], [x + Math.cos(a) * .21 * size, y + .3 * size, z + Math.sin(a) * .21 * size], .025 * size, 'brass');
  }
  p.ring(.1 * size, .023 * size, 'brass', x, y + .5 * size, z, 0);
}
function stairs(b, radius, width = 2.2) {
  const p = primitives(b);
  p.box(width + .45, .14, 1.2, 'stone', 0, .07, radius + .48);
  p.box(width + .15, .25, .85, 'stoneLight', 0, .125, radius + .23);
}
function railing(b, radius, floor, count = 18, start = 0, span = TAU, color = 'brass') {
  const p = primitives(b), points = [];
  for (let i = 0; i <= count; i++) {
    const a = start + i / count * span, x = Math.cos(a) * radius, z = Math.sin(a) * radius;
    p.cyl(.035, .04, .78, color, x, floor + .39, z);
    p.sphere(.065, color, x, floor + .82, z);
    points.push([x, floor + .68, z]);
  }
  b.add(arcTube(points, .055, count * 3), color);
}

function windmill(ctx) {
  const { b, root, own, glow, animated, shadows } = ctx, p = primitives(b);
  b.add(lathe([[0, 0], [2.5, 0], [2.53, .25], [2.43, .5], [2.25, 3], [2.0, 5.6], [1.83, 7.2], [0, 7.2]]), 'plaster');
  p.cyl(2.6, 2.64, .25, 'stone', 0, .13);
  p.ring(2.42, .1, 'stoneLight', 0, .52);
  p.ring(1.88, .09, 'wood', 0, 6.9);
  doorway(b, 1.4, 2.35, 2.44);
  stairs(b, 2.35);
  for (const [x, z, angle] of [[-2.03, .35, -1.4], [2.03, .35, 1.4], [0, -2.05, Math.PI]]) windowArch(b, x, 4.35, z, angle, .62, 1.25);
  windowArch(b, 0, 4.15, 2.1, 0, .75, 1.4);
  const deck = geometry('mill-balcony', () => {
    const g = new T.RingGeometry(1.8, 3.0, 40, 1, 0, Math.PI); g.rotateX(-Math.PI / 2); g.rotateY(Math.PI); return g;
  });
  b.add(deck, 'wood', [0, 3.52, 0]);
  b.add(arcTube(Array.from({ length: 33 }, (_, i) => [3 * Math.cos(i * Math.PI / 32), 3.48, 3 * Math.sin(i * Math.PI / 32)]), .11), 'timber');
  railing(b, 2.94, 3.54, 12, 0, Math.PI, 'wood');
  for (const a of [.22, .7, 1.25, 1.9, 2.45, 2.92]) p.rod([2.05 * Math.cos(a), 2.55, 2.05 * Math.sin(a)], [2.88 * Math.cos(a), 3.47, 2.88 * Math.sin(a)], .085, 'timber');
  b.add(lathe([[0, 7.18], [2.63, 7.18], [2.66, 7.34], [2.42, 7.54], [2.1, 8.05], [1.72, 8.62], [1.1, 9.15], [.45, 9.46], [0, 9.5]]), 'sageDark');
  for (let i = 0; i < 16; i++) {
    const a = i * TAU / 16;
    b.add(arcTube([[2.65 * Math.cos(a), 7.35, 2.65 * Math.sin(a)], [2.12 * Math.cos(a), 8.08, 2.12 * Math.sin(a)], [1.1 * Math.cos(a), 9.18, 1.1 * Math.sin(a)], [.08 * Math.cos(a), 9.51, .08 * Math.sin(a)]], .035, 18), i % 2 ? 'sage' : 'brass');
  }
  p.sphere(.16, 'brass', 0, 9.64);
  const rotor = new T.Group(); rotor.position.set(0, 6.62, 2.55); rotor.rotation.z = .2; root.add(rotor);
  const rb = batch(rotor, own, shadows), r = primitives(rb);
  const cloth = geometry('mill-cloth', () => {
    const positions = [], indices = [];
    for (let j = 0; j <= 10; j++) for (let k = 0; k <= 3; k++) {
      const t = j / 10, u = k / 3;
      positions.push(.08 + u * (.34 + .35 * t), .65 + t * 2.85, .05 + Math.sin(t * Math.PI) * Math.sin(u * Math.PI) * .15);
    }
    for (let j = 0; j < 10; j++) for (let k = 0; k < 3; k++) {
      const v = j * 4 + k; indices.push(v, v + 1, v + 4, v + 1, v + 5, v + 4);
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
  });
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    rb.add(cloth, 'paper', [0, 0, .08], [0, 0, a]);
    rb.add(geometry('box', () => new T.BoxGeometry()), 'timber', [-1.95 * Math.sin(a), 1.95 * Math.cos(a), 0], [0, 0, a], [.085, 3.25, .11]);
    for (let j = 0; j < 4; j++) {
      const y = 1.02 + j * .78, width = .46 + j * .115;
      r.rod([.04 * Math.cos(a) - y * Math.sin(a), .04 * Math.sin(a) + y * Math.cos(a), .13], [width * Math.cos(a) - y * Math.sin(a), width * Math.sin(a) + y * Math.cos(a), .13], .023, 'wood');
    }
  }
  r.sphere(.26, 'wood', 0, 0, .07, 1, 1, .6); r.sphere(.11, 'brass', 0, 0, .24);
  rb.finish(); animated.push((dt) => { rotor.rotation.z -= dt * .17; });
  lantern(b, glow, -1.05, 1.9, 2.58, .72);
  bench(b, -4.35, 3.8, .3, 1.7); planter(b, -3.35, 1.7, .88); planter(b, 3.35, -.9, .92);
  book(b, -4.4, .91, 3.8, .55, .35, 'coral');
  return 3.15;
}

function pavilion(ctx) {
  const { b, glow } = ctx, p = primitives(b);
  p.cyl(3.65, 3.85, .22, 'stone', 0, .11);
  p.cyl(3.55, 3.65, .1, 'stoneLight', 0, .27);
  stairs(b, 3.45, 3.1);
  for (const x of [-2.9, 2.9]) for (const z of [-1.9, 1.9]) {
    p.cyl(.32, .39, .5, 'stone', x, .52, z);
    p.cyl(.16, .2, 3.55, 'plaster', x, 2.45, z);
    p.cyl(.28, .21, .2, 'stoneLight', x, 4.22, z);
    p.rod([x, 3.65, z], [x - Math.sign(x) * .65, 4.65, z], .075, 'wood');
  }
  const roofArc = (z) => Array.from({ length: 17 }, (_, i) => {
    const t = i / 16 * Math.PI; return [-3.6 * Math.cos(t), 4.24 + Math.sin(t) * 1.8, z];
  });
  for (const z of [-2.5, -1.73, -.86, 0, .86, 1.73, 2.5]) b.add(arcTube(roofArc(z), .085, 40), 'wood');
  for (const x of [-3.25, -2.15, 0, 2.15, 3.25]) {
    const y = 4.24 + Math.sqrt(1 - (x / 3.6) ** 2) * 1.8;
    p.rod([x, y, -2.7], [x, y, 2.7], .055, 'brass');
  }
  const shade = geometry('pavilion-shade', () => {
    const positions = [], indices = [];
    for (let i = 0; i <= 32; i++) {
      const a = .07 + i / 32 * (Math.PI - .14);
      for (const z of [-.31, .31]) positions.push(-3.6 * Math.cos(a), 4.27 + Math.sin(a) * 1.8, z);
      if (i < 32) { const v = i * 2; indices.push(v, v + 2, v + 1, v + 1, v + 2, v + 3); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); return g;
  });
  for (const z of [-2.15, -.86, .43, 1.72]) b.add(shade, 'paper', [0, 0, z]);
  p.sphere(.14, 'brass', 0, 6.22, 0); p.rod([0, 6, 0], [0, 6.5, 0], .035, 'brass');
  // A physical, readable bar chart against a quiet dark display panel.
  p.box(3.2, 1.85, .16, 'sageDark', 0, 2.12, -1.25);
  p.box(3.42, .11, .28, 'wood', 0, 1.13, -1.25);
  p.box(3.42, .09, .23, 'brass', 0, 3.1, -1.25);
  [.6, 1.05, .81, 1.46, 1.23].forEach((h, i) => p.box(.34, h, .1, ['white', 'brass', 'blue', 'white', 'brass'][i], -1.14 + i * .57, 1.3 + h / 2, -1.13));
  for (const x of [-1.4, 1.4]) p.box(.09, 1.7, .12, 'wood', x, .95, -1.25);
  p.box(2.1, .15, 1.1, 'wood', 0, 1.07, 1.2);
  for (const x of [-.8, .8]) p.box(.14, .74, .7, 'stone', x, .65, 1.2);
  book(b, -.5, 1.23, 1.22, .65, -.14, 'coral'); book(b, -.48, 1.4, 1.22, .56, .08);
  book(b, .58, 1.24, 1.22, .7, .2, 'blue');
  bench(b, 2.1, .5, -Math.PI / 2, 1.8); bench(b, -2.1, .5, Math.PI / 2, 1.8);
  lantern(b, glow, -2.9, 3.5, 1.9, .8); lantern(b, glow, 2.9, 3.5, 1.9, .8);
  planter(b, -4.3, 1.3, 1); planter(b, 4.2, -1.3, .9);
  bench(b, -4.6, 4.1, .42, 1.8);
  return 3.75;
}

function observatory(ctx) {
  const { b, root, own, glow, animated, shadows } = ctx, p = primitives(b);
  b.add(lathe([[0, 0], [3.2, 0], [3.25, .25], [3.0, .5], [3.0, 3.8], [3.1, 4.1], [3.1, 4.45], [0, 4.45]]), 'plaster');
  p.cyl(3.35, 3.45, .24, 'stone', 0, .12);
  p.ring(3.02, .08, 'stoneLight', 0, 1.05);
  p.cyl(3.48, 3.4, .2, 'stoneLight', 0, 4.45);
  p.ring(3.28, .055, 'brass', 0, 4.63);
  doorway(b, 1.5, 2.5, 3.02); stairs(b, 3.0, 2.3);
  for (const a of [-1.03, 1.03, Math.PI]) windowArch(b, Math.sin(a) * 3.03, 1.6, Math.cos(a) * 3.03, a, .76, 1.3);
  const domePoints = [[0, 4.56], [3.31, 4.56]];
  for (let i = 1; i <= 20; i++) { const a = i / 20 * Math.PI / 2; domePoints.push([3.31 * Math.cos(a), 4.56 + 3.05 * Math.sin(a)]); }
  b.add(lathe(domePoints), 'sage');
  p.ring(3.31, .07, 'brass', 0, 4.6);
  for (let i = 0; i < 8; i++) {
    const angle = i * TAU / 8;
    const pts = Array.from({ length: 13 }, (_, j) => { const a = j / 12 * Math.PI / 2; return [3.33 * Math.cos(a) * Math.sin(angle), 4.56 + 3.07 * Math.sin(a), 3.33 * Math.cos(a) * Math.cos(angle)]; });
    b.add(arcTube(pts, .038, 28), 'brass');
  }
  // The telescope emerges from a raised, domed turret rather than a pointed cap.
  p.cyl(.6, .83, .35, 'brass', -.25, 7.57, 0);
  p.sphere(.65, 'sageDark', -.25, 7.78, 0, 1, .7, 1);
  const start = new T.Vector3(-.25, 7.93, 0), end = new T.Vector3(-1.65, 9.55, 1.6);
  const dir = end.clone().sub(start), quat = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir.clone().normalize()), eu = new T.Euler().setFromQuaternion(quat);
  b.add(cylinder(.42, .3), 'white', start.clone().add(end).multiplyScalar(.5).toArray(), [eu.x, eu.y, eu.z], [1, dir.length(), 1]);
  for (const t of [.13, .78, 1]) {
    const pos = start.clone().lerp(end, t);
    b.add(cylinder(.45, .45), 'brass', pos.toArray(), [eu.x, eu.y, eu.z], [1, .11, 1]);
  }
  b.add(cylinder(.365, .365), 'dark', end.clone().addScaledVector(dir.clone().normalize(), .07).toArray(), [eu.x, eu.y, eu.z], [1, .025, 1]);
  b.add(cylinder(.28, .28), 'blue', end.clone().addScaledVector(dir.clone().normalize(), .09).toArray(), [eu.x, eu.y, eu.z], [1, .026, 1]);
  const celestial = new T.Group(); celestial.position.set(2.1, 6.45, .85); root.add(celestial);
  const cb = batch(celestial, own, shadows), cp = primitives(cb);
  cp.ring(.88, .035, 'brass', 0, 0, 0, .45, .2); cp.ring(.7, .025, 'brass', 0, 0, 0, 1.7, .3); cp.sphere(.17, glow); cp.sphere(.09, 'white', .82, .05, .28);
  cb.finish(); animated.push((dt) => { celestial.rotation.y += dt * .1; });
  const constellation = [[-.57, .05], [0, .4], [.45, .12], [.25, -.3]];
  constellation.forEach(([x, y], i) => {
    b.add(starGeometry(), 'brass', [x - 1.9, y + 3.2, 2.42], [0, -.55, 0], [.13, .13, .13]);
    if (i) p.rod([constellation[i - 1][0] - 1.9, constellation[i - 1][1] + 3.2, 2.41], [x - 1.9, y + 3.2, 2.41], .016, 'brass');
  });
  lantern(b, glow, 1.08, 2.07, 3.13, .75);
  bench(b, -4.55, 3.85, .48, 1.8); planter(b, 3.75, -1.6, 1); book(b, -4.65, .91, 3.8, .65, .45, 'blue');
  return 3.55;
}

function waystation(ctx) {
  const { b, glow, animated, root, own, shadows } = ctx, p = primitives(b);
  p.cyl(3.65, 3.8, .17, 'stone', 0, .085);
  const posts = [[-2.75, -2.15, 4.4], [2.75, -2.15, 4.8], [-2.75, 1.95, 4.15], [2.75, 1.95, 4.4]];
  for (const [x, z, h] of posts) {
    p.cyl(.42, .5, .35, 'stoneLight', x, .175, z);
    p.cyl(.3, .35, 1.35, 'stone', x, 1, z);
    p.cyl(.14, .2, h - 1.6, 'wood', x, (h + 1.6) / 2, z);
    p.ring(.29, .045, 'brass', x, 1.65, z);
    p.sphere(.19, 'brass', x, h + .07, z, 1, .7, 1);
    lantern(b, glow, x, h - .52, z, .9);
  }
  for (const [i, j] of [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3]]) {
    const a = posts[i], c = posts[j];
    b.add(arcTube([[a[0], a[2], a[1]], [(a[0] + c[0]) / 2, (a[2] + c[2]) / 2 - .7, (a[1] + c[1]) / 2], [c[0], c[2], c[1]]], .023, 24), 'brass');
    if (i !== 0 || j !== 3) for (const t of [.3, .65]) {
      const x = a[0] + (c[0] - a[0]) * t, z = a[1] + (c[1] - a[1]) * t, y = a[2] + (c[2] - a[2]) * t - Math.sin(t * Math.PI) * .7;
      p.sphere(.075, glow, x, y, z);
    }
  }
  for (const z of [-1.9, -.6]) b.add(arcTube([[-3.1, 4.35, z], [-1.7, 4.9, z], [0, 5.15, z], [1.7, 4.9, z], [3.1, 4.55, z]], .085, 32), 'wood');
  for (let i = 0; i < 9; i++) {
    const x = -2.8 + i * .7;
    p.rod([x, 5.15 - (x / 3.1) ** 2 * .65, -2.15], [x, 5.15 - (x / 3.1) ** 2 * .65, -.38], .048, 'wood');
  }
  // Two sculpted grove trees frame the station without covering the entrance.
  for (const [x, z, size, side] of [[-3.15, -2.45, 1, -1], [3.0, -2.5, .92, 1]]) {
    p.rod([x, .15, z], [x + side * .15, 4.7 * size, z + .1], .18, 'timber');
    for (const [dx, dz, h] of [[-.6, .1, 4.8], [.65, -.2, 5.2], [0, .5, 5.7]]) {
      p.rod([x, 3.2 * size, z], [x + dx * size, h * size, z + dz * size], .08, 'wood');
      p.sphere(1.08 * size, h > 5.3 ? 'leafLight' : 'leaf', x + dx * size, h * size, z + dz * size, 1.12, .86, .9);
    }
  }
  p.box(2.7, .15, 1.35, 'wood', 0, 1.14, .2);
  for (const x of [-1, 1]) p.box(.17, .93, 1.0, 'stoneLight', x, .63, .2);
  for (const z of [-.28, .08, .44]) p.box(2.72, .035, .015, 'timber', 0, 1.23, z);
  book(b, -.65, 1.3, .22, .73, -.2, 'blue'); book(b, .55, 1.3, .1, .63, .18);
  // Small linked study tokens echo the lantern network overhead.
  for (const [x, z] of [[-.4, -.1], [.3, -.2], [.7, .35]]) p.sphere(.09, 'brass', x, 1.32, z, 1, .35, 1);
  p.rod([-.4, 1.3, -.1], [.3, 1.3, -.2], .014, 'brass'); p.rod([.3, 1.3, -.2], [.7, 1.3, .35], .014, 'brass');
  bench(b, 0, 1.6, 0, 2.3); bench(b, 0, -1.15, Math.PI, 2.3);
  planter(b, -4.2, 1.8, .9); planter(b, 4.1, -.7, .85);
  const hanging = new T.Group(); hanging.position.set(0, 4.33, 0); root.add(hanging);
  const hb = batch(hanging, own, shadows); lantern(hb, glow, 0, -.53, 0, .87); primitives(hb).rod([0, 0, 0], [0, -.18, 0], .018, 'brass'); hb.finish();
  animated.push((dt, time) => { hanging.rotation.z = Math.sin(time * .75) * .045; hanging.rotation.x = Math.sin(time * .43) * .035; });
  return 3.65;
}

function lighthouse(ctx) {
  const { b, root, own, glow, animated, shadows } = ctx, p = primitives(b);
  b.add(lathe([[0, 0], [2.35, 0], [2.4, .28], [2.23, .6], [2.1, 2], [1.92, 4.5], [1.7, 7.9], [1.8, 8.2], [0, 8.2]]), 'white');
  p.cyl(2.53, 2.65, .22, 'stone', 0, .11);
  p.ring(2.2, .065, 'stoneLight', 0, .8);
  p.cyl(2.04, 2.075, .36, 'sage', 0, 3.05);
  p.cyl(1.83, 1.85, .28, 'sage', 0, 6.0);
  doorway(b, 1.25, 2.35, 2.23); stairs(b, 2.25, 2.1);
  for (const [y, z] of [[4.5, 1.98], [6.8, 1.79]]) {
    p.ring(.32, .065, 'brass', 0, y, z, 0);
    b.add(cylinder(.27, .27), 'dark', [0, y, z], [Math.PI / 2, 0, 0], [1, .04, 1]);
    p.box(.45, .035, .06, 'brass', 0, y, z + .04); p.box(.035, .45, .06, 'brass', 0, y, z + .04);
  }
  p.cyl(2.8, 2.45, .3, 'stoneLight', 0, 8.26);
  p.cyl(2.83, 2.83, .1, 'brass', 0, 8.46);
  railing(b, 2.68, 8.48, 20);
  for (let i = 0; i < 8; i++) {
    const a = i * TAU / 8;
    p.rod([1.78 * Math.cos(a), 7.65, 1.78 * Math.sin(a)], [2.59 * Math.cos(a), 8.2, 2.59 * Math.sin(a)], .055, 'brass');
  }
  p.cyl(1.7, 1.8, .22, 'sageDark', 0, 8.66);
  b.add(cylinder(1.58, 1.58, true, 8), 'glass', [0, 9.74, 0], [0, Math.PI / 8, 0], [1, 2.02, 1]);
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + i * TAU / 8;
    p.rod([1.61 * Math.sin(a), 8.78, 1.61 * Math.cos(a)], [1.61 * Math.sin(a), 10.8, 1.61 * Math.cos(a)], .045, 'brass');
  }
  p.ring(1.62, .055, 'brass', 0, 9.6); p.ring(1.64, .07, 'brass', 0, 10.78);
  p.cyl(.34, .52, .9, 'brass', 0, 9.1);
  p.sphere(.63, glow, 0, 9.86, 0, 1, 1.1, 1);
  p.ring(.88, .035, 'brass', 0, 9.7); p.ring(.78, .035, 'brass', 0, 10.12);
  b.add(lathe([[0, 10.85], [2.02, 10.85], [2.06, 11.04], [1.85, 11.22], [1.65, 11.58], [1.22, 11.98], [.57, 12.29], [0, 12.36]]), 'sageDark');
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12;
    b.add(arcTube([[2.04 * Math.sin(a), 11.06, 2.04 * Math.cos(a)], [1.67 * Math.sin(a), 11.59, 1.67 * Math.cos(a)], [.58 * Math.sin(a), 12.31, .58 * Math.cos(a)], [0, 12.39, 0]], .024, 16), 'brass');
  }
  p.rod([0, 12.3, 0], [0, 12.77, 0], .04, 'brass'); p.sphere(.12, 'brass', 0, 12.81);
  const halo = new T.Group(); halo.position.set(0, 9.86, 0); root.add(halo);
  const hb = batch(halo, own, false), hp = primitives(hb);
  hp.ring(.78, .028, glow, 0, 0, 0, .85); hp.sphere(.095, glow, .84, 0, 0); hb.finish();
  animated.push((dt) => { halo.rotation.y += dt * .32; });
  lantern(b, glow, -1.05, 1.85, 2.26, .7);
  bench(b, -4.1, 3.8, .4, 1.8); planter(b, 3.5, -.9, 1); planter(b, -3.3, -1.7, .9);
  // Low compass mosaic, outside the building and away from the guide's position.
  b.add(starGeometry(), 'brass', [-3.6, .06, 1.2], [-Math.PI / 2, 0, .25], [.65, .65, .35]);
  p.ring(.9, .03, 'stoneLight', -3.6, .06, 1.2);
  return 3.05;
}

function ruinGate(ctx) {
  const { b, glow } = ctx, p = primitives(b);
  // Open passage: 6.8 m wide, crown 7.95 m. A 6 x 6 m rectangle fits inside.
  for (const side of [-1, 1]) {
    p.box(1.6, .34, 2.2, 'stone', side * 3.98, .17, 0);
    for (let i = 0; i < 6; i++) p.box(1.15 + (i === 0 ? .12 : 0), .69, 1.55, i % 2 ? 'stoneLight' : 'plaster', side * 3.97, .7 + i * .7, 0);
    p.box(1.48, .19, 1.88, 'stoneLight', side * 3.97, 4.58, 0);
    p.box(.14, 3.65, .09, 'stoneDark', side * 4.0, 2.29, .79);
  }
  const inner = 3.4, outer = 4.55, spring = 4.55;
  for (let i = 0; i < 15; i++) {
    const start = i * Math.PI / 15 + .007, end = (i + 1) * Math.PI / 15 - .007;
    const key = `gate-voussoir:${i}`;
    const g = geometry(key, () => {
      const s = new T.Shape(); s.absarc(0, 0, outer, start, end, false); s.lineTo(inner * Math.cos(end), inner * Math.sin(end)); s.absarc(0, 0, inner, end, start, true); s.closePath();
      const geo = new T.ExtrudeGeometry(s, { depth: 1.55, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 1, curveSegments: 6 }); geo.translate(0, spring, -.775); return geo;
    });
    b.add(g, i % 3 === 1 ? 'stoneLight' : 'plaster');
  }
  const archline = Array.from({ length: 33 }, (_, i) => { const a = i * Math.PI / 32; return [3.49 * Math.cos(a), spring + 3.49 * Math.sin(a), .81]; });
  b.add(arcTube(archline, .035, 48), 'brass');
  b.add(starGeometry(), 'brass', [0, 8.59, .86], [0, 0, 0], [.32, .39, .3]);
  p.sphere(.09, glow, 0, 8.59, .96);
  for (const side of [-1, 1]) {
    p.sphere(.65, 'leaf', side * 4.75, .37, -.3, 1.1, .7, 1);
    p.sphere(.46, 'leafLight', side * 4.6, .5, .42, 1, .7, 1);
    for (let i = 0; i < 5; i++) p.sphere(.11, 'leaf', side * (4.48 + Math.sin(i) * .12), .9 + i * .42, .79, .7, 1.4, .45);
  }
}

function create(type, options, build) {
  const root = new T.Group(); root.name = `meadow-landmark-${type}`;
  const scale = Number.isFinite(options.scale) && options.scale > 0 ? options.scale : 1;
  root.scale.setScalar(scale);
  const own = new Set(), animated = [], shadows = options.castShadow !== false;
  const glow = new T.MeshStandardMaterial({ color: '#fff3c8', emissive: '#f5cc78', emissiveIntensity: .8, roughness: .5 });
  glow.userData.luminous = true; own.add(glow);
  const colliders=[];
  const b = batch(root, own, shadows, colliders, type==='ruin-gate');
  const phase = Number.isFinite(options.phase) ? options.phase : 0;
  let alive = true, elapsed = phase;
  liveLandmarks++;
  function dispose() {
    if (!alive) return;
    alive = false;
    root.removeFromParent();
    root.clear();
    animated.length = 0;
    for (const resource of own) resource.dispose();
    own.clear();
    liveLandmarks--;
    releaseShared();
  }
  let radius;
  try {
    radius = build({ b, root, own, glow, animated, shadows });
    b.finish();
  } catch (error) { dispose(); throw error; }
  const result = {
    root, colliders,
    update(dt = 0, time) {
      if (!alive) return;
      const safeDt = Number.isFinite(dt) ? Math.max(0, Math.min(.1, dt)) : 0;
      elapsed = Number.isFinite(time) ? time + phase : elapsed + safeDt;
      glow.emissiveIntensity = .72 + Math.sin(elapsed * 1.4) * .1;
      for (const animate of animated) animate(safeDt, elapsed);
    },
    dispose,
  };
  if (radius !== undefined) result.collisionRadius = radius * scale;
  return result;
}

/**
 * Creates an independent, removable learning landmark at local ground origin.
 * options: { scale?: number, phase?: number, castShadow?: boolean }.
 * update takes seconds; dispose is idempotent and safe beside other live instances.
 */
export function createLandmark(type, options = {}) {
  const builders = { algorithm: windmill, data: pavilion, ai: observatory, network: waystation, citizen: lighthouse };
  if (!Object.hasOwn(builders, type)) throw new RangeError(`Unknown meadow landmark type: ${type}`);
  return create(type, options, builders[type]);
}

/** A real open arch. Caller owns collision for the two pillars at x = +/-3.97. */
export function createRuinGate(options = {}) {
  return create('ruin-gate', options, ruinGate);
}
