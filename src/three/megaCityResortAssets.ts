import * as THREE from 'three';

export type ResortAssetId =
  | 'resort_combined'
  | 'resort_hotel'
  | 'resort_pool'
  | 'resort_bungalow';

export interface ResortAnimatedRefs {
  poolFloats: Array<{ obj: THREE.Object3D; baseY: number; phase: number }>;
  vipBoat?: THREE.Object3D;
  fountainRings: THREE.Object3D[];
}

function createPoolTileTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#14B8CE';
    ctx.fillRect(0, 0, 512, 512);

    const step = 32;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const alt = ((x / step + y / step) % 2) === 0;
        ctx.fillStyle = alt ? '#18C4DB' : '#10A4B8';
        ctx.fillRect(x + 2, y + 2, step - 4, step - 4);
      }
    }

    // Subtle sunlit caustic wave bands
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    for (let y = 40; y < 512; y += 96) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(150, y - 24, 340, y + 24, 512, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createDeckWoodTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#D4A36A';
    ctx.fillRect(0, 0, 512, 512);
    const h = 32;
    for (let y = 0; y < 512; y += h) {
      ctx.fillStyle = (y / h) % 2 === 0 ? '#DCAD74' : '#CA975C';
      ctx.fillRect(0, y, 512, h - 2);
      ctx.fillStyle = '#9C6D3B';
      ctx.fillRect(0, y + h - 2, 512, 2);
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

function createResortSignTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0B1E33';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#F8B824';
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = '#F8B824';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PALACE RESORT', 256, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createResortMaterials(maxAnisotropy = 4) {
  const poolTileTex = createPoolTileTexture(maxAnisotropy);
  const deckWoodTex = createDeckWoodTexture(maxAnisotropy);
  const signTex = createResortSignTexture(maxAnisotropy);

  return {
    sandBase: new THREE.MeshStandardMaterial({
      color: 0xf5d78e,
      roughness: 0.92,
      metalness: 0.0,
    }),
    stoneTerrace: new THREE.MeshStandardMaterial({
      color: 0xe6e1d6,
      roughness: 0.84,
      metalness: 0.02,
    }),
    woodDeck: new THREE.MeshStandardMaterial({
      map: deckWoodTex,
      roughness: 0.78,
      metalness: 0.02,
    }),
    timberDark: new THREE.MeshStandardMaterial({
      color: 0x734924,
      roughness: 0.85,
      metalness: 0.0,
    }),
    stuccoCream: new THREE.MeshStandardMaterial({
      color: 0xfcf8ef,
      roughness: 0.74,
      metalness: 0.02,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xd95b38,
      roughness: 0.56,
      metalness: 0.04,
    }),
    coralAccent: new THREE.MeshStandardMaterial({
      color: 0xf97360,
      roughness: 0.48,
      metalness: 0.06,
    }),
    tealPaint: new THREE.MeshStandardMaterial({
      color: 0x0b7a8f,
      roughness: 0.38,
      metalness: 0.2,
    }),
    goldAccent: new THREE.MeshStandardMaterial({
      color: 0xf8b824,
      roughness: 0.3,
      metalness: 0.58,
    }),
    glassWindow: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    }),
    poolWater: new THREE.MeshPhysicalMaterial({
      map: poolTileTex,
      color: 0x38e2f5,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    whitePaint: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.08,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.42,
      metalness: 0.75,
    }),
    palmTrunk: new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.88,
      metalness: 0.0,
    }),
    palmLeaf: new THREE.MeshStandardMaterial({
      color: 0x2e9e47,
      roughness: 0.64,
      metalness: 0.0,
    }),
    warmLantern: new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffb703,
      emissiveIntensity: 1.3,
      roughness: 0.25,
      metalness: 0.1,
    }),
    signMat: new THREE.MeshStandardMaterial({
      map: signTex,
      emissive: 0xffffff,
      emissiveMap: signTex,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.1,
    }),
  };
}

