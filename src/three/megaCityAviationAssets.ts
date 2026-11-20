import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export type AviationAssetId = 'combined' | 'airport' | 'commercial' | 'seaplane';

export interface ModelStats {
  meshes: number;
  triangles: number;
  materials: number;
}

export interface AviationAnimatedRefs {
  radarDish?: THREE.Object3D;
  propellers: THREE.Object3D[];
  flyingPlane?: THREE.Object3D;
  seaplane?: THREE.Object3D;
  beacons: THREE.Mesh[];
}

function createRunwayCanvasTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Tropical island base grass apron
    ctx.fillStyle = '#3E9C52';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle turf stripes
    ctx.fillStyle = '#368C48';
    for (let x = 0; x < 1024; x += 32) {
      ctx.fillRect(x, 0, 16, 512);
    }

    // Concrete terminal apron (upper zone)
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(80, 40, 560, 175);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 40, 560, 175);

    // Helipad circle on apron right
    ctx.beginPath();
    ctx.arc(570, 128, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F8B824';
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 570, 130);

    // Taxiway connectors
    ctx.fillStyle = '#475569';
    ctx.fillRect(150, 215, 52, 65);
    ctx.fillRect(680, 215, 52, 65);
    ctx.fillStyle = '#F8B824';
    ctx.fillRect(173, 215, 6, 75);
    ctx.fillRect(703, 215, 6, 75);

    // Main Asphalt Runway
    ctx.fillStyle = '#2B3644';
    ctx.fillRect(48, 280, 928, 176);

    // Runway edge white stripes
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(54, 288, 916, 6);
    ctx.fillRect(54, 442, 916, 6);

    // Threshold piano keys (left & right)
    for (let i = 0; i < 6; i++) {
      const y = 304 + i * 22;
      ctx.fillRect(68, y, 42, 12);
      ctx.fillRect(914, y, 42, 12);
    }

    // Runway numbers "09" and "27"
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 38px sans-serif';
    ctx.save();
    ctx.translate(145, 368);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('09', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(879, 368);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('27', 0, 0);
    ctx.restore();

    // Dashed centerline
    for (let x = 195; x < 825; x += 56) {
      ctx.fillRect(x, 364, 32, 8);
    }

    // Parking bays on concrete apron
    ctx.strokeStyle = '#F8B824';
    ctx.lineWidth = 3;
    [220, 360].forEach((cx) => {
      ctx.beginPath();
      ctx.moveTo(cx, 200);
      ctx.lineTo(cx, 145);
      ctx.moveTo(cx - 22, 165);
      ctx.lineTo(cx + 22, 165);
      ctx.stroke();
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createMaterials() {
  return {
    sandBase: new THREE.MeshStandardMaterial({
      color: 0xf5d78e,
      roughness: 0.9,
      metalness: 0.0,
    }),
    stuccoCream: new THREE.MeshStandardMaterial({
      color: 0xfbf7ee,
      roughness: 0.78,
      metalness: 0.02,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xd95b38,
      roughness: 0.62,
      metalness: 0.05,
    }),
    turquoiseGlass: new THREE.MeshPhysicalMaterial({
      color: 0x12b5cb,
      roughness: 0.14,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
    goldAccent: new THREE.MeshStandardMaterial({
      color: 0xf8b824,
      roughness: 0.3,
      metalness: 0.65,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.42,
      metalness: 0.72,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.9,
    }),
    tealPaint: new THREE.MeshStandardMaterial({
      color: 0x0b7a8f,
      roughness: 0.38,
      metalness: 0.25,
    }),
    palmTrunk: new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.88,
      metalness: 0.0,
    }),
    palmLeaf: new THREE.MeshStandardMaterial({
      color: 0x2e9e47,
      roughness: 0.65,
      metalness: 0.0,
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: 0x171c24,
      roughness: 0.88,
      metalness: 0.05,
    }),
    beaconAmber: new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xff9f1c,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.1,
    }),
    beaconGreen: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.1,
    }),
    beaconRed: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.1,
    }),
  };
}

