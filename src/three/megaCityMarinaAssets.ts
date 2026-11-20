import * as THREE from 'three';

export type MarinaAssetId = 'marina_combined' | 'marina_dock' | 'boat_small' | 'boat_large';

export interface MarinaAnimatedRefs {
  radarDish?: THREE.Object3D;
  propellers: THREE.Object3D[];
  bobbingBoats: Array<{
    obj: THREE.Object3D;
    baseY: number;
    phase: number;
    amp: number;
  }>;
  cruisingTrawler?: THREE.Object3D;
}

function createWoodDockTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#B9834E';
    ctx.fillRect(0, 0, 512, 512);

    const plankH = 32;
    for (let y = 0; y < 512; y += plankH) {
      const shade = (y / plankH) % 3 === 0 ? '#C6905A' : (y / plankH) % 2 === 0 ? '#AD7744' : '#B9834E';
      ctx.fillStyle = shade;
      ctx.fillRect(0, y, 512, plankH - 2);
      ctx.fillStyle = '#754C24';
      ctx.fillRect(0, y + plankH - 2, 512, 2);

      // Plank seams & nail heads
      const seamX = ((y * 7) % 380) + 64;
      ctx.fillRect(seamX, y, 2, plankH);
      ctx.fillStyle = '#523418';
      ctx.fillRect(seamX - 8, y + 7, 3, 3);
      ctx.fillRect(seamX - 8, y + 20, 3, 3);
      ctx.fillRect(seamX + 7, y + 7, 3, 3);
      ctx.fillRect(seamX + 7, y + 20, 3, 3);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createQuayStoneTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D6D3CD';
    ctx.fillRect(0, 0, 512, 512);
    const step = 64;
    for (let y = 0; y < 512; y += step) {
      const offset = (y / step) % 2 === 0 ? 0 : step / 2;
      for (let x = -step; x < 512; x += step) {
        ctx.fillStyle = (x + y) % 128 === 0 ? '#CCC7BE' : '#DFDCD5';
        ctx.fillRect(x + offset + 2, y + 2, step - 4, step - 4);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createMarinaMaterials(maxAnisotropy = 4) {
  const woodTex = createWoodDockTexture(maxAnisotropy);
  const stoneTex = createQuayStoneTexture(maxAnisotropy);

  return {
    woodPlank: new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.82,
      metalness: 0.02,
    }),
    stoneQuay: new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.88,
      metalness: 0.02,
    }),
    sandShore: new THREE.MeshStandardMaterial({
      color: 0xf5d78e,
      roughness: 0.92,
      metalness: 0.0,
    }),
    timberDark: new THREE.MeshStandardMaterial({
      color: 0x6b4423,
      roughness: 0.86,
      metalness: 0.0,
    }),
    stuccoCream: new THREE.MeshStandardMaterial({
      color: 0xfbf7ee,
      roughness: 0.76,
      metalness: 0.02,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xd95b38,
      roughness: 0.58,
      metalness: 0.05,
    }),
    tealPaint: new THREE.MeshStandardMaterial({
      color: 0x0b7a8f,
      roughness: 0.4,
      metalness: 0.22,
    }),
    caribbeanCyan: new THREE.MeshStandardMaterial({
      color: 0x12b5cb,
      roughness: 0.35,
      metalness: 0.18,
    }),
    goldAccent: new THREE.MeshStandardMaterial({
      color: 0xf8b824,
      roughness: 0.32,
      metalness: 0.6,
    }),
    navyHull: new THREE.MeshStandardMaterial({
      color: 0x0e2c48,
      roughness: 0.42,
      metalness: 0.25,
    }),
    glassCabin: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.75,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xe5a93c,
      roughness: 0.25,
      metalness: 0.88,
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
    netRope: new THREE.MeshStandardMaterial({
      color: 0xc8a97e,
      roughness: 0.95,
      metalness: 0.0,
    }),
    beaconAmber: new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xff9f1c,
      emissiveIntensity: 1.4,
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
    beaconGreen: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.1,
    }),
  };
}

function createPalmTree(mats: ReturnType<typeof createMarinaMaterials>): THREE.Group {
  const tree = new THREE.Group();
  tree.name = 'PalmTree';
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.08, 0.55, 0.04),
    new THREE.Vector3(0.14, 1.15, 0.02),
  ]);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.08, 6, false), mats.palmTrunk);
  trunk.castShadow = true;
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

/**
 * Small tropical fishing boat (Jangada / Lancha Pesqueira) — ~2.8m long, waterline pivot at y = 0.
 */
