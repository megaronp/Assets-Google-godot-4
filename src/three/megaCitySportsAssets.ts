import * as THREE from 'three';

export type SportsAssetId = 'sports_combined' | 'stadium' | 'multicourt' | 'tenniscourt';

export interface SportsAnimatedRefs {
  soccerBall?: THREE.Object3D;
  basketball?: THREE.Object3D;
  tennisBall?: THREE.Object3D;
  blimp?: THREE.Object3D;
  blimpPropeller?: THREE.Object3D;
  floodlightPanels: THREE.Mesh[];
}

function createSoccerFieldTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Terracotta Olympic running track apron
    ctx.fillStyle = '#C85233';
    ctx.fillRect(0, 0, 1024, 512);

    // Track lane markings
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2;
    for (let inset = 18; inset <= 54; inset += 18) {
      ctx.strokeRect(inset, inset, 1024 - inset * 2, 512 - inset * 2);
    }

    // Alternating mown grass pitch stripes
    const px = 92;
    const py = 72;
    const pw = 840;
    const ph = 368;
    const stripeCount = 12;
    const sw = pw / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#2E9E47' : '#35B052';
      ctx.fillRect(px + i * sw, py, sw + 1, ph);
    }

    // Crisp white pitch lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.strokeRect(px, py, pw, ph);

    // Halfway line & center circle
    const cx = px + pw / 2;
    const cy = py + ph / 2;
    ctx.beginPath();
    ctx.moveTo(cx, py);
    ctx.lineTo(cx, py + ph);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Penalty boxes (left & right)
    ctx.strokeRect(px, cy - 102, 118, 204);
    ctx.strokeRect(px, cy - 52, 46, 104);
    ctx.strokeRect(px + pw - 118, cy - 102, 118, 204);
    ctx.strokeRect(px + pw - 46, cy - 52, 46, 104);

    // Penalty arcs
    ctx.beginPath();
    ctx.arc(px + 86, cy, 48, -0.75, 0.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px + pw - 86, cy, 48, Math.PI - 0.75, Math.PI + 0.75);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createMultiCourtTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Terracotta outer apron
    ctx.fillStyle = '#D95B38';
    ctx.fillRect(0, 0, 1024, 512);

    // Caribbean teal inner playing surface
    const mx = 72;
    const my = 56;
    const mw = 880;
    const mh = 400;
    ctx.fillStyle = '#0B7A8F';
    ctx.fillRect(mx, my, mw, mh);

    // Crisp court boundary
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(mx, my, mw, mh);

    // Center line & golden MegaCity center circle
    const cx = mx + mw / 2;
    const cy = my + mh / 2;
    ctx.beginPath();
    ctx.moveTo(cx, my);
    ctx.lineTo(cx, my + mh);
    ctx.stroke();

    ctx.fillStyle = '#F8B824';
    ctx.beginPath();
    ctx.arc(cx, cy, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Paint keys (golden yellow)
    ctx.fillStyle = '#E59F18';
    ctx.fillRect(mx, cy - 72, 165, 144);
    ctx.strokeRect(mx, cy - 72, 165, 144);
    ctx.fillRect(mx + mw - 165, cy - 72, 165, 144);
    ctx.strokeRect(mx + mw - 165, cy - 72, 165, 144);

    // Three-point arcs
    ctx.beginPath();
    ctx.arc(mx + 48, cy, 168, -1.28, 1.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mx + mw - 48, cy, 168, Math.PI - 1.28, Math.PI + 1.28);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createTennisCourtTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Sunny green tropical surround
    ctx.fillStyle = '#2E9E47';
    ctx.fillRect(0, 0, 1024, 512);

    // Blue hard-court inside
    const tx = 110;
    const ty = 72;
    const tw = 804;
    const th = 368;
    ctx.fillStyle = '#0B7A8F';
    ctx.fillRect(tx, ty, tw, th);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(tx, ty, tw, th);

    // Singles sidelines
    const singlesInset = 46;
    ctx.beginPath();
    ctx.moveTo(tx, ty + singlesInset);
    ctx.lineTo(tx + tw, ty + singlesInset);
    ctx.moveTo(tx, ty + th - singlesInset);
    ctx.lineTo(tx + tw, ty + th - singlesInset);
    ctx.stroke();

    // Service lines & center service line
    const cx = tx + tw / 2;
    const cy = ty + th / 2;
    const sLeft = cx - 190;
    const sRight = cx + 190;
    ctx.beginPath();
    ctx.moveTo(sLeft, ty + singlesInset);
    ctx.lineTo(sLeft, ty + th - singlesInset);
    ctx.moveTo(sRight, ty + singlesInset);
    ctx.lineTo(sRight, ty + th - singlesInset);
    ctx.moveTo(sLeft, cy);
    ctx.lineTo(sRight, cy);
    ctx.stroke();

    // Net center shadow line
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cx, ty - 16);
    ctx.lineTo(cx, ty + th + 16);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createScoreboardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#091B2E';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#F8B824';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = '#F8B824';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ARENA MEGACITY', 256, 62);

    ctx.fillStyle = '#12B5CB';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ILHA  2  :  1  VISITANTE', 256, 134);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('84:12   PUBLICO 100%', 256, 200);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.max(1, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createSportsMaterials(maxAnisotropy = 4) {
  return {
    concrete: new THREE.MeshStandardMaterial({
      color: 0xdbe2ea,
      roughness: 0.86,
      metalness: 0.04,
    }),
    stuccoCream: new THREE.MeshStandardMaterial({
      color: 0xfbf7ee,
      roughness: 0.74,
      metalness: 0.02,
    }),
    terracotta: new THREE.MeshStandardMaterial({
      color: 0xd95b38,
      roughness: 0.56,
      metalness: 0.05,
    }),
    tealPaint: new THREE.MeshStandardMaterial({
      color: 0x0b7a8f,
      roughness: 0.4,
      metalness: 0.2,
    }),
    cyanSeat: new THREE.MeshStandardMaterial({
      color: 0x12b5cb,
      roughness: 0.45,
      metalness: 0.1,
    }),
    goldAccent: new THREE.MeshStandardMaterial({
      color: 0xf8b824,
      roughness: 0.32,
      metalness: 0.55,
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.44,
      metalness: 0.78,
    }),
    whitePaint: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.1,
    }),
    acrylicGlass: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.58,
      clearcoat: 0.9,
    }),
    floodlightGlow: new THREE.MeshStandardMaterial({
      color: 0xfff8dc,
      emissive: 0xffd166,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.1,
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
    tennisBallMat: new THREE.MeshStandardMaterial({
      color: 0xd9f99d,
      roughness: 0.72,
      metalness: 0.0,
    }),
    soccerBallMat: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      metalness: 0.05,
    }),
    scoreboardMat: new THREE.MeshStandardMaterial({
      map: createScoreboardTexture(maxAnisotropy),
      emissive: 0xffffff,
      emissiveMap: createScoreboardTexture(maxAnisotropy),
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.1,
    }),
  };
}