function createPalmTree(mats: ReturnType<typeof createMaterials>): THREE.Group {
  const tree = new THREE.Group();
  tree.name = 'PalmTree';

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.08, 0.55, 0.04),
    new THREE.Vector3(0.14, 1.15, 0.02),
  ]);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.08, 6, false), mats.palmTrunk);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  const frondGeo = new THREE.ConeGeometry(0.16, 0.85, 4);
  frondGeo.scale(1.4, 1, 0.25);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.set(0.14, 1.15, 0.02);
    pivot.rotation.y = angle;
    const leaf = new THREE.Mesh(frondGeo, mats.palmLeaf);
    leaf.rotation.z = -Math.PI / 2.6;
    leaf.position.set(0.36, -0.05, 0);
    leaf.castShadow = true;
    pivot.add(leaf);
    tree.add(pivot);
  }
  return tree;
}

export function buildCommercialPlaneModel(): {
  group: THREE.Group;
  refs: AviationAnimatedRefs;
} {
  const mats = createMaterials();
  const plane = new THREE.Group();
  plane.name = 'MegaAir_CommercialPlane';

  const props: THREE.Object3D[] = [];

  // Fuselage profile via LatheGeometry (aligned along Z axis)
  const pts = [
    new THREE.Vector2(0.0, 2.25),
    new THREE.Vector2(0.16, 2.08),
    new THREE.Vector2(0.34, 1.7),
    new THREE.Vector2(0.42, 1.25),
    new THREE.Vector2(0.44, 0.0),
    new THREE.Vector2(0.42, -1.1),
    new THREE.Vector2(0.24, -1.95),
    new THREE.Vector2(0.06, -2.3),
    new THREE.Vector2(0.0, -2.35),
  ];
  const fuselageGeo = new THREE.LatheGeometry(pts, 18);
  fuselageGeo.rotateX(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, mats.stuccoCream);
  fuselage.name = 'Fuselage';
  fuselage.position.y = 0.72;
  fuselage.castShadow = true;
  fuselage.receiveShadow = true;
  plane.add(fuselage);

  // Tropical turquoise belly stripe
  const stripeGeo = new THREE.CylinderGeometry(0.452, 0.445, 2.35, 18, 1, true);
  stripeGeo.rotateX(Math.PI / 2);
  const stripe = new THREE.Mesh(stripeGeo, mats.tealPaint);
  stripe.position.set(0, 0.65, 0.08);
  stripe.scale.set(1.0, 0.34, 1.0);
  plane.add(stripe);

  // Cockpit wrap windshield
  const cockpitGeo = new THREE.CylinderGeometry(0.37, 0.41, 0.42, 16, 1, false, -Math.PI * 0.42, Math.PI * 0.84);
  cockpitGeo.rotateX(Math.PI / 2);
  const cockpit = new THREE.Mesh(cockpitGeo, mats.turquoiseGlass);
  cockpit.name = 'CockpitGlass';
  cockpit.position.set(0, 0.84, 1.56);
  cockpit.rotation.x = 0.22;
  plane.add(cockpit);

  // Passenger windows strip (left & right)
  const winGeo = new THREE.BoxGeometry(0.9, 0.1, 1.65);
  const windows = new THREE.Mesh(winGeo, mats.turquoiseGlass);
  windows.position.set(0, 0.82, 0.12);
  plane.add(windows);

  // Swept Main Wings via ExtrudeGeometry
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0.25, 0.52);
  wingShape.lineTo(2.35, -0.35);
  wingShape.lineTo(2.35, -0.78);
  wingShape.lineTo(0.25, -0.45);
  wingShape.closePath();

  const wingExtrude = {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  };
  const rightWingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrude);
  rightWingGeo.rotateX(-Math.PI / 2);
  const rightWing = new THREE.Mesh(rightWingGeo, mats.stuccoCream);
  rightWing.name = 'WingRight';
  rightWing.position.set(0, 0.62, 0.25);
  rightWing.rotation.z = 0.05;
  rightWing.castShadow = true;
  plane.add(rightWing);

  const leftWing = rightWing.clone();
  leftWing.name = 'WingLeft';
  leftWing.scale.x = -1;
  leftWing.rotation.z = -0.05;
  plane.add(leftWing);

  // Golden Winglets
  [-1, 1].forEach((side) => {
    const winglet = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.36), mats.goldAccent);
    winglet.position.set(side * 2.34, 0.86, -0.34);
    winglet.rotation.z = side * -0.25;
    winglet.castShadow = true;
    plane.add(winglet);

    const navLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      side < 0 ? mats.beaconRed : mats.beaconGreen,
    );
    navLight.position.set(side * 2.38, 0.76, -0.34);
    plane.add(navLight);
  });

  // Vertical Tail Fin
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.82, 0);
  finShape.lineTo(1.1, 0.98);
  finShape.lineTo(0.55, 0.98);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  finGeo.rotateY(Math.PI / 2);
  const tailFin = new THREE.Mesh(finGeo, mats.tealPaint);
  tailFin.name = 'TailFin';
  tailFin.position.set(-0.035, 0.86, -1.28);
  tailFin.castShadow = true;
  plane.add(tailFin);

  // Tail Gold Crown Stripe
  const tailStripe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.56), mats.goldAccent);
  tailStripe.position.set(0, 1.65, -2.06);
  plane.add(tailStripe);

  // Horizontal Stabilizer
  const hStab = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.06, 0.42), mats.stuccoCream);
  hStab.position.set(0, 0.86, -2.02);
  hStab.castShadow = true;
  plane.add(hStab);

  // Twin Wing Engines + Spinning Propellers
  [-1, 1].forEach((side, idx) => {
    const engineGroup = new THREE.Group();
    engineGroup.name = idx === 0 ? 'EngineLeft' : 'EngineRight';
    engineGroup.position.set(side * 1.05, 0.55, 0.35);

    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.78, 12), mats.terracotta);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.castShadow = true;
    engineGroup.add(nacelle);

    const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 12), mats.goldAccent);
    spinner.rotation.x = Math.PI / 2;
    spinner.position.z = 0.48;
    engineGroup.add(spinner);

    const propPivot = new THREE.Group();
    propPivot.name = idx === 0 ? 'PropellerLeft' : 'PropellerRight';
    propPivot.position.z = 0.46;

    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.02), mats.darkMetal);
      blade.rotation.z = (b / 3) * Math.PI * 2;
      blade.position.set(
        Math.cos(blade.rotation.z + Math.PI / 2) * 0.2,
        Math.sin(blade.rotation.z + Math.PI / 2) * 0.2,
        0,
      );
      propPivot.add(blade);
    }

    engineGroup.add(propPivot);
    plane.add(engineGroup);
    props.push(propPivot);
  });

  // Tricycle Landing Gear touching y = 0
  const gearPositions: Array<[number, number, number]> = [
    [0, 0.18, 1.38],
    [-0.55, 0.18, -0.15],
    [0.55, 0.18, -0.15],
  ];
  gearPositions.forEach(([gx, gy, gz], i) => {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 8), mats.chrome);
    strut.position.set(gx, gy + 0.12, gz);
    plane.add(strut);

    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.09, 12), mats.tireRubber);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(gx, 0.14, gz);
    wheel.name = `Wheel_${i}`;
    wheel.castShadow = true;
    plane.add(wheel);
  });

  return {
    group: plane,
    refs: { propellers: props, beacons: [] },
  };
}