export function buildSmallFishingBoatModel(
  hullVariant: 'teal' | 'gold' | 'coral' = 'teal',
  maxAnisotropy = 4,
): { group: THREE.Group; refs: MarinaAnimatedRefs } {
  const mats = createMarinaMaterials(maxAnisotropy);
  const boat = new THREE.Group();
  boat.name = `MegaCity_SmallFishingBoat_${hullVariant}`;

  const hullMat =
    hullVariant === 'gold'
      ? mats.goldAccent
      : hullVariant === 'coral'
        ? mats.terracotta
        : mats.tealPaint;

  // Sculpted boat hull profile via ExtrudeGeometry (X-Z plan view extruded upward, bow at +Z)
  const hullShape = new THREE.Shape();
  hullShape.moveTo(0, -1.42);
  hullShape.quadraticCurveTo(-0.56, -0.85, -0.54, 0.15);
  hullShape.lineTo(-0.46, 1.25);
  hullShape.lineTo(0.46, 1.25);
  hullShape.lineTo(0.54, 0.15);
  hullShape.quadraticCurveTo(0.56, -0.85, 0, -1.42);

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.48,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  hullGeo.rotateX(-Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.name = 'HullBody';
  hull.position.y = -0.12;
  hull.castShadow = true;
  hull.receiveShadow = true;
  boat.add(hull);

  // Cream gunwale cap rim + wooden inner deck
  const deckGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.05,
    bevelEnabled: false,
  });
  deckGeo.rotateX(-Math.PI / 2);
  const deck = new THREE.Mesh(deckGeo, mats.woodPlank);
  deck.scale.set(0.84, 1, 0.88);
  deck.position.y = 0.36;
  deck.receiveShadow = true;
  boat.add(deck);

  // Wooden thwart benches
  [-0.52, 0.15, 0.65].forEach((bz) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.22), mats.timberDark);
    bench.position.set(0, 0.42, bz);
    bench.castShadow = true;
    boat.add(bench);
  });

  // Sun canopy frame (Bimini top)
  const canopyPosts: Array<[number, number]> = [
    [-0.4, -0.45],
    [0.4, -0.45],
    [-0.4, 0.25],
    [0.4, 0.25],
  ];
  canopyPosts.forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.72, 6), mats.darkMetal);
    post.position.set(px, 0.76, pz);
    boat.add(post);
  });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.88), mats.stuccoCream);
  awning.position.set(0, 1.12, -0.1);
  awning.castShadow = true;
  boat.add(awning);

  const awningTrim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.04, 0.16), mats.terracotta);
  awningTrim.position.set(0, 1.12, 0.32);
  boat.add(awningTrim);

  // Coiled fishing net & fish crate on bow
  const netBasket = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.2, 10), mats.netRope);
  netBasket.position.set(0, 0.48, 0.85);
  netBasket.castShadow = true;
  boat.add(netBasket);

  const fishCrate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.26), mats.goldAccent);
  fishCrate.position.set(-0.18, 0.48, -0.22);
  fishCrate.rotation.y = 0.25;
  fishCrate.castShadow = true;
  boat.add(fishCrate);

  // Outboard motor & tiny spinning propeller
  const motorGroup = new THREE.Group();
  motorGroup.name = 'OutboardMotor';
  motorGroup.position.set(0, 0.38, -1.32);

  const motorHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.26), mats.darkMetal);
  motorHead.position.y = 0.18;
  motorHead.castShadow = true;
  motorGroup.add(motorHead);

  const motorShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.48, 8), mats.darkMetal);
  motorShaft.position.y = -0.15;
  motorGroup.add(motorShaft);

  const propSmall = new THREE.Group();
  propSmall.name = 'PropellerSmall';
  propSmall.position.set(0, -0.35, -0.06);
  const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.015), mats.brass);
  const b2 = b1.clone();
  b2.rotation.z = Math.PI / 2;
  propSmall.add(b1, b2);
  motorGroup.add(propSmall);

  boat.add(motorGroup);

  return {
    group: boat,
    refs: {
      propellers: [propSmall],
      bobbingBoats: [],
    },
  };
}

/**
 * Large ocean fishing trawler (Traineira Pesqueira Grande) — ~6.4m long, waterline pivot at y = 0.
 */
export function buildLargeFishingTrawlerModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: MarinaAnimatedRefs;
} {
  const mats = createMarinaMaterials(maxAnisotropy);
  const trawler = new THREE.Group();
  trawler.name = 'MegaCity_LargeFishingTrawler';

  // Sculpted ocean trawler hull (bow at +Z after rotateX(-PI/2), stern at -Z)
  const hullShape = new THREE.Shape();
  hullShape.moveTo(0, -3.25);
  hullShape.quadraticCurveTo(-1.12, -2.0, -1.15, -0.1);
  hullShape.lineTo(-1.06, 2.85);
  hullShape.lineTo(1.06, 2.85);
  hullShape.lineTo(1.15, -0.1);
  hullShape.quadraticCurveTo(1.12, -2.0, 0, -3.25);

  // Lower terracotta anti-fouling hull
  const lowerHullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  lowerHullGeo.rotateX(-Math.PI / 2);
  const lowerHull = new THREE.Mesh(lowerHullGeo, mats.terracotta);
  lowerHull.position.y = -0.45;
  lowerHull.castShadow = true;
  trawler.add(lowerHull);

  // Upper deep-teal freeboard hull
  const upperHullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 0.68,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  upperHullGeo.rotateX(-Math.PI / 2);
  const upperHull = new THREE.Mesh(upperHullGeo, mats.navyHull);
  upperHull.name = 'TrawlerHull';
  upperHull.position.y = -0.02;
  upperHull.castShadow = true;
  upperHull.receiveShadow = true;
  trawler.add(upperHull);

  // Wooden working deck
  const deckGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 0.06, bevelEnabled: false });
  deckGeo.rotateX(-Math.PI / 2);
  const deck = new THREE.Mesh(deckGeo, mats.woodPlank);
  deck.scale.set(0.88, 1, 0.92);
  deck.position.y = 0.66;
  deck.receiveShadow = true;
  trawler.add(deck);

  // Bow forecastle raised deck
  const bowRaise = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.34, 1.55), mats.stuccoCream);
  bowRaise.position.set(0, 0.85, 1.75);
  bowRaise.castShadow = true;
  trawler.add(bowRaise);

  // Multi-level Bridge / Wheelhouse Cabin
  const cabinGroup = new THREE.Group();
  cabinGroup.name = 'BridgeCabin';
  cabinGroup.position.set(0, 0.7, 0.72);

  const lowerCabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.9, 1.55), mats.stuccoCream);
  lowerCabin.position.y = 0.45;
  lowerCabin.castShadow = true;
  cabinGroup.add(lowerCabin);

  const wheelhouse = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.72, 1.15), mats.stuccoCream);
  wheelhouse.position.set(0, 1.26, 0.06);
  wheelhouse.castShadow = true;
  cabinGroup.add(wheelhouse);

  const bridgeWindows = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.34, 1.2), mats.glassCabin);
  bridgeWindows.position.set(0, 1.32, 0.08);
  cabinGroup.add(bridgeWindows);

  const wheelhouseRoof = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.12, 1.32), mats.goldAccent);
  wheelhouseRoof.position.set(0, 1.66, 0.06);
  wheelhouseRoof.castShadow = true;
  cabinGroup.add(wheelhouseRoof);

  // Smokestack & Mast + Radar
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.75, 10), mats.terracotta);
  stack.position.set(0, 1.15, -0.82);
  stack.castShadow = true;
  cabinGroup.add(stack);

  const stackCap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 10), mats.darkMetal);
  stackCap.position.set(0, 1.54, -0.82);
  cabinGroup.add(stackCap);

  const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.15, 8), mats.darkMetal);
  mastPole.position.set(0, 2.24, 0.05);
  cabinGroup.add(mastPole);

  const radarPivot = new THREE.Group();
  radarPivot.name = 'TrawlerRadar';
  radarPivot.position.set(0, 2.75, 0.05);
  const radarBar = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.1, 0.1), mats.goldAccent);
  radarPivot.add(radarBar);
  cabinGroup.add(radarPivot);

  // Navigation lights & life rings
  [-0.78, 0.78].forEach((lx) => {
    const nav = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      lx < 0 ? mats.beaconRed : mats.beaconGreen,
    );
    nav.position.set(lx, 1.48, 0.35);
    cabinGroup.add(nav);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 14), mats.terracotta);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(lx, 0.55, -0.15);
    cabinGroup.add(ring);
  });

  trawler.add(cabinGroup);

  // Stern A-Frame Trawling Gantry & Fishing Net Reel
  const gantry = new THREE.Group();
  gantry.name = 'TrawlGantry';
  gantry.position.set(0, 0.68, -2.15);

  [-0.85, 0.85].forEach((gx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 1.85, 8), mats.goldAccent);
    leg.position.set(gx, 0.9, -0.15);
    leg.rotation.x = -0.22;
    leg.castShadow = true;
    gantry.add(leg);
  });
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.85, 8), mats.goldAccent);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, 1.78, -0.35);
  crossbar.castShadow = true;
  gantry.add(crossbar);

  const netDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.15, 12), mats.netRope);
  netDrum.rotation.z = Math.PI / 2;
  netDrum.position.set(0, 0.42, 0.55);
  netDrum.castShadow = true;
  gantry.add(netDrum);

  trawler.add(gantry);

  // Stacked Fish Crates on Working Deck
  const cratePositions: Array<[number, number, number]> = [
    [-0.45, 0.84, -0.75],
    [-0.45, 1.12, -0.75],
    [0.48, 0.84, -0.95],
    [0.42, 0.84, -1.35],
  ];
  cratePositions.forEach(([cx, cy, cz], idx) => {
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.26, 0.34),
      idx % 2 === 0 ? mats.caribbeanCyan : mats.goldAccent,
    );
    crate.position.set(cx, cy, cz);
    crate.rotation.y = idx * 0.25;
    crate.castShadow = true;
    trawler.add(crate);
  });

  // Submerged Brass Propeller
  const propMain = new THREE.Group();
  propMain.name = 'PropellerMain';
  propMain.position.set(0, -0.24, -2.95);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.02), mats.brass);
    blade.rotation.z = (i / 3) * Math.PI * 2;
    propMain.add(blade);
  }
  trawler.add(propMain);

  return {
    group: trawler,
    refs: {
      radarDish: radarPivot,
      propellers: [propMain],
      bobbingBoats: [],
    },
  };
}