function createPalmTree(mats: ReturnType<typeof createSportsMaterials>): THREE.Group {
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
 * 1. Estádio Municipal MegaCity (Soccer pitch, running track, 4-tier grandstands, VIP canopy, floodlights, scoreboard)
 */
export function buildStadiumModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: SportsAnimatedRefs;
} {
  const mats = createSportsMaterials(maxAnisotropy);
  const stadium = new THREE.Group();
  stadium.name = 'MegaCity_MunicipalStadium';

  const floodlightPanels: THREE.Mesh[] = [];

  // 1. Ground Base Slab + Soccer Pitch Texture (15.5 x 0.3 x 9.6)
  const fieldTex = createSoccerFieldTexture(maxAnisotropy);
  const fieldTopMat = new THREE.MeshStandardMaterial({
    map: fieldTex,
    roughness: 0.85,
    metalness: 0.02,
  });
  const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.28, 9.2), [
    mats.concrete,
    mats.concrete,
    fieldTopMat,
    mats.concrete,
    mats.concrete,
    mats.concrete,
  ]);
  baseSlab.name = 'StadiumPitchSlab';
  baseSlab.position.y = 0.14;
  baseSlab.receiveShadow = true;
  stadium.add(baseSlab);

  // 2. Stepped Grandstands (North, South, East, West)
  const buildStandTier = (length: number, posZ: number, rotY: number, isMainVip = false) => {
    const stand = new THREE.Group();
    stand.position.set(0, 0.28, posZ);
    stand.rotation.y = rotY;

    // Concrete backing wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(length, 2.1, 0.45), mats.stuccoCream);
    wall.position.set(0, 1.05, -1.25);
    wall.castShadow = true;
    wall.receiveShadow = true;
    stand.add(wall);

    // 3 stepped colorful seating rows
    const seatMats = [mats.cyanSeat, mats.goldAccent, mats.terracotta];
    for (let r = 0; r < 3; r++) {
      const row = new THREE.Mesh(
        new THREE.BoxGeometry(length - 0.15, 0.48, 0.58),
        seatMats[r],
      );
      row.position.set(0, 0.24 + r * 0.48, 0.18 - r * 0.48);
      row.castShadow = true;
      row.receiveShadow = true;
      stand.add(row);
    }

    // Sweeping VIP Canopy on main North stand
    if (isMainVip) {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(length + 0.4, 0.18, 2.35), mats.terracotta);
      roof.position.set(0, 2.55, -0.35);
      roof.rotation.x = 0.08;
      roof.castShadow = true;
      stand.add(roof);

      const fascia = new THREE.Mesh(new THREE.BoxGeometry(length + 0.44, 0.12, 0.16), mats.goldAccent);
      fascia.position.set(0, 2.46, 0.8);
      stand.add(fascia);

      // Canopy support pillars
      [-length * 0.42, 0, length * 0.42].forEach((px) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.1, 2.45, 8),
          mats.stuccoCream,
        );
        pillar.position.set(px, 1.22, -1.18);
        pillar.castShadow = true;
        stand.add(pillar);
      });
    }

    return stand;
  };

  const northStand = buildStandTier(12.2, -5.2, 0, true);
  northStand.name = 'NorthVIPStand';
  stadium.add(northStand);

  const southStand = buildStandTier(12.2, 5.2, Math.PI, false);
  southStand.name = 'SouthStand';
  stadium.add(southStand);

  // Side end-zone stands (East & West)
  const buildEndStand = (posX: number, rotY: number) => {
    const stand = new THREE.Group();
    stand.position.set(posX, 0.28, 0);
    stand.rotation.y = rotY;
    for (let r = 0; r < 2; r++) {
      const row = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.45, 0.56),
        r === 0 ? mats.goldAccent : mats.cyanSeat,
      );
      row.position.set(0, 0.22 + r * 0.45, 0.18 - r * 0.48);
      row.castShadow = true;
      row.receiveShadow = true;
      stand.add(row);
    }
    const wall = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.25, 0.35), mats.stuccoCream);
    wall.position.set(0, 0.62, -0.75);
    wall.castShadow = true;
    stand.add(wall);
    return stand;
  };

  stadium.add(buildEndStand(-8.1, Math.PI / 2));
  stadium.add(buildEndStand(8.1, -Math.PI / 2));

  // 3. Soccer Goals (East & West)
  [-6.15, 6.15].forEach((gx, idx) => {
    const goal = new THREE.Group();
    goal.name = idx === 0 ? 'GoalWest' : 'GoalEast';
    goal.position.set(gx, 0.28, 0);

    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 8), mats.whitePaint);
    postL.position.set(0, 0.36, -0.68);
    const postR = postL.clone();
    postR.position.set(0, 0.36, 0.68);
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), mats.whitePaint);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(0, 0.72, 0);

    const netBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.7, 1.32),
      mats.acrylicGlass,
    );
    netBack.position.set(gx < 0 ? -0.22 : 0.22, 0.35, 0);

    goal.add(postL, postR, crossbar, netBack);
    stadium.add(goal);
  });

  // 4. Four Corner Floodlight Towers
  const towerCoords: Array<[number, number, number]> = [
    [-7.8, -4.9, Math.PI / 4],
    [7.8, -4.9, -Math.PI / 4],
    [-7.8, 4.9, (3 * Math.PI) / 4],
    [7.8, 4.9, (-3 * Math.PI) / 4],
  ];
  towerCoords.forEach(([tx, tz, rotY], i) => {
    const tower = new THREE.Group();
    tower.name = `FloodlightTower_${i + 1}`;
    tower.position.set(tx, 0.28, tz);
    tower.rotation.y = rotY;

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 4.2, 8), mats.darkMetal);
    mast.position.y = 2.1;
    mast.castShadow = true;
    tower.add(mast);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.55, 0.2), mats.darkMetal);
    head.position.set(0, 4.25, 0);
    head.rotation.x = 0.42;
    head.castShadow = true;
    tower.add(head);

    const glow = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.42, 0.06), mats.floodlightGlow);
    glow.position.set(0, 4.22, 0.11);
    glow.rotation.x = 0.42;
    tower.add(glow);
    floodlightPanels.push(glow);

    stadium.add(tower);
  });

  // 5. Giant Electronic Scoreboard at East End
  const scoreboard = new THREE.Group();
  scoreboard.name = 'StadiumScoreboard';
  scoreboard.position.set(8.65, 1.55, 0);
  scoreboard.rotation.y = -Math.PI / 2;

  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.7, 0.24), mats.darkMetal);
  boardFrame.position.y = 1.4;
  boardFrame.castShadow = true;
  scoreboard.add(boardFrame);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 1.48), mats.scoreboardMat);
  screen.position.set(0, 1.4, 0.13);
  scoreboard.add(screen);

  [-1.1, 1.1].forEach((sx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.8, 8), mats.darkMetal);
    leg.position.set(sx, 0.2, 0);
    scoreboard.add(leg);
  });
  stadium.add(scoreboard);

  // 6. Animated Soccer Ball
  const soccerBall = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), mats.soccerBallMat);
  soccerBall.name = 'MatchBall';
  soccerBall.position.set(0, 0.5, 0);
  soccerBall.castShadow = true;
  stadium.add(soccerBall);

  return {
    group: stadium,
    refs: {
      soccerBall,
      floodlightPanels,
    },
  };
}