export function buildSeaplaneModel(): {
  group: THREE.Group;
  refs: AviationAnimatedRefs;
} {
  const mats = createMaterials();
  const seaplane = new THREE.Group();
  seaplane.name = 'MegaCity_Seaplane';

  const props: THREE.Object3D[] = [];

  // Cheerful yellow fuselage
  const bodyPts = [
    new THREE.Vector2(0.0, 1.48),
    new THREE.Vector2(0.24, 1.25),
    new THREE.Vector2(0.32, 0.55),
    new THREE.Vector2(0.3, -0.35),
    new THREE.Vector2(0.14, -1.35),
    new THREE.Vector2(0.0, -1.6),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPts, 14);
  bodyGeo.rotateX(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, mats.goldAccent);
  body.name = 'SeaplaneBody';
  body.position.y = 0.78;
  body.castShadow = true;
  seaplane.add(body);

  // Cabin canopy in cream + turquoise windshield
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.36, 0.95), mats.stuccoCream);
  cabin.position.set(0, 1.0, 0.2);
  cabin.castShadow = true;
  seaplane.add(cabin);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.28, 0.36), mats.turquoiseGlass);
  windshield.position.set(0, 1.02, 0.62);
  windshield.rotation.x = -0.35;
  seaplane.add(windshield);

  // High Parasol Wing with Terracotta tip accents
  const wing = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 0.68), mats.stuccoCream);
  wing.name = 'HighWing';
  wing.position.set(0, 1.24, 0.15);
  wing.castShadow = true;
  seaplane.add(wing);

  [-1, 1].forEach((side) => {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.7), mats.terracotta);
    tip.position.set(side * 1.72, 1.24, 0.15);
    seaplane.add(tip);

    // Wing struts
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 6), mats.darkMetal);
    strut.position.set(side * 0.68, 0.96, 0.15);
    strut.rotation.z = side * -0.58;
    seaplane.add(strut);
  });

  // Twin Pontoons / Floats resting flush at y = 0
  const floatPts = [
    new THREE.Vector2(0.0, 1.28),
    new THREE.Vector2(0.13, 0.98),
    new THREE.Vector2(0.15, 0.0),
    new THREE.Vector2(0.12, -1.02),
    new THREE.Vector2(0.0, -1.16),
  ];
  const floatGeo = new THREE.LatheGeometry(floatPts, 10);
  floatGeo.rotateX(Math.PI / 2);

  [-0.58, 0.58].forEach((fx, i) => {
    const pontoon = new THREE.Mesh(floatGeo, mats.tealPaint);
    pontoon.name = `Pontoon_${i}`;
    pontoon.position.set(fx, 0.15, 0.1);
    pontoon.castShadow = true;
    seaplane.add(pontoon);

    [-0.3, 0.45].forEach((fz) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.64, 6), mats.chrome);
      leg.position.set(fx * 0.72, 0.45, fz);
      leg.rotation.z = fx > 0 ? -0.35 : 0.35;
      seaplane.add(leg);
    });
  });

  // Tail Fin & Stabilizer
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.64, 0.52), mats.terracotta);
  fin.position.set(0, 1.12, -1.3);
  fin.castShadow = true;
  seaplane.add(fin);

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.06, 0.34), mats.goldAccent);
  hStab.position.set(0, 0.88, -1.32);
  seaplane.add(hStab);

  // Nose Radial Cowling & 2-Blade Propeller
  const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.25, 14), mats.darkMetal);
  cowl.rotation.x = Math.PI / 2;
  cowl.position.set(0, 0.78, 1.44);
  seaplane.add(cowl);

  const propPivot = new THREE.Group();
  propPivot.name = 'PropellerMain';
  propPivot.position.set(0, 0.78, 1.6);

  const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 12), mats.chrome);
  noseCone.rotation.x = Math.PI / 2;
  noseCone.position.z = 0.06;
  propPivot.add(noseCone);

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.96, 0.025), mats.terracotta);
  propPivot.add(blade);

  seaplane.add(propPivot);
  props.push(propPivot);

  return {
    group: seaplane,
    refs: { propellers: props, beacons: [] },
  };
}