function createPalmTree(mats: ReturnType<typeof createResortMaterials>): THREE.Group {
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

function createUmbrellaAndLounger(
  mats: ReturnType<typeof createResortMaterials>,
  umbrellaMat: THREE.Material,
): THREE.Group {
  const set = new THREE.Group();

  // Lounge chair
  const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 1.05), mats.whitePaint);
  lounger.position.set(0.38, 0.12, 0);
  lounger.castShadow = true;
  set.add(lounger);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.42), mats.tealPaint);
  backrest.position.set(0.38, 0.24, -0.35);
  backrest.rotation.x = 0.55;
  set.add(backrest);

  // Parasol pole & canopy
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.25, 6), mats.timberDark);
  pole.position.set(-0.2, 0.62, 0);
  set.add(pole);

  const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.34, 8), umbrellaMat);
  canopy.position.set(-0.2, 1.28, 0);
  canopy.castShadow = true;
  set.add(canopy);

  return set;
}

/**
 * 1. Hotel Principal Resort ("Palace Resort")
 */
export function buildResortHotelModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: ResortAnimatedRefs;
} {
  const mats = createResortMaterials(maxAnisotropy);
  const hotel = new THREE.Group();
  hotel.name = 'MegaCity_ResortHotel';

  // Stone podium plinth (y = 0)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.32, 5.4), mats.stoneTerrace);
  plinth.position.y = 0.16;
  plinth.receiveShadow = true;
  hotel.add(plinth);

  // Main Ground & Upper Hotel Wing (4 stepped levels)
  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(9.4, 2.75, 3.6), mats.stuccoCream);
  mainBody.position.set(0, 1.68, -0.25);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  hotel.add(mainBody);

  // Central Penthouse Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.55, 3.2), mats.stuccoCream);
  tower.position.set(0, 3.82, -0.3);
  tower.castShadow = true;
  hotel.add(tower);

  // Terracotta Pitched Roofs (Side wings + Penthouse crown)
  [-3.3, 3.3].forEach((wx) => {
    const wingRoof = new THREE.Mesh(new THREE.ConeGeometry(2.15, 0.72, 4), mats.terracotta);
    wingRoof.rotation.y = Math.PI / 4;
    wingRoof.scale.set(1.0, 1, 1.35);
    wingRoof.position.set(wx, 3.4, -0.25);
    wingRoof.castShadow = true;
    hotel.add(wingRoof);
  });

  const crownRoof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 0.95, 4), mats.terracotta);
  crownRoof.rotation.y = Math.PI / 4;
  crownRoof.scale.set(1.1, 1, 0.85);
  crownRoof.position.set(0, 5.05, -0.3);
  crownRoof.castShadow = true;
  hotel.add(crownRoof);

  // Illuminated Resort Sign on Penthouse Facade
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.65, 0.14), mats.signMat);
  signBoard.position.set(0, 4.18, 1.34);
  hotel.add(signBoard);

  // Recessed Turquoise Balcony Windows & Gold Railings (3 floors x 5 bays)
  for (let floor = 0; floor < 3; floor++) {
    const fy = 0.85 + floor * 0.85;
    for (let bay = -2; bay <= 2; bay++) {
      const bx = bay * 1.75;
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.56, 0.12), mats.glassWindow);
      win.position.set(bx, fy, 1.54);
      hotel.add(win);

      if (floor > 0) {
        const balconySlab = new THREE.Mesh(
          new THREE.BoxGeometry(1.38, 0.1, 0.42),
          mats.stuccoCream,
        );
        balconySlab.position.set(bx, fy - 0.3, 1.72);
        balconySlab.castShadow = true;
        hotel.add(balconySlab);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.18, 0.05), mats.goldAccent);
        rail.position.set(bx, fy - 0.16, 1.9);
        hotel.add(rail);
      }
    }
  }

  // Grand Entrance Porte-Cochere Canopy & Red Carpet Steps
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 1.55), mats.tealPaint);
  canopy.position.set(0, 1.32, 2.15);
  canopy.castShadow = true;
  hotel.add(canopy);

  const canopyTrim = new THREE.Mesh(new THREE.BoxGeometry(3.46, 0.08, 1.6), mats.goldAccent);
  canopyTrim.position.set(0, 1.42, 2.15);
  hotel.add(canopyTrim);

  [-1.35, 1.35].forEach((px) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.0, 10), mats.goldAccent);
    col.position.set(px, 0.82, 2.68);
    col.castShadow = true;
    hotel.add(col);
  });

  const carpet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 1.45), mats.terracotta);
  carpet.position.set(0, 0.33, 2.08);
  hotel.add(carpet);

  // Entrance Palms
  [-4.4, 4.4].forEach((px, i) => {
    const palm = createPalmTree(mats);
    palm.position.set(px, 0.32, 2.15);
    palm.rotation.y = i * 1.7;
    hotel.add(palm);
  });

  return {
    group: hotel,
    refs: { poolFloats: [], fountainRings: [] },
  };
}