/**
 * Marina de Pesca Structure (Quay, wooden boardwalk, 3 finger piers, Fish Market, Harbor Crane, Lighthouse)
 */
export function buildMarinaDockModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: MarinaAnimatedRefs;
} {
  const mats = createMarinaMaterials(maxAnisotropy);
  const marina = new THREE.Group();
  marina.name = 'MegaCity_FishingMarina';

  // 1. Coastal Quay & Sandy Promenade (along back edge Z = -4.2)
  const shoreBase = new THREE.Mesh(new THREE.BoxGeometry(19.5, 0.9, 4.4), mats.sandShore);
  shoreBase.name = 'SandyShoreline';
  shoreBase.position.set(0, 0.15, -4.6);
  shoreBase.receiveShadow = true;
  marina.add(shoreBase);

  const stoneQuay = new THREE.Mesh(new THREE.BoxGeometry(18.6, 0.72, 3.3), mats.stoneQuay);
  stoneQuay.name = 'StoneQuay';
  stoneQuay.position.set(0, 0.42, -3.95);
  stoneQuay.castShadow = true;
  stoneQuay.receiveShadow = true;
  marina.add(stoneQuay);

  // 2. Main Wooden Boardwalk & 3 Extending Finger Piers
  const boardwalk = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.18, 1.65), mats.woodPlank);
  boardwalk.name = 'MainBoardwalk';
  boardwalk.position.set(0, 0.78, -1.65);
  boardwalk.castShadow = true;
  boardwalk.receiveShadow = true;
  marina.add(boardwalk);

  const pierPositionsX = [-6.2, -0.8, 5.4];
  const pierLengths = [5.2, 5.6, 6.4];
  const pierWidths = [1.2, 1.25, 1.65];

  pierPositionsX.forEach((px, idx) => {
    const len = pierLengths[idx];
    const wid = pierWidths[idx];
    const pier = new THREE.Mesh(new THREE.BoxGeometry(wid, 0.16, len), mats.woodPlank);
    pier.name = `FingerPier_${idx + 1}`;
    pier.position.set(px, 0.76, -0.82 + len / 2);
    pier.castShadow = true;
    pier.receiveShadow = true;
    marina.add(pier);

    // Timber pilings supporting pier into the water
    for (let z = 0.2; z <= len - 0.3; z += 1.65) {
      [-wid * 0.44, wid * 0.44].forEach((ox) => {
        const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 1.65, 8), mats.timberDark);
        piling.position.set(px + ox, 0.12, -0.82 + z);
        piling.castShadow = true;
        marina.add(piling);
      });
    }

    // Mooring bollards + warm pier lantern at tip
    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.25, 8), mats.darkMetal);
    bollard.position.set(px, 0.96, -0.82 + len - 0.35);
    marina.add(bollard);

    const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.15, 6), mats.darkMetal);
    lampPost.position.set(px + wid * 0.36, 1.38, -0.82 + len - 0.22);
    marina.add(lampPost);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), mats.beaconAmber);
    lantern.position.set(px + wid * 0.36, 1.98, -0.82 + len - 0.22);
    marina.add(lantern);
  });

  // 3. Fish Market & Co-op Pavilion (on quay left-center)
  const market = new THREE.Group();
  market.name = 'FishMarketPavilion';
  market.position.set(-3.4, 0.78, -3.75);

  const marketBody = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.35, 2.2), mats.stuccoCream);
  marketBody.position.y = 0.675;
  marketBody.castShadow = true;
  marketBody.receiveShadow = true;
  market.add(marketBody);

  const marketRoof = new THREE.Mesh(new THREE.ConeGeometry(3.1, 0.95, 4), mats.terracotta);
  marketRoof.rotation.y = Math.PI / 4;
  marketRoof.scale.set(1.35, 1, 0.78);
  marketRoof.position.y = 1.82;
  marketRoof.castShadow = true;
  market.add(marketRoof);

  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 0.85), mats.caribbeanCyan);
  awning.position.set(0, 1.18, 1.42);
  awning.rotation.x = 0.22;
  awning.castShadow = true;
  market.add(awning);

  // Market fish crates & barrels outside
  [-1.4, -0.9, 1.1, 1.55].forEach((cx, i) => {
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.32, 0.36),
      i % 2 === 0 ? mats.goldAccent : mats.tealPaint,
    );
    crate.position.set(cx, 0.16, 1.35);
    crate.castShadow = true;
    market.add(crate);
  });

  marina.add(market);

  // 4. Harbor Unloading Crane (right pier head for large trawler)
  const crane = new THREE.Group();
  crane.name = 'HarborUnloadingCrane';
  crane.position.set(5.4, 0.84, 3.6);

  const craneBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.45, 8), mats.darkMetal);
  craneBase.position.y = 0.22;
  craneBase.castShadow = true;
  crane.add(craneBase);

  const craneMast = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.6, 0.28), mats.goldAccent);
  craneMast.position.y = 1.5;
  craneMast.castShadow = true;
  crane.add(craneMast);

  const craneBoom = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 2.35), mats.goldAccent);
  craneBoom.position.set(0.45, 2.68, 0.45);
  craneBoom.rotation.y = 0.55;
  craneBoom.rotation.x = -0.2;
  craneBoom.castShadow = true;
  crane.add(craneBoom);

  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), mats.darkMetal);
  cable.position.set(1.02, 2.15, 1.28);
  crane.add(cable);

  marina.add(crane);

  // 5. Coastal Harbor Lighthouse (far left quay)
  const lighthouse = new THREE.Group();
  lighthouse.name = 'HarborLighthouse';
  lighthouse.position.set(-7.8, 0.78, -3.55);

  const lhBase = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, 1.1, 10), mats.stuccoCream);
  lhBase.position.y = 0.55;
  lhBase.castShadow = true;
  lighthouse.add(lhBase);

  const lhMid = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.68, 1.2, 10), mats.terracotta);
  lhMid.position.y = 1.7;
  lhMid.castShadow = true;
  lighthouse.add(lhMid);

  const lhTop = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.54, 0.9, 10), mats.stuccoCream);
  lhTop.position.y = 2.75;
  lhTop.castShadow = true;
  lighthouse.add(lhTop);

  const lhLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.48, 8), mats.beaconAmber);
  lhLantern.position.y = 3.42;
  lighthouse.add(lhLantern);

  const lhDome = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.46, 10), mats.terracotta);
  lhDome.position.y = 3.88;
  lhDome.castShadow = true;
  lighthouse.add(lhDome);

  marina.add(lighthouse);

  // 6. Tropical Palm Trees along Quay
  const palmPositions: Array<[number, number]> = [
    [-8.6, -4.4],
    [0.6, -4.4],
    [3.4, -4.2],
    [8.2, -4.2],
  ];
  palmPositions.forEach(([px, pz], i) => {
    const palm = createPalmTree(mats);
    palm.position.set(px, 0.78, pz);
    palm.rotation.y = i * 1.3;
    palm.scale.setScalar(1.0 + (i % 2) * 0.14);
    marina.add(palm);
  });

  return {
    group: marina,
    refs: {
      propellers: [],
      bobbingBoats: [],
    },
  };
}