export function buildAirportModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: AviationAnimatedRefs;
} {
  const mats = createMaterials();
  const airport = new THREE.Group();
  airport.name = 'MegaCity_TropicalAirport';

  const beacons: THREE.Mesh[] = [];

  // 1. Grounded Runway & Apron Base Slab (18 x 0.35 x 10.5)
  const runwayTex = createRunwayCanvasTexture(maxAnisotropy);
  const topGroundMat = new THREE.MeshStandardMaterial({
    map: runwayTex,
    roughness: 0.82,
    metalness: 0.02,
  });

  const baseSlabGeo = new THREE.BoxGeometry(18, 0.36, 10.2);
  const sideMat = mats.sandBase;
  const baseSlab = new THREE.Mesh(baseSlabGeo, [
    sideMat,
    sideMat,
    topGroundMat,
    sideMat,
    sideMat,
    sideMat,
  ]);
  baseSlab.name = 'RunwayPlatform';
  baseSlab.position.y = 0.18;
  baseSlab.receiveShadow = true;
  airport.add(baseSlab);

  // 2. Tropical Terminal Building (upper-left apron)
  const terminal = new THREE.Group();
  terminal.name = 'TropicalTerminal';
  terminal.position.set(-2.5, 0.36, -3.55);

  const mainHall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.25, 2.1), mats.stuccoCream);
  mainHall.position.y = 0.625;
  mainHall.castShadow = true;
  mainHall.receiveShadow = true;
  terminal.add(mainHall);

  // Panoramic turquoise glass concourse facade
  const concourseGlass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.72, 2.16), mats.turquoiseGlass);
  concourseGlass.position.y = 0.56;
  terminal.add(concourseGlass);

  // Sweeping Terracotta Roof Canopy
  const roof = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 2.65), mats.terracotta);
  roof.position.set(0, 1.36, 0.15);
  roof.rotation.x = 0.05;
  roof.castShadow = true;
  terminal.add(roof);

  // Golden departure fascia strip
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(6.24, 0.1, 0.14), mats.goldAccent);
  fascia.position.set(0, 1.32, 1.44);
  terminal.add(fascia);

  // Boarding Gate Jetway Finger
  const gateTube = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.48, 1.25), mats.stuccoCream);
  gateTube.position.set(-1.3, 0.68, 1.45);
  gateTube.castShadow = true;
  terminal.add(gateTube);

  airport.add(terminal);

  // 3. Air Traffic Control Tower (with animated RadarDish)
  const tower = new THREE.Group();
  tower.name = 'ControlTower';
  tower.position.set(2.25, 0.36, -3.45);

  const towerBase = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.75, 1.35), mats.stuccoCream);
  towerBase.position.y = 0.375;
  towerBase.castShadow = true;
  tower.add(towerBase);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.56, 2.55, 8), mats.stuccoCream);
  shaft.position.y = 1.95;
  shaft.castShadow = true;
  tower.add(shaft);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.48, 0.32, 8), mats.tealPaint);
  collar.position.y = 3.25;
  collar.castShadow = true;
  tower.add(collar);

  const glassCab = new THREE.Mesh(
    new THREE.CylinderGeometry(0.96, 0.82, 0.66, 8),
    mats.turquoiseGlass,
  );
  glassCab.position.y = 3.72;
  glassCab.castShadow = true;
  tower.add(glassCab);

  const towerRoof = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.02, 0.18, 8), mats.terracotta);
  towerRoof.position.y = 4.14;
  towerRoof.castShadow = true;
  tower.add(towerRoof);

  const radarPivot = new THREE.Group();
  radarPivot.name = 'RadarDish';
  radarPivot.position.set(0, 4.46, 0);

  const radarMast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.45, 6), mats.darkMetal);
  radarMast.position.y = -0.12;
  radarPivot.add(radarMast);

  const radarBar = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.22, 0.14), mats.goldAccent);
  radarBar.position.y = 0.12;
  radarBar.castShadow = true;
  radarPivot.add(radarBar);

  const towerBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), mats.beaconAmber);
  towerBeacon.position.set(0, 0.32, 0);
  radarPivot.add(towerBeacon);
  beacons.push(towerBeacon);

  tower.add(radarPivot);
  airport.add(tower);

  // 4. Arched Tropical Hangar (right side)
  const hangar = new THREE.Group();
  hangar.name = 'MaintenanceHangar';
  hangar.position.set(5.4, 0.36, -3.2);

  const archShape = new THREE.Shape();
  archShape.moveTo(-1.45, 0);
  archShape.lineTo(-1.45, 0.95);
  archShape.absarc(0, 0.95, 1.45, Math.PI, 0, true);
  archShape.lineTo(1.45, 0);
  archShape.lineTo(1.18, 0);
  archShape.lineTo(1.18, 0.95);
  archShape.absarc(0, 0.95, 1.18, 0, Math.PI, false);
  archShape.lineTo(-1.18, 0);
  archShape.closePath();

  const hangarGeo = new THREE.ExtrudeGeometry(archShape, {
    depth: 2.35,
    bevelEnabled: false,
  });
  hangarGeo.translate(0, 0, -1.175);
  const hangarShell = new THREE.Mesh(hangarGeo, mats.tealPaint);
  hangarShell.castShadow = true;
  hangarShell.receiveShadow = true;
  hangar.add(hangarShell);

  const hangarBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.8, 0.12), mats.stuccoCream);
  hangarBack.position.set(0, 0.9, -1.12);
  hangar.add(hangarBack);

  const hangarTrim = new THREE.Mesh(new THREE.BoxGeometry(2.96, 0.14, 0.14), mats.goldAccent);
  hangarTrim.position.set(0, 2.38, 1.16);
  hangar.add(hangarTrim);

  airport.add(hangar);

  // 5. Fuel & Baggage Truck on Apron
  const truck = new THREE.Group();
  truck.name = 'FuelTruck';
  truck.position.set(0.65, 0.36, -1.25);
  truck.rotation.y = 0.4;

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.95), mats.goldAccent);
  chassis.position.y = 0.16;
  chassis.castShadow = true;
  truck.add(chassis);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.3), mats.terracotta);
  cab.position.set(0, 0.34, 0.28);
  cab.castShadow = true;
  truck.add(cab);

  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.56, 10), mats.stuccoCream);
  tank.rotation.x = Math.PI / 2;
  tank.position.set(0, 0.34, -0.18);
  truck.add(tank);

  airport.add(truck);

  // 6. Runway Edge Lights (instanced-friendly clean markers)
  for (let i = 0; i < 8; i++) {
    const lx = -7.2 + i * 2.05;
    [-1.45, 1.45].forEach((lz) => {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), mats.beaconAmber);
      lamp.position.set(lx, 0.42, 2.32 + lz);
      airport.add(lamp);
      beacons.push(lamp);
    });
  }

  // 7. Tropical Palm Trees around Terminal Perimeter
  const palmCoords: Array<[number, number]> = [
    [-6.6, -4.0],
    [-5.8, -2.1],
    [0.85, -4.1],
    [7.4, -4.0],
    [7.7, -2.0],
  ];
  palmCoords.forEach(([px, pz], idx) => {
    const palm = createPalmTree(mats);
    palm.position.set(px, 0.36, pz);
    palm.rotation.y = idx * 1.1;
    palm.scale.setScalar(0.95 + (idx % 3) * 0.12);
    airport.add(palm);
  });

  return {
    group: airport,
    refs: {
      radarDish: radarPivot,
      propellers: [],
      beacons,
    },
  };
}