/**
 * 2. Piscina Resort, Toboágua & Bar Tiki
 */
export function buildResortPoolModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: ResortAnimatedRefs;
} {
  const mats = createResortMaterials(maxAnisotropy);
  const poolGroup = new THREE.Group();
  poolGroup.name = 'MegaCity_ResortPoolArea';

  const poolFloats: ResortAnimatedRefs['poolFloats'] = [];
  const fountainRings: THREE.Object3D[] = [];

  // Wooden Pool Sun Deck Platform (10.8 x 0.28 x 7.4)
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.28, 7.4), mats.woodDeck);
  deck.name = 'PoolSunDeck';
  deck.position.y = 0.14;
  deck.receiveShadow = true;
  poolGroup.add(deck);

  // Raised Lagoon Pool Rim & Turquoise Water Surface
  const poolBorder = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.22, 4.5), mats.stoneTerrace);
  poolBorder.position.set(-0.6, 0.36, 0.2);
  poolBorder.receiveShadow = true;
  poolGroup.add(poolBorder);

  const waterSurface = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.24, 3.9), mats.poolWater);
  waterSurface.name = 'PoolWaterSurface';
  waterSurface.position.set(-0.6, 0.37, 0.2);
  waterSurface.receiveShadow = true;
  poolGroup.add(waterSurface);

  // Animated Pool Floats (Pink Flamingo Ring & Golden Donut)
  const float1 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.12, 10, 18), mats.coralAccent);
  float1.rotation.x = Math.PI / 2;
  float1.position.set(-1.6, 0.52, 0.6);
  float1.castShadow = true;
  poolGroup.add(float1);
  poolFloats.push({ obj: float1, baseY: 0.52, phase: 0.4 });

  const float2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.1, 10, 18), mats.goldAccent);
  float2.rotation.x = Math.PI / 2;
  float2.position.set(0.6, 0.52, -0.45);
  float2.castShadow = true;
  poolGroup.add(float2);
  poolFloats.push({ obj: float2, baseY: 0.52, phase: 2.1 });

  // Curved Water Slide into Pool
  const slideCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.8, 1.85, -1.6),
    new THREE.Vector3(-3.3, 1.45, -0.9),
    new THREE.Vector3(-2.6, 0.85, -0.3),
    new THREE.Vector3(-2.1, 0.48, 0.05),
  ]);
  const slideTube = new THREE.Mesh(
    new THREE.TubeGeometry(slideCurve, 16, 0.24, 8, false),
    mats.goldAccent,
  );
  slideTube.name = 'WaterSlide';
  slideTube.castShadow = true;
  poolGroup.add(slideTube);

  const slideTower = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.65, 0.65), mats.timberDark);
  slideTower.position.set(-3.8, 1.1, -1.65);
  slideTower.castShadow = true;
  poolGroup.add(slideTower);

  // Poolside Tiki Bar Pavilion (Right Side)
  const tiki = new THREE.Group();
  tiki.name = 'TikiPoolBar';
  tiki.position.set(3.95, 0.28, -0.5);

  const counter = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.72, 2.2), mats.timberDark);
  counter.position.y = 0.36;
  counter.castShadow = true;
  tiki.add(counter);

  const barTop = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.1, 2.4), mats.stuccoCream);
  barTop.position.y = 0.76;
  tiki.add(barTop);

  [
    [-0.82, -0.95],
    [0.82, -0.95],
    [-0.82, 0.95],
    [0.82, 0.95],
  ].forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.7, 6), mats.timberDark);
    post.position.set(px, 0.85, pz);
    tiki.add(post);
  });

  const tikiRoof = new THREE.Mesh(new THREE.ConeGeometry(1.85, 0.95, 6), mats.terracotta);
  tikiRoof.position.y = 2.1;
  tikiRoof.castShadow = true;
  tiki.add(tikiRoof);

  // Bar stools facing the pool
  [-0.65, 0, 0.65].forEach((sz) => {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.48, 8), mats.goldAccent);
    stool.position.set(-1.25, 0.24, sz);
    stool.castShadow = true;
    tiki.add(stool);
  });

  poolGroup.add(tiki);

  // Beach Umbrellas & Sun Loungers along front deck
  [-3.2, -1.2, 0.8].forEach((ux, i) => {
    const set = createUmbrellaAndLounger(
      mats,
      i % 2 === 0 ? mats.goldAccent : mats.coralAccent,
    );
    set.position.set(ux, 0.28, 2.95);
    poolGroup.add(set);
  });

  // Animated Center Fountain Jet Ring
  const fountainRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 8, 16), mats.whitePaint);
  fountainRing.rotation.x = Math.PI / 2;
  fountainRing.position.set(-0.6, 0.5, 0.2);
  poolGroup.add(fountainRing);
  fountainRings.push(fountainRing);

  return {
    group: poolGroup,
    refs: {
      poolFloats,
      fountainRings,
    },
  };
}