/**
 * 2. Quadra Poliesportiva Tropical (Basquete / Futsal, tabelas, traves, arquibancada e alambrado)
 */
export function buildMultiCourtModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: SportsAnimatedRefs;
} {
  const mats = createSportsMaterials(maxAnisotropy);
  const court = new THREE.Group();
  court.name = 'MegaCity_MultiSportCourt';

  const floodlightPanels: THREE.Mesh[] = [];

  // 1. Painted Concrete Court Slab (10.5 x 0.24 x 6.0)
  const courtTex = createMultiCourtTexture(maxAnisotropy);
  const topMat = new THREE.MeshStandardMaterial({
    map: courtTex,
    roughness: 0.72,
    metalness: 0.04,
  });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.24, 5.8), [
    mats.concrete,
    mats.concrete,
    topMat,
    mats.concrete,
    mats.concrete,
    mats.concrete,
  ]);
  slab.name = 'MultiCourtFloor';
  slab.position.y = 0.12;
  slab.receiveShadow = true;
  court.add(slab);

  // 2. Twin Basketball Hoops (East & West)
  [-4.45, 4.45].forEach((hx, idx) => {
    const dir = hx < 0 ? 1 : -1;
    const hoop = new THREE.Group();
    hoop.name = idx === 0 ? 'BasketballHoop_Left' : 'BasketballHoop_Right';
    hoop.position.set(hx, 0.24, 0);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.95, 8), mats.darkMetal);
    pole.position.y = 0.975;
    pole.castShadow = true;
    hoop.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.08), mats.darkMetal);
    arm.position.set(dir * 0.2, 1.88, 0);
    hoop.add(arm);

    const backboard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 1.05), mats.acrylicGlass);
    backboard.position.set(dir * 0.42, 1.98, 0);
    hoop.add(backboard);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 16), mats.terracotta);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(dir * 0.62, 1.78, 0);
    hoop.add(rim);

    court.add(hoop);
  });

  // 3. Perimeter Fence Railings (Back & Ends)
  const fenceBack = new THREE.Mesh(new THREE.BoxGeometry(10.3, 0.06, 0.06), mats.darkMetal);
  fenceBack.position.set(0, 1.15, -2.82);
  court.add(fenceBack);

  for (let x = -5.1; x <= 5.1; x += 1.7) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.15, 6), mats.darkMetal);
    post.position.set(x, 0.81, -2.82);
    court.add(post);
  }

  // 4. Side Wooden/Gold Bleachers (2 rows along front-left)
  for (let r = 0; r < 2; r++) {
    const bleacher = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.26, 0.45),
      r === 0 ? mats.goldAccent : mats.tealPaint,
    );
    bleacher.position.set(0, 0.36 + r * 0.28, -2.32 - r * 0.36);
    bleacher.castShadow = true;
    court.add(bleacher);
  }

  // 5. Two Light Poles & Tropical Palms
  [-4.6, 4.6].forEach((lx) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.8, 8), mats.darkMetal);
    pole.position.set(lx, 1.64, -2.75);
    pole.castShadow = true;
    court.add(pole);

    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.24), mats.floodlightGlow);
    lamp.position.set(lx, 3.04, -2.6);
    lamp.rotation.x = 0.35;
    court.add(lamp);
    floodlightPanels.push(lamp);
  });

  const palmL = createPalmTree(mats);
  palmL.position.set(-5.0, 0.24, 2.55);
  palmL.scale.setScalar(0.85);
  court.add(palmL);

  const palmR = createPalmTree(mats);
  palmR.position.set(5.0, 0.24, 2.55);
  palmR.rotation.y = 2.1;
  palmR.scale.setScalar(0.92);
  court.add(palmR);

  // 6. Animated Basketball
  const basketball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), mats.terracotta);
  basketball.name = 'BasketballBall';
  basketball.position.set(0, 0.42, 0);
  basketball.castShadow = true;
  court.add(basketball);

  return {
    group: court,
    refs: {
      basketball,
      floodlightPanels,
    },
  };
}