export function buildCombinedAirportScene(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: AviationAnimatedRefs;
} {
  const root = new THREE.Group();
  root.name = 'MegaCity_AirportPack_Scene';

  const airportBuilt = buildAirportModel(maxAnisotropy);
  const planeBuilt = buildCommercialPlaneModel();
  const seaplaneBuilt = buildSeaplaneModel();

  // Scale aircraft harmoniously against the 18m runway
  planeBuilt.group.scale.setScalar(0.58);
  planeBuilt.group.position.set(-4.6, 0.36, 2.32);
  planeBuilt.group.rotation.y = Math.PI / 2;

  seaplaneBuilt.group.scale.setScalar(0.55);
  seaplaneBuilt.group.position.set(-1.35, 0.36, -1.15);
  seaplaneBuilt.group.rotation.y = 0.25;

  root.add(airportBuilt.group);
  root.add(planeBuilt.group);
  root.add(seaplaneBuilt.group);

  return {
    group: root,
    refs: {
      radarDish: airportBuilt.refs.radarDish,
      propellers: [...planeBuilt.refs.propellers, ...seaplaneBuilt.refs.propellers],
      flyingPlane: planeBuilt.group,
      seaplane: seaplaneBuilt.group,
      beacons: airportBuilt.refs.beacons,
    },
  };
}