/**
 * 3. Bangalô Tropical de Praia / Overwater
 */
export function buildResortBungalowModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: ResortAnimatedRefs;
} {
  const mats = createResortMaterials(maxAnisotropy);
  const bungalow = new THREE.Group();
  bungalow.name = 'MegaCity_ResortBungalow';

  // Timber support stilts (y = 0 grounded)
  [
    [-1.45, -1.45],
    [1.45, -1.45],
    [-1.45, 1.45],
    [1.45, 1.45],
    [0, 1.45],
  ].forEach(([sx, sz]) => {
    const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.72, 8), mats.timberDark);
    stilt.position.set(sx, 0.36, sz);
    stilt.castShadow = true;
    bungalow.add(stilt);
  });

  // Wooden deck platform
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 3.8), mats.woodDeck);
  deck.position.set(0, 0.72, 0);
  deck.castShadow = true;
  deck.receiveShadow = true;
  bungalow.add(deck);

  // Entry stairs on front
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.28), mats.woodDeck);
    step.position.set(0, 0.14 + s * 0.2, 2.38 - s * 0.24);
    step.castShadow = true;
    bungalow.add(step);
  }

  // Bungalow Villa Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.85, 1.45, 2.35), mats.stuccoCream);
  cabin.position.set(0, 1.54, -0.42);
  cabin.castShadow = true;
  bungalow.add(cabin);

  // Panoramic turquoise doors & side windows
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.05, 0.1), mats.glassWindow);
  frontGlass.position.set(0, 1.45, 0.75);
  bungalow.add(frontGlass);

  // Steep tropical pyramid roof + golden ridge finial
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.55, 1.3, 4), mats.terracotta);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 2.9, -0.35);
  roof.castShadow = true;
  bungalow.add(roof);

  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), mats.goldAccent);
  finial.position.set(0, 3.6, -0.35);
  bungalow.add(finial);

  // Deck railing & sun umbrella
  const umbrella = createUmbrellaAndLounger(mats, mats.tealPaint);
  umbrella.position.set(-0.65, 0.8, 1.15);
  umbrella.scale.setScalar(0.82);
  bungalow.add(umbrella);

  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), mats.warmLantern);
  lantern.position.set(1.35, 1.45, 1.65);
  bungalow.add(lantern);

  return {
    group: bungalow,
    refs: { poolFloats: [], fountainRings: [] },
  };
}

/**
 * 4. Resort Completo ("MegaCity Beach & Palace Resort")
 */