/**
 * 3. Quadra de Tênis da Ilha (Piso azul e verde, rede central, cadeira de árbitro e pergolado)
 */
export function buildTennisCourtModel(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: SportsAnimatedRefs;
} {
  const mats = createSportsMaterials(maxAnisotropy);
  const tennis = new THREE.Group();
  tennis.name = 'MegaCity_TennisCourt';

  // 1. Court Slab (10.0 x 0.24 x 5.4)
  const tex = createTennisCourtTexture(maxAnisotropy);
  const topMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.78,
    metalness: 0.02,
  });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.24, 5.4), [
    mats.concrete,
    mats.concrete,
    topMat,
    mats.concrete,
    mats.concrete,
    mats.concrete,
  ]);
  slab.name = 'TennisFloor';
  slab.position.y = 0.12;
  slab.receiveShadow = true;
  tennis.add(slab);

  // 2. Central Tennis Net & Posts
  [-2.25, 2.25].forEach((nz) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.65, 8), mats.darkMetal);
    post.position.set(0, 0.56, nz);
    post.castShadow = true;
    tennis.add(post);
  });

  const netMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 4.46), mats.acrylicGlass);
  netMesh.name = 'TennisNet';
  netMesh.position.set(0, 0.52, 0);
  tennis.add(netMesh);

  const netTape = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 4.5), mats.whitePaint);
  netTape.position.set(0, 0.8, 0);
  tennis.add(netTape);

  // 3. Elevated Umpire Chair (center-back)
  const umpire = new THREE.Group();
  umpire.name = 'UmpireChair';
  umpire.position.set(0, 0.24, -2.48);

  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.88, 0.45), mats.stuccoCream);
  stand.position.y = 0.44;
  stand.castShadow = true;
  umpire.add(stand);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.65), mats.goldAccent);
  canopy.position.y = 1.48;
  canopy.castShadow = true;
  umpire.add(canopy);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.36), mats.tealPaint);
  seat.position.y = 1.05;
  umpire.add(seat);

  tennis.add(umpire);

  // 4. Player Shade Benches (left & right of umpire)
  [-1.6, 1.6].forEach((bx) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 0.42), mats.goldAccent);
    bench.position.set(bx, 0.38, -2.42);
    bench.castShadow = true;
    tennis.add(bench);
  });

  // 5. Animated Tennis Ball
  const tennisBall = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), mats.tennisBallMat);
  tennisBall.name = 'TennisBall';
  tennisBall.position.set(-1.5, 0.45, 0);
  tennisBall.castShadow = true;
  tennis.add(tennisBall);

  return {
    group: tennis,
    refs: {
      tennisBall,
      floodlightPanels: [],
    },
  };
}