/**
 * Combined Fishing Marina Scene with 3 Small Fishing Boats + 2 Large Fishing Trawlers
 */
export function buildCombinedMarinaScene(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: MarinaAnimatedRefs;
} {
  const root = new THREE.Group();
  root.name = 'MegaCity_FishingMarinaPack_Scene';

  const marinaBuilt = buildMarinaDockModel(maxAnisotropy);
  root.add(marinaBuilt.group);

  const propellers: THREE.Object3D[] = [];
  const bobbingBoats: MarinaAnimatedRefs['bobbingBoats'] = [];

  // 3 Small Fishing Boats moored alongside the inner piers
  const small1 = buildSmallFishingBoatModel('teal', maxAnisotropy);
  small1.group.position.set(-4.35, 0.0, 1.35);
  small1.group.rotation.y = 0.05;
  root.add(small1.group);
  propellers.push(...small1.refs.propellers);
  bobbingBoats.push({ obj: small1.group, baseY: 0.0, phase: 0.2, amp: 0.055 });

  const small2 = buildSmallFishingBoatModel('gold', maxAnisotropy);
  small2.group.position.set(-2.55, 0.0, 2.25);
  small2.group.rotation.y = Math.PI - 0.08;
  root.add(small2.group);
  propellers.push(...small2.refs.propellers);
  bobbingBoats.push({ obj: small2.group, baseY: 0.0, phase: 1.7, amp: 0.05 });

  const small3 = buildSmallFishingBoatModel('coral', maxAnisotropy);
  small3.group.position.set(1.15, 0.0, 1.65);
  small3.group.rotation.y = 0.12;
  root.add(small3.group);
  propellers.push(...small3.refs.propellers);
  bobbingBoats.push({ obj: small3.group, baseY: 0.0, phase: 3.1, amp: 0.06 });

  // Large Trawler #1 moored next to unloading crane at Pier 3
  const trawlerMoored = buildLargeFishingTrawlerModel(maxAnisotropy);
  trawlerMoored.group.scale.setScalar(0.88);
  trawlerMoored.group.position.set(7.75, 0.0, 2.35);
  trawlerMoored.group.rotation.y = Math.PI;
  root.add(trawlerMoored.group);
  propellers.push(...trawlerMoored.refs.propellers);
  bobbingBoats.push({ obj: trawlerMoored.group, baseY: 0.0, phase: 0.8, amp: 0.035 });

  // Large Trawler #2 cruising smoothly across the bay in front of the marina
  const trawlerCruising = buildLargeFishingTrawlerModel(maxAnisotropy);
  trawlerCruising.group.scale.setScalar(0.92);
  trawlerCruising.group.position.set(-4.5, 0.0, 7.6);
  trawlerCruising.group.rotation.y = Math.PI / 2;
  root.add(trawlerCruising.group);
  propellers.push(...trawlerCruising.refs.propellers);

  return {
    group: root,
    refs: {
      radarDish: trawlerCruising.refs.radarDish,
      propellers,
      bobbingBoats,
      cruisingTrawler: trawlerCruising.group,
    },
  };
}

