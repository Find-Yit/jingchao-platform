import * as T from './vendor/three/three.module.min.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const number = (v, fallback = 0) => Number.isFinite(v) ? v : fallback;
const smooth = v => { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); };

/** Original procedural traveler: y=0 feet, +Z forward, standing height 2.04.
 *  为了少画几次：所有关节是骨骼，固定在关节上的零件合成几块蒙皮网格（颜色写进顶点），
 *  披风和飘带合成两块每帧更新的网格。整个人物约 6 块网格（原来 49 块）。 */
export function createExplorer(options = {}) {
  const root = new T.Group();
  root.name = options.npc ? 'Meadow lantern guide' : 'Meadow light traveler';
  const rig = new T.Bone();
  root.add(rig);
  const upper = new T.Bone();
  upper.position.y = .945;
  rig.add(upper);
  const garment = new T.Bone();
  garment.position.y = -.945;
  upper.add(garment);
  const geometries = new Set(), materials = new Set();
  const own = geometry => (geometries.add(geometry), geometry);
  const standard = (color, values = {}) => {
    const material = new T.MeshStandardMaterial({color, roughness: .9, ...values});
    materials.add(material);
    return material;
  };
  const baseColor = new T.Color(options.color ?? (options.npc ? '#728c9d' : '#739789'));
  const coat = standard(baseColor, {side: T.DoubleSide});
  const shoulderCloth = standard(baseColor.clone().lerp(new T.Color('#d9d5b9'), .17), {side: T.DoubleSide});
  const lining = standard('#e8d9ad', {side: T.DoubleSide});
  const robe = standard('#eee5cc');
  const hair = standard('#f7edcf', {roughness: .77});
  const hairShadow = standard('#ddd9bd');
  const mask = standard('#303c3b', {roughness: .76});
  const limbs = standard('#5b6860');
  const gloves = standard(options.skin ?? '#cdbda1');
  const bootMaterial = standard('#bcb9a2');
  const soleMaterial = standard('#656c5c');
  const gold = standard(options.accent ?? '#d5b775', {roughness: .51, metalness: .28, side: T.DoubleSide});
  const eyeLight = standard('#fff4c9', {emissive: '#ffe9a7', emissiveIntensity: 2.2, toneMapped: false});
  const halo = new T.MeshBasicMaterial({color: '#ffe7ac', transparent: true, opacity: .13, depthWrite: false, toneMapped: false});
  materials.add(halo);
  const sphere = own(new T.SphereGeometry(1, 16, 12));
  const thighShape = own(new T.CapsuleGeometry(.063, .269, 4, 12));
  const shinShape = own(new T.CapsuleGeometry(.055, .295, 4, 12));
  const upperArmShape = own(new T.CapsuleGeometry(.055, .18, 4, 10));
  const lowerArmShape = own(new T.CapsuleGeometry(.047, .166, 4, 10));
  // 先放一个占位节点记下零件的几何体、材质和相对关节的位置，最后统一烘焙进蒙皮网格
  function mesh(geometry, material, parent = garment, name = '') {
    const result = new T.Object3D();
    result.userData.part = {geometry, material};
    result.castShadow = true;
    result.receiveShadow = true;
    result.name = name;
    parent.add(result);
    return result;
  }
  function ellipsoid(material, x, y, z, sx, sy, sz, parent = garment, name = '') {
    const result = mesh(sphere, material, parent, name);
    result.position.set(x, y, z);
    result.scale.set(sx, sy, sz);
    return result;
  }
  function joint(parent, x, y, z = 0) {
    const result = new T.Bone();
    result.position.set(x, y, z);
    parent.add(result);
    return result;
  }

  // A continuous tailored tunic avoids intersecting spheres and visible belly seams.
  const profile = [[0,.885],[.132,.896],[.185,.93],[.19,.99],[.169,1.10],[.175,1.22],[.206,1.36],[.238,1.43],[.19,1.47],[.085,1.505],[0,1.505]];
  const tunic = mesh(own(new T.LatheGeometry(profile.map(p => new T.Vector2(...p)), 28)), robe, garment, 'traveler:tunic');
  tunic.scale.z = .73;
  ellipsoid(mask, 0, 1.53, 0, .077, .115, .071);
  const collar = mesh(own(new T.TorusGeometry(.145, .039, 8, 32)), lining);
  collar.position.set(0, 1.49, -.005);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(1.22, .85, 1);
  const belt = mesh(own(new T.TorusGeometry(.174, .009, 6, 28)), gold);
  belt.position.y = 1.1;
  belt.rotation.x = Math.PI / 2;
  belt.scale.y = .75;
  ellipsoid(gold, 0, 1.374, .174, .034, .046, .012);
  ellipsoid(eyeLight, 0, 1.375, .187, .013, .023, .006, garment, 'traveler:pendant');

  // The smaller face is a curved, tapered mask, with no mouth, cheeks, or round nose.
  const head = joint(garment, 0, 1.766, .012);
  ellipsoid(mask, 0, -.006, .015, .167, .216, .14, head);
  const facePositions = [], faceIndices = [], faceRings = 9, faceSides = 40;
  for (let r = 0; r <= faceRings; r++) {
    const radius = r / faceRings;
    for (let i = 0; i <= faceSides; i++) {
      const a = i / faceSides * TAU;
      facePositions.push(Math.sin(a) * .172 * (1 + .19 * Math.cos(a)) * radius,
        Math.cos(a) * .211 * radius,
        .169 + .052 * (1 - radius * radius));
      if (r < faceRings && i < faceSides) {
        const v = r * (faceSides + 1) + i, next = v + faceSides + 1;
        faceIndices.push(v, v + 1, next, v + 1, next + 1, next);
      }
    }
  }
  const faceGeometry = own(new T.BufferGeometry());
  faceGeometry.setAttribute('position', new T.Float32BufferAttribute(facePositions, 3));
  faceGeometry.setIndex(faceIndices);
  faceGeometry.computeVertexNormals();
  mesh(faceGeometry, mask, head, 'traveler:mask');
  for (const side of [-1, 1]) {
    const eye = ellipsoid(eyeLight, side * .062, .009, .217, .016, .030, .01, head, 'traveler:eye');
    eye.rotation.z = side * -.08;
    const glow = ellipsoid(halo, side * .062, .009, .223, .026, .039, .006, head);
    glow.castShadow = glow.receiveShadow = false;
  }
  const inlay = ellipsoid(gold, 0, .117, .207, .008, .025, .004, head);
  inlay.rotation.z = -.12;

  // A swept ivory hairstyle: one cap and tapered ribbon-like locks, no helmet rim.
  const cap = mesh(own(new T.SphereGeometry(1, 28, 18, 0, TAU, 0, Math.PI * .68)), hair, head, 'traveler:hair');
  cap.position.set(0, .009, -.038);
  cap.scale.set(.224, .263, .194);
  function hairLock(points, width, material, parent = head) {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)));
    const positions = [], indices = [], count = 16, sides = 10;
    for (let row = 0; row <= count; row++) {
      const t = row / count, point = curve.getPoint(t), tangent = curve.getTangent(t);
      const len = Math.hypot(tangent.x, tangent.y) || 1;
      const radius = width * Math.pow(1 - t, .65) + .001;
      for (let col = 0; col <= sides; col++) {
        const a = col / sides * TAU, w = Math.cos(a) * radius;
        positions.push(point.x + tangent.y / len * w, point.y - tangent.x / len * w, point.z + Math.sin(a) * radius * .52);
        if (row < count && col < sides) {
          const v = row * (sides + 1) + col, next = v + sides + 1;
          indices.push(v, next, v + 1, v + 1, next, next + 1);
        }
      }
    }
    const geometry = own(new T.BufferGeometry());
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return mesh(geometry, material, parent);
  }
  hairLock([[-.17,.15,.12],[-.095,.224,.16],[.025,.204,.192],[.117,.11,.204]], .067, hair);
  hairLock([[-.13,.21,.07],[-.038,.25,.106],[.105,.224,.132],[.189,.155,.112]], .059, hair);
  hairLock([[-.196,.09,.04],[-.209,-.015,.063],[-.192,-.123,.102],[-.146,-.189,.121]], .042, hairShadow);
  hairLock([[.195,.095,.025],[.211,-.021,.042],[.2,-.116,.083],[.167,-.173,.115]], .041, hair);
  hairLock([[.01,.17,-.189],[.044,.063,-.214],[.085,-.10,-.204],[.139,-.186,-.171]], .057, hairShadow);

  const legs = [];
  for (const side of [-1, 1]) {
    const hip = joint(rig, side * .105, .965);
    const thigh = mesh(thighShape, limbs, hip);
    thigh.position.y = -.1975;
    const knee = joint(hip, 0, -.395);
    ellipsoid(limbs, 0, 0, 0, .060, .061, .060, knee);
    const shin = mesh(shinShape, limbs, knee);
    shin.position.y = -.2025;
    const ankle = joint(knee, 0, -.405);
    ellipsoid(bootMaterial, 0, -.008, -.002, .071, .104, .078, ankle);
    ellipsoid(bootMaterial, 0, -.097, .049, .083, .066, .153, ankle);
    ellipsoid(soleMaterial, 0, -.155, .05, .084, .010, .151, ankle);
    const ankleTrim = mesh(own(new T.TorusGeometry(.069, .008, 5, 16)), gold, ankle);
    ankleTrim.position.y = .047;
    ankleTrim.rotation.x = Math.PI / 2;
    ankleTrim.scale.y = 1.06;
    legs.push({hip, knee, ankle, side});
  }
  const arms = [];
  for (const side of [-1, 1]) {
    const shoulder = joint(garment, side * .239, 1.438, -.008);
    const sleeve = mesh(upperArmShape, robe, shoulder);
    sleeve.position.y = -.145;
    const elbow = joint(shoulder, 0, -.29);
    ellipsoid(robe, 0, 0, 0, .052, .053, .052, elbow);
    const forearm = mesh(lowerArmShape, robe, elbow);
    forearm.position.y = -.13;
    const wrist = joint(elbow, 0, -.264);
    ellipsoid(gloves, 0, -.025, .003, .042, .068, .036, wrist);
    arms.push({shoulder, elbow, wrist, side});
  }

  let clock = 0, phase = 0, speed = 0, run = 0, move = 0, air = 0;
  let turning = 0, landing = 0, waving = 0, lastGrounded = true, lastVertical = 0;
  let secondaryMotion = 1, disposed = false;
  const capeStart = .59, capeEnd = TAU - .59;
  const panels = [];
  // These three layers have distinct lengths and curvature. Flight opens their
  // lower edges into a broad swept silhouette, while their neck anchors stay fixed.
  const layers = [
    {top:1.466, radius:.211, flare:.245, front:.52, back:.95, opening:.84, offset:0, material:coat},
    {top:1.448, radius:.198, flare:.22, front:.60, back:1.065, opening:.78, offset:.012, material:lining},
    {top:1.493, radius:.204, flare:.16, front:.205, back:.355, opening:.32, offset:.019, material:shoulderCloth},
  ];
  function capePoint(layerIndex, a, d, trim, output, offset) {
    const layer = layers[layerIndex];
    const back = (1 - Math.cos(a)) * .5;
    const side = Math.abs(Math.sin(a));
    const edge = d * d;
    const drape = layer.front + (layer.back - layer.front) * Math.pow(back, .85);
    const open = air * layer.opening;
    const radius = layer.radius + layer.flare * Math.sin(d * Math.PI * .5)
      + Math.sin(a * 6 + .3) * .012 * d + trim;
    const hemCurve = Math.sin(a * 3.5 - .2) * .023 * edge;
    output[offset] = Math.sin(a) * (radius + open * smooth(d))
      + secondaryMotion * edge * (Math.sin(clock * 1.7 + a * 2 + d * 4) * .012 + turning * .015);
    output[offset + 1] = layer.top - drape * d + hemCurve
      + air * d * (side * (layerIndex === 2 ? .21 : .68) + back * .22)
      + secondaryMotion * edge * (Math.sin(clock * 2.25 + a * 1.5) * .012
        + move * Math.sin(phase * 2 - a * .6) * .018);
    output[offset + 2] = Math.cos(a) * radius * .81 - .033 - layer.offset
      - edge * (run * .12 + air * (.25 + back * .1))
      + secondaryMotion * edge * Math.sin(clock * 2.6 - a * 2 + d * 3) * (.014 + air * .014);
  }
  // 每帧重算形状的布料分块（衣服坐标系），最后按材质合成两块网格：布料（顶点色）和金线
  const cloth = [];
  function parametric(layerIndex, parameters, indices, material, name) {
    const part = {count: parameters.length / 3, indices, material, name, positions: null, parameters: new Float32Array(parameters), layerIndex};
    panels.push(part);
    cloth.push(part);
    return part;
  }
  function addCape(layerIndex) {
    const around = 40, down = layerIndex === 2 ? 5 : 10;
    const parameters = [], indices = [];
    for (let row = 0; row <= down; row++) for (let col = 0; col <= around; col++) {
      parameters.push(capeStart + (capeEnd - capeStart) * col / around, row / down, 0);
      if (row < down && col < around) {
        const v = row * (around + 1) + col, next = v + around + 1;
        indices.push(v, next, v + 1, v + 1, next, next + 1);
      }
    }
    parametric(layerIndex, parameters, indices, layers[layerIndex].material, `traveler:cape-${layerIndex}`);
    const trimParameters = [], trimIndices = [];
    function quad(a0, a1, d0, d1) {
      const i = trimParameters.length / 3;
      trimParameters.push(a0,d0,.005,a0,d1,.005,a1,d0,.005,a1,d1,.005);
      trimIndices.push(i,i+1,i+2,i+2,i+1,i+3);
    }
    for (let i = 0; i < around; i++) {
      const a = capeStart + (capeEnd - capeStart) * i / around;
      quad(a, a + (capeEnd - capeStart) / around, layerIndex === 2 ? .947 : .977, .999);
    }
    if (layerIndex !== 1) for (let i = 0; i < down; i++) {
      quad(capeStart, capeStart + .02, i / down, (i + 1) / down);
      quad(capeEnd - .02, capeEnd, i / down, (i + 1) / down);
    }
    parametric(layerIndex, trimParameters, trimIndices, gold, `traveler:gold-hem-${layerIndex}`);
  }
  addCape(1);
  addCape(0);
  addCape(2);
  // A fine botanical sprig at the back gives the traveler a distinct meadow identity.
  const embroideryParameters = [], embroideryIndices = [];
  function stitch(a0, d0, a1, d1, width) {
    const i = embroideryParameters.length / 3;
    embroideryParameters.push(a0-width,d0,.007,a1-width,d1,.007,a0+width,d0,.007,a1+width,d1,.007);
    embroideryIndices.push(i,i+1,i+2,i+2,i+1,i+3);
  }
  stitch(Math.PI,.39,Math.PI,.70,.005);
  for (let leaf = 0; leaf < 3; leaf++) for (const side of [-1,1]) {
    const base = .43 + leaf * .085;
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU, b = (i + 1) / 14 * TAU;
      const u0 = Math.PI + side * (.09 + Math.sin(a) * .078);
      const u1 = Math.PI + side * (.09 + Math.sin(b) * .078);
      stitch(u0,base + Math.cos(a) * .035 + (u0-Math.PI)*side*.13,
        u1,base + Math.cos(b) * .035 + (u1-Math.PI)*side*.13,.004);
    }
  }
  parametric(0, embroideryParameters, embroideryIndices, gold, 'traveler:meadow-embroidery');

  // Two thin shoulder ribbons echo the cape motion without a bulky scarf knot.
  const ribbonIndices = [];
  for (let ribbon = 0; ribbon < 2; ribbon++) for (let row = 0; row < 12; row++) for (let col = 0; col < 2; col++) {
    const i = ribbon * 39 + row * 3 + col;
    ribbonIndices.push(i,i+3,i+1,i+1,i+3,i+4);
  }
  const ribbonPart = {count: 2 * 13 * 3, indices: ribbonIndices, material: lining, name: 'traveler:ribbons', positions: null};
  cloth.push(ribbonPart);

  // —— 烘焙：在静止姿态下把固定零件按材质类别合成蒙皮网格，每个顶点绑在所在关节上 ——
  root.updateMatrixWorld(true);
  const bones = [];
  root.traverse(o => { if (o.isBone) bones.push(o); });
  const skeleton = new T.Skeleton(bones);
  // 各部位原来的粗糙度不同（头发、面罩更有光泽），写进顶点属性 aRough，着色时按顶点取
  const bodyMaterial = new T.MeshStandardMaterial({vertexColors: true, roughness: .9});
  bodyMaterial.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float aRough;\nvarying float vRough;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvRough = aRough;');
    shader.fragmentShader = 'varying float vRough;\n' + shader.fragmentShader.replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vRough;');
  };
  bodyMaterial.customProgramCacheKey = () => 'traveler-vertex-roughness';
  const clothMaterial = new T.MeshStandardMaterial({vertexColors: true, roughness: .9, side: T.DoubleSide});
  const kindOf = material => material === gold ? 'gold' : material === eyeLight ? 'eyes' : material === halo ? 'halo' : 'body';
  const targets = {body: bodyMaterial, gold, eyes: eyeLight, halo};
  const groups = {body: [], gold: [], eyes: [], halo: []}, placeholders = [];
  root.traverse(o => { if (o.userData.part) { groups[kindOf(o.userData.part.material)].push(o); placeholders.push(o); } });
  const normalMatrix = new T.Matrix3(), v = new T.Vector3();
  for (const kind of ['body', 'gold', 'eyes', 'halo']) {
    const list = groups[kind];
    let total = 0, indexTotal = 0;
    for (const o of list) { const g = o.userData.part.geometry; total += g.attributes.position.count; indexTotal += g.index.count; }
    const position = new Float32Array(total * 3), normal = new Float32Array(total * 3), color = new Float32Array(total * 3), rough = new Float32Array(total);
    const skinIndex = new Uint16Array(total * 4), skinWeight = new Float32Array(total * 4), index = new Uint32Array(indexTotal);
    let base = 0, at = 0;
    for (const o of list) {
      const g = o.userData.part.geometry, src = g.attributes.position, nrm = g.attributes.normal, c = o.userData.part.material.color, bone = bones.indexOf(o.parent);
      normalMatrix.getNormalMatrix(o.matrixWorld);
      for (let i = 0; i < src.count; i++) {
        v.fromBufferAttribute(src, i).applyMatrix4(o.matrixWorld).toArray(position, (base + i) * 3);
        v.fromBufferAttribute(nrm, i).applyMatrix3(normalMatrix).normalize().toArray(normal, (base + i) * 3);
        color[(base + i) * 3] = c.r; color[(base + i) * 3 + 1] = c.g; color[(base + i) * 3 + 2] = c.b; rough[base + i] = o.userData.part.material.roughness;
        skinIndex[(base + i) * 4] = bone; skinWeight[(base + i) * 4] = 1;
      }
      for (let i = 0; i < g.index.count; i++) index[at++] = g.index.getX(i) + base;
      base += src.count;
    }
    const geometry = own(new T.BufferGeometry());
    geometry.setAttribute('position', new T.BufferAttribute(position, 3));
    geometry.setAttribute('normal', new T.BufferAttribute(normal, 3));
    if (kind === 'body') { geometry.setAttribute('color', new T.BufferAttribute(color, 3)); geometry.setAttribute('aRough', new T.BufferAttribute(rough, 1)); }
    geometry.setAttribute('skinIndex', new T.BufferAttribute(skinIndex, 4));
    geometry.setAttribute('skinWeight', new T.BufferAttribute(skinWeight, 4));
    geometry.setIndex(new T.BufferAttribute(index, 1));
    const skinned = new T.SkinnedMesh(geometry, targets[kind]);
    skinned.name = `traveler:${kind}`;
    skinned.castShadow = skinned.receiveShadow = kind !== 'halo';
    root.add(skinned);
    skinned.bind(skeleton);
    // 固定一个足够大的包围球（抬手、飞行都在里面），不按姿态重算
    skinned.boundingSphere = new T.Sphere(new T.Vector3(0, 1.05, -.05), 1.8);
  }
  // 布料：按材质合成两块，每个分块的位置数组是合成数组里的一段（直接原地改写）
  const clothMeshes = [];
  for (const goldThread of [false, true]) {
    const list = cloth.filter(part => (part.material === gold) === goldThread);
    const total = list.reduce((n, part) => n + part.count, 0), position = new Float32Array(total * 3), color = new Float32Array(total * 3), index = [];
    let base = 0;
    for (const part of list) {
      part.positions = position.subarray(base * 3, (base + part.count) * 3);
      const c = part.material.color;
      for (let i = 0; i < part.count; i++) { color[(base + i) * 3] = c.r; color[(base + i) * 3 + 1] = c.g; color[(base + i) * 3 + 2] = c.b; }
      for (const i of part.indices) index.push(i + base);
      base += part.count;
    }
    const geometry = own(new T.BufferGeometry());
    geometry.setAttribute('position', new T.BufferAttribute(position, 3).setUsage(T.DynamicDrawUsage));
    if (!goldThread) geometry.setAttribute('color', new T.BufferAttribute(color, 3));
    geometry.setIndex(index);
    geometry.boundingSphere = new T.Sphere(new T.Vector3(0, 1.1, -.2), 1.65);
    const result = new T.Mesh(geometry, goldThread ? gold : clothMaterial);
    result.name = goldThread ? 'traveler:gold-thread' : 'traveler:cloth';
    result.castShadow = result.receiveShadow = true;
    garment.add(result);
    clothMeshes.push(result);
  }
  const ribbonPositions = ribbonPart.positions;
  // 占位节点、零件原始几何体和只用来取颜色的材质都不再需要
  for (const o of placeholders) { o.removeFromParent(); geometries.delete(o.userData.part.geometry); }
  for (const g of new Set(placeholders.map(o => o.userData.part.geometry))) g.dispose();
  for (const m of [...materials]) if (m !== gold && m !== eyeLight && m !== halo) { materials.delete(m); m.dispose(); }
  materials.add(bodyMaterial); materials.add(clothMaterial);

  function update(dt, pose = {}) {
    if (disposed) return;
    dt = clamp(number(dt), 0, .1);
    clock = number(pose.time, clock + dt);
    const damping = 1 - Math.exp(-dt * 11);
    const grounded = pose.grounded !== false, vertical = number(pose.verticalVelocity);
    secondaryMotion = pose.reducedMotion ? .16 : 1;
    speed += (Math.max(0, number(pose.speed)) - speed) * damping;
    run = clamp(speed / Math.max(.2, number(pose.maxSpeed, 6)), 0, 1.15);
    move = smooth(speed / .8);
    phase = (phase + dt * speed * 2.35) % TAU;
    air += ((grounded ? 0 : 1) - air) * (1 - Math.exp(-dt * (grounded ? 8 : 6)));
    turning += (clamp(number(pose.turn), -2.5, 2.5) - turning) * damping;
    waving += (clamp(Number(pose.wave) || 0, 0, 1) - waving) * (1 - Math.exp(-dt * 6));
    landing *= Math.exp(-dt * 11);
    landing = Math.max(landing, clamp(number(pose.landing), 0, 1));
    if (grounded && !lastGrounded) landing = Math.max(landing, clamp(Math.abs(lastVertical) * .11, .2, 1));
    lastGrounded = grounded;
    lastVertical = vertical;

    const bodyY = -.088 * move * (1-air) - landing * .105
      + (1-Math.cos(phase*2)) * .009 * move * (1-air) * secondaryMotion
      + Math.sin(clock*1.75) * .0025 * secondaryMotion;
    rig.position.y = bodyY;
    upper.rotation.x = -.09 * run * (1-air) - air * .12 + landing * .09;
    upper.rotation.z = -turning * .033 + Math.sin(phase) * move * .012 * (1-air) * secondaryMotion;
    head.rotation.x = .04 * run + air * .06 - landing * .04;
    head.rotation.y = -turning * .05 + Math.sin(clock*.7) * .018 * (1-move) * secondaryMotion;
    head.rotation.z = Math.sin(clock*1.1) * .012 * secondaryMotion + waving * .025;
    // Ground contact owns the feet immediately; the cape and arms can settle
    // more slowly without letting pointed airborne toes penetrate the ground.
    const legAir = grounded ? 0 : air;
    for (let index = 0; index < 2; index++) {
      const leg = legs[index], cycle = (phase/TAU + index*.5) % 1;
      const swing = cycle > .59 ? (cycle-.59)/.41 : 0;
      const stride = Math.min(.37, .09 + run*.29) * move;
      const footZ = cycle <= .59 ? stride*(1-2*cycle/.59) : stride*(-1+2*smooth(swing));
      const lift = Math.sin(swing*Math.PI) * (.095+run*.105) * move;
      const dy = .165+lift-.965-bodyY;
      const distance = clamp(Math.hypot(dy,footZ), .18, .7999);
      const direction = Math.atan2(-footZ,-dy);
      const hipBend = Math.acos(clamp((.395*.395+distance*distance-.405*.405)/(2*.395*distance),-1,1));
      const kneeBend = Math.PI-Math.acos(clamp((.395*.395+.405*.405-distance*distance)/(2*.395*.405),-1,1));
      const rise = clamp(vertical*.075, -.3, .7);
      const floatingHip = -.15-rise*.2+index*.14+Math.sin(clock*1.4+index)*.025*secondaryMotion;
      const floatingKnee = .43+rise*.4+index*.13;
      leg.hip.rotation.x = (direction-hipBend)*(1-legAir)+floatingHip*legAir;
      leg.knee.rotation.x = kneeBend*(1-legAir)+floatingKnee*legAir;
      leg.hip.rotation.z = leg.side * legAir * .045;
      leg.ankle.rotation.x = -(leg.hip.rotation.x+leg.knee.rotation.x)*(1-legAir)
        -Math.sin(swing*Math.PI)*.19*move*(1-legAir)+legAir*.17;
    }
    for (let index = 0; index < 2; index++) {
      const arm = arms[index], wave = index === 1 ? waving*(1-air) : 0;
      const swing = Math.sin(phase + index*Math.PI) * move * (.21+run*.27);
      arm.shoulder.rotation.x = swing*(1-air)-air*.27-wave*.08;
      arm.shoulder.rotation.z = arm.side*(.075+air*1.12+wave*2.02);
      arm.elbow.rotation.x = -.12-Math.max(0,-swing)*.25-air*.13;
      arm.elbow.rotation.z = arm.side*(air*.11+wave*(.43+Math.sin(clock*4.5)*.14*secondaryMotion));
      arm.wrist.rotation.z = arm.side*(air*.08+wave*Math.sin(clock*4.5+.4)*.12*secondaryMotion);
    }
    for (let p = 0; p < panels.length; p++) {
      const panel = panels[p], parameters = panel.parameters;
      for (let i = 0; i < parameters.length; i += 3) {
        capePoint(panel.layerIndex,parameters[i],parameters[i+1],parameters[i+2],panel.positions,i);
      }
    }
    for (let ribbon = 0; ribbon < 2; ribbon++) for (let row = 0; row < 13; row++) {
      const t = row/12, loose = t*t, length = ribbon ? .43 : .51;
      for (let col = 0; col < 3; col++) {
        const i = (ribbon*39+row*3+col)*3;
        ribbonPositions[i] = .14+ribbon*.052+(col-1)*.028*(1-.42*t)
          +secondaryMotion*loose*Math.sin(clock*2.3+t*4+ribbon)*.025;
        ribbonPositions[i+1] = 1.48-length*t+air*loose*.23;
        ribbonPositions[i+2] = .153+Math.sin(t*Math.PI)*.025-loose*(run*.06+air*.34)
          +secondaryMotion*loose*Math.sin(clock*2.8+t*5)*.014;
      }
    }
    for (const m of clothMeshes) {
      m.geometry.attributes.position.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    root.removeFromParent();
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    skeleton.dispose();
  }
  update(0, {time:0});
  return {root, update, dispose};
}