/**
 * 4. Complexo Esportivo Completo (Estádio + Quadra Poliesportiva + Quadra de Tênis + Dirigível de TV)
 */
export function buildCombinedSportsComplex(maxAnisotropy = 4): {
  group: THREE.Group;
  refs: SportsAnimatedRefs;
} {
  const mats = createSportsMaterials(maxAnisotropy);
  const root = new THREE.Group();
  root.name = 'MegaCity_SportsComplex_Scene';

  // Park Promenade Base (24 x 0.16 x 20)
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(22.5, 0.16, 19.5), mats.concrete);
  plaza.name = 'SportsParkPlaza';
  plaza.position.set(0, 0.08, 1.4);
  plaza.receiveShadow = true;
  root.add(plaza);

  const stadiumBuilt = buildStadiumModel(maxAnisotropy);
  stadiumBuilt.group.position.set(0, 0.16, -2.8);
  root.add(stadiumBuilt.group);

  const multiBuilt = buildMultiCourtModel(maxAnisotropy);
  multiBuilt.group.position.set(-5.6, 0.16, 7.2);
  root.add(multiBuilt.group);

  const tennisBuilt = buildTennisCourtModel(maxAnisotropy);
  tennisBuilt.group.position.set(5.6, 0.16, 7.2);
  root.add(tennisBuilt.group);

  // Tropical Palms along central avenue
  const palmSpots: Array<[number, number]> = [
    [-10.6, 3.4],
    [0.0, 3.6],
    [10.6, 3.4],
    [0.0, 10.4],
  ];
  palmSpots.forEach(([px, pz], i) => {
    const palm = createPalmTree(mats);
    palm.position.set(px, 0.16, pz);
    palm.rotation.y = i * 1.4;
    palm.scale.setScalar(1.05);
    root.add(palm);
  });

  // Broadcast Blimp ("MegaCity Sports TV") orbiting high above stadium
  const blimp = new THREE.Group();
  blimp.name = 'MegaCity_SportsBlimp';
  blimp.position.set(0, 7.8, -2.0);

  const envelope = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 12), mats.goldAccent);
  envelope.scale.set(0.85, 0.85, 2.15);
  envelope.castShadow = true;
  blimp.add(envelope);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.9, 16), mats.tealPaint);
  band.rotation.x = Math.PI / 2;
  blimp.add(band);

  const gondola = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.95), mats.stuccoCream);
  gondola.position.y = -0.88;
  blimp.add(gondola);

  const tailFinV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.65), mats.terracotta);
  tailFinV.position.set(0, 0.25, -1.65);
  blimp.add(tailFinV);

  const tailFinH = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.06, 0.6), mats.terracotta);
  tailFinH.position.set(0, 0, -1.65);
  blimp.add(tailFinH);

  const blimpProp = new THREE.Group();
  blimpProp.name = 'BlimpPropeller';
  blimpProp.position.set(0, -0.88, -0.55);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.02), mats.darkMetal);
  blimpProp.add(blade);
  blimp.add(blimpProp);

  root.add(blimp);

  return {
    group: root,
    refs: {
      soccerBall: stadiumBuilt.refs.soccerBall,
      basketball: multiBuilt.refs.basketball,
      tennisBall: tennisBuilt.refs.tennisBall,
      blimp,
      blimpPropeller: blimpProp,
      floodlightPanels: [
        ...stadiumBuilt.refs.floodlightPanels,
        ...multiBuilt.refs.floodlightPanels,
      ],
    },
  };
}

export const GODOT4_SPORTS_GDSCRIPT = `extends Node3D

# Arraste megacity_complexo_esportivo.glb ou megacity_estadio.glb como filho
@export var sports_root: Node3D
@export var night_lights_on: bool = true

var _blimp: Node3D
var _soccer_ball: Node3D
var _time: float = 0.0

func _ready() -> void:
\tif sports_root == null:
\t\tsports_root = self
\t_blimp = sports_root.find_child("MegaCity_SportsBlimp", true, false)
\t_soccer_ball = sports_root.find_child("MatchBall", true, false)

func _process(delta: float) -> void:
\t_time += delta
\tif _blimp:
\t\tvar angle := _time * 0.35
\t\t_blimp.position.x = cos(angle) * 9.0
\t\t_blimp.position.z = -2.8 + sin(angle) * 5.0
\t\t_blimp.rotation.y = -angle
\tif _soccer_ball:
\t\t_soccer_ball.position.x = sin(_time * 1.8) * 3.8
\t\t_soccer_ball.position.y = 0.5 + abs(sin(_time * 3.6)) * 0.45
`;