export const GODOT4_MARINA_GDSCRIPT = `extends Node3D

# Arraste megacity_marina_pesca.glb ou qualquer barco .glb como filho deste nó
@export var marina_root: Node3D
@export var wave_height: float = 0.05
@export var wave_speed: float = 2.0

var _boats: Array[Node3D] = []
var _props: Array[Node3D] = []
var _time: float = 0.0

func _ready() -> void:
\tif marina_root == null:
\t\tmarina_root = self
\t_collect_nodes(marina_root)

func _collect_nodes(node: Node) -> void:
\tfor child in node.get_children():
\t\tif child is Node3D:
\t\t\tif child.name.begins_with("MegaCity_SmallFishingBoat") or child.name.begins_with("MegaCity_LargeFishingTrawler"):
\t\t\t\t_boats.append(child)
\t\t\telif child.name.begins_with("Propeller"):
\t\t\t\t_props.append(child)
\t\t_collect_nodes(child)

func _process(delta: float) -> void:
\t_time += delta
\tfor i in _boats.size():
\t\tvar boat := _boats[i]
\t\tboat.position.y = sin(_time * wave_speed + float(i)) * wave_height
\t\tboat.rotation.z = cos(_time * (wave_speed * 0.8) + float(i)) * 0.03
\tfor prop in _props:
\t\tprop.rotate_z(18.0 * delta)
`;