export function buildCombinedResortScene(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: ResortAnimatedRefs;
} {
  const mats = createResortMaterials(maxAnisotropy);
  const root = new THREE.Group();
  root.name = 'MegaCity_ResortComplex_Scene';

  // Golden beach & resort promenade peninsula
  const beachBase = new THREE.Mesh(new THREE.BoxGeometry(22.5, 0.24, 15.5), mats.sandBase);
  beachBase.name = 'ResortBeachPeninsula';
  beachBase.position.set(0, 0.12, -0.4);
  beachBase.receiveShadow = true;
  root.add(beachBase);

  // Hotel at back center
  const hotelBuilt = buildResortHotelModel(maxAnisotropy);
  hotelBuilt.group.position.set(0, 0.24, -5.0);
  root.add(hotelBuilt.group);

  // Central Pool & Tiki Bar in front of hotel
  const poolBuilt = buildResortPoolModel(maxAnisotropy);
  poolBuilt.group.position.set(-1.8, 0.24, 2.2);
  root.add(poolBuilt.group);

  // Two Overwater / Beachfront Bungalows on the right & coastal edge
  const b1 = buildResortBungalowModel(maxAnisotropy);
  b1.group.scale.setScalar(0.86);
  b1.group.position.set(6.8, 0.0, 2.5);
  b1.group.rotation.y = -0.18;
  root.add(b1.group);

  const b2 = buildResortBungalowModel(maxAnisotropy);
  b2.group.scale.setScalar(0.86);
  b2.group.position.set(7.4, 0.0, -2.5);
  b2.group.rotation.y = -0.35;
  root.add(b2.group);

  // Wooden coastal pier leading offshore to a moored VIP Yacht/Catamaran
  const pier = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.16, 4.4), mats.woodDeck);
  pier.position.set(-7.6, 0.36, 7.6);
  pier.castShadow = true;
  root.add(pier);

  const vipBoat = new THREE.Group();
  vipBoat.name = 'Resort_VIPCatamaran';
  vipBoat.position.set(-5.8, 0.0, 9.5);
  vipBoat.rotation.y = 0.65;

  const boatHull = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 2.8), mats.whitePaint);
  boatHull.position.y = 0.18;
  boatHull.castShadow = true;
  vipBoat.add(boatHull);

  const boatCabin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 1.3), mats.tealPaint);
  boatCabin.position.set(0, 0.58, -0.15);
  vipBoat.add(boatCabin);

  const boatRoof = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 1.5), mats.goldAccent);
  boatRoof.position.set(0, 0.84, -0.15);
  vipBoat.add(boatRoof);

  root.add(vipBoat);

  // Tropical Palm Clusters framing the beach
  const palmSpots: Array<[number, number]> = [
    [-9.4, -4.6],
    [-9.2, 2.4],
    [-8.4, 5.4],
    [3.8, 5.2],
    [9.4, -5.2],
  ];
  palmSpots.forEach(([px, pz], i) => {
    const palm = createPalmTree(mats);
    palm.position.set(px, 0.24, pz);
    palm.rotation.y = i * 1.2;
    palm.scale.setScalar(1.0 + (i % 2) * 0.15);
    root.add(palm);
  });

  return {
    group: root,
    refs: {
      poolFloats: poolBuilt.refs.poolFloats,
      fountainRings: poolBuilt.refs.fountainRings,
      vipBoat,
    },
  };
}

export const GODOT4_RESORT_GDSCRIPT = `extends Node3D

# Arraste megacity_resort_completo.glb ou megacity_resort_piscina.glb como filho
@export var resort_root: Node3D
@export var float_bob_speed: float = 2.4

var _vip_boat: Node3D
var _time: float = 0.0

func _ready() -> void:
\tif resort_root == null:
\t\tresort_root = self
\t_vip_boat = resort_root.find_child("Resort_VIPCatamaran", true, false)

func _process(delta: float) -> void:
\t_time += delta
\tif _vip_boat:
\t\t_vip_boat.position.y = sin(_time * float_bob_speed) * 0.05
\t\t_vip_boat.rotation.z = cos(_time * 1.7) * 0.03
`;