export function measureGroupStats(group: THREE.Object3D): ModelStats {
  let meshes = 0;
  let triangles = 0;
  const materialSet = new Set<THREE.Material>();

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      meshes += 1;
      const geo = obj.geometry;
      if (geo.index) {
        triangles += geo.index.count / 3;
      } else if (geo.attributes.position) {
        triangles += geo.attributes.position.count / 3;
      }
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => materialSet.add(m));
      } else if (obj.material) {
        materialSet.add(obj.material);
      }
    }
  });

  return {
    meshes,
    triangles: Math.round(triangles),
    materials: materialSet.size,
  };
}

export function exportGroupToGlb(group: THREE.Object3D, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    // Clone cleanly at origin without scene transforms altering pivot
    const exportClone = group.clone(true);
    exportClone.position.set(0, 0, 0);
    exportClone.rotation.set(0, 0, 0);

    exporter.parse(
      exportClone,
      (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1500);
          resolve();
        } else {
          reject(new Error('Falha ao gerar arquivo binário GLB.'));
        }
      },
      (error) => reject(error),
      { binary: true },
    );
  });
}

export const GODOT4_AIRPORT_GDSCRIPT = `extends Node3D

# Arraste seu arquivo .glb importado (megacity_aeroporto.glb ou conjunto) como filho
@export var airport_scene_root: Node3D
@export var radar_speed_rad: float = 1.6
@export var prop_speed_rad: float = 28.0

var _radar_dish: Node3D
var _propellers: Array[Node3D] = []

func _ready() -> void:
\tif airport_scene_root == null:
\t\tairport_scene_root = self
\t_radar_dish = airport_scene_root.find_child("RadarDish", true, false)
\tfor prop_name in ["PropellerLeft", "PropellerRight", "PropellerMain"]:
\t\tvar node := airport_scene_root.find_child(prop_name, true, false)
\t\tif node is Node3D:
\t\t\t_propellers.append(node)

func _process(delta: float) -> void:
\tif _radar_dish:
\t\t_radar_dish.rotate_y(radar_speed_rad * delta)
\tfor prop in _propellers:
\t\tprop.rotate_z(prop_speed_rad * delta)
`;
