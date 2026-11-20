import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Download,
  Play,
  Pause,
  Grid3x3,
  Sun,
  Sunset,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Plane,
  Building2,
  Anchor,
  Ship,
  Trophy,
  Palmtree,
} from 'lucide-react';
import {
  type AviationAssetId,
  type AviationAnimatedRefs,
  type ModelStats,
  buildAirportModel,
  buildCombinedAirportScene,
  buildCommercialPlaneModel,
  buildSeaplaneModel,
  exportGroupToGlb,
  measureGroupStats,
  GODOT4_AIRPORT_GDSCRIPT,
} from '../three/megaCityAviationAssets';
import {
  type MarinaAssetId,
  type MarinaAnimatedRefs,
  buildCombinedMarinaScene,
  buildMarinaDockModel,
  buildSmallFishingBoatModel,
  buildLargeFishingTrawlerModel,
  GODOT4_MARINA_GDSCRIPT,
} from '../three/megaCityMarinaAssets';
import {
  type SportsAssetId,
  type SportsAnimatedRefs,
  buildCombinedSportsComplex,
  buildStadiumModel,
  buildMultiCourtModel,
  buildTennisCourtModel,
  GODOT4_SPORTS_GDSCRIPT,
} from '../three/megaCitySportsAssets';
import {
  type ResortAssetId,
  type ResortAnimatedRefs,
  buildCombinedResortScene,
  buildResortHotelModel,
  buildResortPoolModel,
  buildResortBungalowModel,
  GODOT4_RESORT_GDSCRIPT,
} from '../three/megaCityResortAssets';

type StudioPack = 'resort' | 'sports' | 'marina' | 'aviation';
type StudioAssetId = ResortAssetId | SportsAssetId | MarinaAssetId | AviationAssetId;

interface AssetMeta {
  id: StudioAssetId;
  pack: StudioPack;
  label: string;
  filename: string;
  description: string;
  cameraPos: [number, number, number];
  target: [number, number, number];
  iconType: 'resort' | 'sports' | 'marina' | 'boat' | 'airport' | 'plane';
}

const ASSET_CATALOG: AssetMeta[] = [
  // Resort Tropical Pack
  {
    id: 'resort_combined',
    pack: 'resort',
    label: 'Resort Completo',
    filename: 'megacity_resort_completo.glb',
    description:
      'Complexo hoteleiro à beira-mar com Palace Hotel, piscina com toboágua, bar tiki, 2 bangalôs e lancha VIP.',
    cameraPos: [17.5, 10.6, 18.8],
    target: [0, 1.0, 0.2],
    iconType: 'resort',
  },
  {
    id: 'resort_hotel',
    pack: 'resort',
    label: 'Hotel Principal',
    filename: 'megacity_resort_hotel.glb',
    description:
      'Hotel de 4 andares com varandas douradas, fachada envidraçada, cobertura terracota, letreiro e porte-cochère.',
    cameraPos: [10.8, 6.2, 11.4],
    target: [0, 1.8, 0],
    iconType: 'resort',
  },
  {
    id: 'resort_pool',
    pack: 'resort',
    label: 'Piscina & Bar Tiki',
    filename: 'megacity_resort_piscina.glb',
    description:
      'Deck de madeira com piscina de azulejos turquesa, toboágua, bar tiki, espreguiçadeiras e boias animadas.',
    cameraPos: [9.5, 5.6, 9.8],
    target: [0, 0.7, 0],
    iconType: 'resort',
  },
  {
    id: 'resort_bungalow',
    pack: 'resort',
    label: 'Bangalô de Praia',
    filename: 'megacity_resort_bangalo.glb',
    description:
      'Suíte bangalô sobre palafitas de madeira com deck privativo, guarda-sol, escada de acesso e teto piramidal.',
    cameraPos: [4.8, 3.2, 5.2],
    target: [0, 1.2, 0],
    iconType: 'resort',
  },
  // Quadras & Estádio Pack
  {
    id: 'sports_combined',
    pack: 'sports',
    label: 'Complexo Completo',
    filename: 'megacity_complexo_esportivo.glb',
    description:
      'Estádio municipal, quadra poliesportiva e quadra de tênis integrados em praça tropical com dirigível de TV.',
    cameraPos: [18.5, 12.2, 20.5],
    target: [0, 1.2, 1.5],
    iconType: 'sports',
  },
  {
    id: 'stadium',
    pack: 'sports',
    label: 'Estádio Municipal',
    filename: 'megacity_estadio.glb',
    description:
      'Campo gramado com pista de atletismo, 4 arquibancadas, cobertura VIP, torres de luz e placar eletrônico.',
    cameraPos: [14.5, 9.2, 14.5],
    target: [0, 1.2, 0],
    iconType: 'sports',
  },
  {
    id: 'multicourt',
    pack: 'sports',
    label: 'Quadra Poliesportiva',
    filename: 'megacity_quadra_poliesportiva.glb',
    description:
      'Quadra de basquete e futsal em turquesa e terracota com tabelas de acrílico, arquibancada e refletores.',
    cameraPos: [9.5, 5.8, 9.5],
    target: [0, 0.8, 0],
    iconType: 'sports',
  },
  {
    id: 'tenniscourt',
    pack: 'sports',
    label: 'Quadra de Tênis',
    filename: 'megacity_quadra_tenis.glb',
    description:
      'Quadra rápida com rede central tensionada, cadeira elevada de árbitro, bancos sombreados e bola animada.',
    cameraPos: [9.2, 5.5, 9.0],
    target: [0, 0.6, 0],
    iconType: 'sports',
  },
  // Marina de Pesca Pack
  {
    id: 'marina_combined',
    pack: 'marina',
    label: 'Marina Completa',
    filename: 'megacity_marina_pesca.glb',
    description:
      'Cais de madeira com 3 píeres, mercado do peixe, farol, guindaste, 3 barcos pequenos e 2 traineiras grandes.',
    cameraPos: [15.0, 9.2, 16.5],
    target: [0, 0.8, 0.5],
    iconType: 'marina',
  },
  {
    id: 'marina_dock',
    pack: 'marina',
    label: 'Cais & Mercado',
    filename: 'megacity_marina_estrutura.glb',
    description:
      'Estrutura modular da marina (píeres, mercado do peixe, guindaste e farol) sem barcos para instanciar frotas.',
    cameraPos: [14.2, 8.6, 13.8],
    target: [0, 1.0, -1.2],
    iconType: 'marina',
  },
  {
    id: 'boat_small',
    pack: 'marina',
    label: 'Barco Pequeno',
    filename: 'megacity_barco_pequeno.glb',
    description:
      'Barco artesanal de pesca com toldo listrado, rede de proa, caixas de peixe e motor de popa giratório.',
    cameraPos: [3.2, 2.0, 3.4],
    target: [0, 0.45, 0],
    iconType: 'boat',
  },
  {
    id: 'boat_large',
    pack: 'marina',
    label: 'Barco Grande',
    filename: 'megacity_barco_grande.glb',
    description:
      'Traineira pesqueira oceânica com ponte de comando, radar giratório, pórtico de arrasto e hélice de bronze.',
    cameraPos: [6.4, 3.6, 6.8],
    target: [0, 0.9, 0],
    iconType: 'boat',
  },
  // Aeroporto & Aviões Pack
  {
    id: 'combined',
    pack: 'aviation',
    label: 'Aeroporto Completo',
    filename: 'megacity_conjunto_aeroporto.glb',
    description:
      'Aeroporto tropical completo com pista, torre de controle, hangar e os dois aviões posicionados.',
    cameraPos: [14.5, 9.2, 14.5],
    target: [0, 1.0, -0.5],
    iconType: 'airport',
  },
  {
    id: 'airport',
    pack: 'aviation',
    label: 'Aeroporto',
    filename: 'megacity_aeroporto.glb',
    description:
      'Terminal caribenho, torre com nó RadarDish giratório, hangar em arco, caminhão e luzes de pista.',
    cameraPos: [13.5, 8.6, 13.0],
    target: [0, 1.1, -0.6],
    iconType: 'airport',
  },
  {
    id: 'commercial',
    pack: 'aviation',
    label: 'Avião MegaAir',
    filename: 'megacity_aviao_comercial.glb',
    description:
      'Bimotor comercial com pintura turquesa e ouro, trem de pouso e hélices PropellerLeft/Right.',
    cameraPos: [4.2, 2.3, 4.4],
    target: [0, 0.75, 0],
    iconType: 'plane',
  },
  {
    id: 'seaplane',
    pack: 'aviation',
    label: 'Hidroavião',
    filename: 'megacity_hidroaviao.glb',
    description:
      'Hidroavião turístico com flutuadores duplos para pousar na baía ou no porto da ilha.',
    cameraPos: [3.8, 2.1, 3.8],
    target: [0, 0.78, 0],
    iconType: 'plane',
  },
];

const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function Aviation3DStudio() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const viewportContainerRef = useRef<HTMLDivElement | null>(null);

  const [pack, setPack] = useState<StudioPack>('resort');
  const [activeAsset, setActiveAsset] = useState<StudioAssetId>('resort_combined');
  const [animating, setAnimating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset'>('day');
  const [dockOpen, setDockOpen] = useState(true);
  const [stats, setStats] = useState<ModelStats>({ meshes: 0, triangles: 0, materials: 0 });
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [copiedGd, setCopiedGd] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const packRef = useRef<StudioPack>(pack);
  const activeAssetRef = useRef<StudioAssetId>(activeAsset);
  const animatingRef = useRef<boolean>(animating);
  const wireframeRef = useRef<boolean>(wireframe);
  const currentGroupRef = useRef<THREE.Group | null>(null);

  const resortRefsRef = useRef<ResortAnimatedRefs>({ poolFloats: [], fountainRings: [] });
  const sportsRefsRef = useRef<SportsAnimatedRefs>({ floodlightPanels: [] });
  const aviationRefsRef = useRef<AviationAnimatedRefs>({ propellers: [], beacons: [] });
  const marinaRefsRef = useRef<MarinaAnimatedRefs>({ propellers: [], bobbingBoats: [] });

  const sceneObjectsRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    keyLight?: THREE.DirectionalLight;
    hemiLight?: THREE.HemisphereLight;
    groundMat?: THREE.MeshStandardMaterial;
    maxAnisotropy: number;
    camTransitionActive: boolean;
  }>({ maxAnisotropy: 4, camTransitionActive: false });

  useEffect(() => {
    packRef.current = pack;
  }, [pack]);

  useEffect(() => {
    activeAssetRef.current = activeAsset;
  }, [activeAsset]);

  useEffect(() => {
    animatingRef.current = animating;
  }, [animating]);

  useEffect(() => {
    wireframeRef.current = wireframe;
    if (currentGroupRef.current) {
      currentGroupRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m && 'wireframe' in m) {
              m.wireframe = wireframe;
            }
          });
        }
      });
    }
  }, [wireframe]);

  useEffect(() => {
    const { scene, keyLight, hemiLight } = sceneObjectsRef.current;
    if (!scene || !keyLight || !hemiLight) return;

    if (lightingMode === 'day') {
      scene.background = new THREE.Color(0xdbeefe);
      scene.fog = new THREE.Fog(0xdbeefe, 32, 80);
      keyLight.color.setHex(0xfff4dc);
      keyLight.intensity = 2.1;
      keyLight.position.set(14, 20, 12);
      hemiLight.color.setHex(0x87ceeb);
      hemiLight.groundColor.setHex(0x5b6b58);
      hemiLight.intensity = 0.75;
    } else {
      scene.background = new THREE.Color(0x232946);
      scene.fog = new THREE.Fog(0x232946, 30, 78);
      keyLight.color.setHex(0xff9f5a);
      keyLight.intensity = 1.75;
      keyLight.position.set(-16, 10, 14);
      hemiLight.color.setHex(0xff8e72);
      hemiLight.groundColor.setHex(0x1f2544);
      hemiLight.intensity = 0.55;
    }

    sportsRefsRef.current.floodlightPanels.forEach((panel) => {
      const mat = panel.material as THREE.MeshStandardMaterial;
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = lightingMode === 'sunset' ? 2.6 : 1.3;
      }
    });
  }, [lightingMode]);

  const handleSelectPack = (nextPack: StudioPack) => {
    if (nextPack === pack) return;
    setPack(nextPack);
    if (nextPack === 'resort') setActiveAsset('resort_combined');
    else if (nextPack === 'sports') setActiveAsset('sports_combined');
    else if (nextPack === 'marina') setActiveAsset('marina_combined');
    else setActiveAsset('combined');
  };

  // Swap active 3D asset inside existing Three.js scene
  useEffect(() => {
    const { scene, controls, groundMat, maxAnisotropy } = sceneObjectsRef.current;
    if (!scene || !controls) return;

    if (currentGroupRef.current) {
      scene.remove(currentGroupRef.current);
      currentGroupRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
    }

    if (groundMat) {
      if (pack === 'resort') groundMat.color.setHex(0x1295ad);
      else if (pack === 'sports') groundMat.color.setHex(0x3a944d);
      else if (pack === 'marina') groundMat.color.setHex(0x1295ad);
      else groundMat.color.setHex(0x2694ab);
    }

    let builtGroup: THREE.Group;
    resortRefsRef.current = { poolFloats: [], fountainRings: [] };
    sportsRefsRef.current = { floodlightPanels: [] };
    marinaRefsRef.current = { propellers: [], bobbingBoats: [] };
    aviationRefsRef.current = { propellers: [], beacons: [] };

    if (activeAsset === 'resort_combined') {
      const built = buildCombinedResortScene(maxAnisotropy);
      builtGroup = built.group;
      resortRefsRef.current = built.refs;
    } else if (activeAsset === 'resort_hotel') {
      const built = buildResortHotelModel(maxAnisotropy);
      builtGroup = built.group;
      resortRefsRef.current = built.refs;
    } else if (activeAsset === 'resort_pool') {
      const built = buildResortPoolModel(maxAnisotropy);
      builtGroup = built.group;
      resortRefsRef.current = built.refs;
    } else if (activeAsset === 'resort_bungalow') {
      const built = buildResortBungalowModel(maxAnisotropy);
      builtGroup = built.group;
      resortRefsRef.current = built.refs;
    } else if (activeAsset === 'sports_combined') {
      const built = buildCombinedSportsComplex(maxAnisotropy);
      builtGroup = built.group;
      sportsRefsRef.current = built.refs;
    } else if (activeAsset === 'stadium') {
      const built = buildStadiumModel(maxAnisotropy);
      builtGroup = built.group;
      sportsRefsRef.current = built.refs;
    } else if (activeAsset === 'multicourt') {
      const built = buildMultiCourtModel(maxAnisotropy);
      builtGroup = built.group;
      sportsRefsRef.current = built.refs;
    } else if (activeAsset === 'tenniscourt') {
      const built = buildTennisCourtModel(maxAnisotropy);
      builtGroup = built.group;
      sportsRefsRef.current = built.refs;
    } else if (activeAsset === 'marina_combined') {
      const built = buildCombinedMarinaScene(maxAnisotropy);
      builtGroup = built.group;
      marinaRefsRef.current = built.refs;
    } else if (activeAsset === 'marina_dock') {
      const built = buildMarinaDockModel(maxAnisotropy);
      builtGroup = built.group;
      marinaRefsRef.current = built.refs;
    } else if (activeAsset === 'boat_small') {
      const built = buildSmallFishingBoatModel('teal', maxAnisotropy);
      builtGroup = built.group;
      marinaRefsRef.current = {
        ...built.refs,
        bobbingBoats: [{ obj: built.group, baseY: 0, phase: 0, amp: 0.04 }],
      };
    } else if (activeAsset === 'boat_large') {
      const built = buildLargeFishingTrawlerModel(maxAnisotropy);
      builtGroup = built.group;
      marinaRefsRef.current = {
        ...built.refs,
        bobbingBoats: [{ obj: built.group, baseY: 0, phase: 0, amp: 0.035 }],
      };
    } else if (activeAsset === 'airport') {
      const built = buildAirportModel(maxAnisotropy);
      builtGroup = built.group;
      aviationRefsRef.current = built.refs;
    } else if (activeAsset === 'commercial') {
      const built = buildCommercialPlaneModel();
      builtGroup = built.group;
      aviationRefsRef.current = built.refs;
    } else if (activeAsset === 'seaplane') {
      const built = buildSeaplaneModel();
      builtGroup = built.group;
      aviationRefsRef.current = built.refs;
    } else {
      const built = buildCombinedAirportScene(maxAnisotropy);
      builtGroup = built.group;
      aviationRefsRef.current = built.refs;
    }

    builtGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          if (m && 'wireframe' in m) m.wireframe = wireframeRef.current;
        });
      }
    });

    scene.add(builtGroup);
    currentGroupRef.current = builtGroup;
    setStats(measureGroupStats(builtGroup));

    const meta = ASSET_CATALOG.find((a) => a.id === activeAsset) ?? ASSET_CATALOG[0];
    _camTargetPos.set(...meta.cameraPos);
    _camTargetLook.set(...meta.target);
    sceneObjectsRef.current.camTransitionActive = true;
  }, [activeAsset, pack]);

  // Initialize Three.js WebGL scene once
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = mount.clientWidth || 960;
    const height = mount.clientHeight || 540;
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeefe);
    scene.fog = new THREE.Fog(0xdbeefe, 32, 80);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 150);
    camera.position.set(17.5, 10.6, 18.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 2.0;
    controls.maxDistance = 42;
    controls.target.set(0, 1.0, 0.2);

    const onControlStart = () => {
      sceneObjectsRef.current.camTransitionActive = false;
    };
    controls.addEventListener('start', onControlStart);

    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x5b6b58, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4dc, 2.1);
    keyLight.position.set(14, 20, 12);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.left = -16;
    keyLight.shadow.camera.right = 16;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 55;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.55);
    rimLight.position.set(-12, 8, -14);
    scene.add(rimLight);

    const groundGeo = new THREE.CircleGeometry(52, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1295ad,
      roughness: 0.52,
      metalness: 0.08,
    });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.position.y = -0.02;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    const gridHelper = new THREE.GridHelper(36, 36, 0x0e6e82, 0x158196);
    gridHelper.position.y = 0.0;
    scene.add(gridHelper);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    sceneObjectsRef.current = {
      scene,
      camera,
      controls,
      keyLight,
      hemiLight,
      groundMat,
      maxAnisotropy,
      camTransitionActive: false,
    };

    // Initial scene build: Resort Tropical Completo
    const initial = buildCombinedResortScene(maxAnisotropy);
    scene.add(initial.group);
    currentGroupRef.current = initial.group;
    resortRefsRef.current = initial.refs;
    setStats(measureGroupStats(initial.group));

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    let elapsedTime = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);

      if (sceneObjectsRef.current.camTransitionActive) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 6, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 6, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 6, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _camTargetLook.x, 6, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _camTargetLook.y, 6, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _camTargetLook.z, 6, delta);

        if (camera.position.distanceTo(_camTargetPos) < 0.04) {
          sceneObjectsRef.current.camTransitionActive = false;
        }
      }

      controls.update();

      if (animatingRef.current) {
        elapsedTime += delta;

        // Resort animations (pool floats, fountain ripple, VIP boat)
        const rRefs = resortRefsRef.current;
        for (let i = 0; i < rRefs.poolFloats.length; i++) {
          const pf = rRefs.poolFloats[i];
          pf.obj.position.y = pf.baseY + Math.sin(elapsedTime * 2.2 + pf.phase) * 0.028;
          pf.obj.rotation.z += delta * 0.45;
        }
        for (let i = 0; i < rRefs.fountainRings.length; i++) {
          const ring = rRefs.fountainRings[i];
          const pulse = 0.75 + ((elapsedTime * 0.9) % 1) * 0.85;
          ring.scale.set(pulse, pulse, 1);
        }
        if (rRefs.vipBoat) {
          rRefs.vipBoat.position.y = Math.sin(elapsedTime * 2.1) * 0.045;
          rRefs.vipBoat.rotation.z = Math.cos(elapsedTime * 1.6) * 0.028;
        }

        // Sports animations
        const sRefs = sportsRefsRef.current;
        if (sRefs.soccerBall) {
          sRefs.soccerBall.position.x = Math.sin(elapsedTime * 1.6) * 3.8;
          sRefs.soccerBall.position.z = Math.cos(elapsedTime * 1.1) * 1.6;
          sRefs.soccerBall.position.y = 0.5 + Math.abs(Math.sin(elapsedTime * 3.2)) * 0.48;
          sRefs.soccerBall.rotation.z -= delta * 4.5;
        }
        if (sRefs.basketball) {
          sRefs.basketball.position.x = Math.sin(elapsedTime * 1.9) * 2.8;
          sRefs.basketball.position.y = 0.42 + Math.abs(Math.sin(elapsedTime * 4.2)) * 0.72;
        }
        if (sRefs.tennisBall) {
          sRefs.tennisBall.position.x = Math.sin(elapsedTime * 2.8) * 3.1;
          sRefs.tennisBall.position.z = Math.cos(elapsedTime * 1.4) * 1.1;
          sRefs.tennisBall.position.y = 0.45 + Math.abs(Math.cos(elapsedTime * 2.8)) * 0.85;
        }
        if (sRefs.blimpPropeller) {
          sRefs.blimpPropeller.rotation.z += delta * 20;
        }
        if (sRefs.blimp) {
          const t = elapsedTime * 0.3;
          const bx = Math.cos(t) * 8.6;
          const bz = -2.6 + Math.sin(t) * 4.8;
          const nx = Math.cos(t + 0.05) * 8.6;
          const nz = -2.6 + Math.sin(t + 0.05) * 4.8;
          sRefs.blimp.position.set(bx, 7.6 + Math.sin(elapsedTime * 1.5) * 0.25, bz);
          sRefs.blimp.rotation.y = Math.atan2(nx - bx, nz - bz);
        }

        // Marina animations
        const mRefs = marinaRefsRef.current;
        if (mRefs.radarDish) {
          mRefs.radarDish.rotation.y += delta * 1.6;
        }
        for (let i = 0; i < mRefs.propellers.length; i++) {
          mRefs.propellers[i].rotation.z += delta * 18;
        }
        for (let i = 0; i < mRefs.bobbingBoats.length; i++) {
          const b = mRefs.bobbingBoats[i];
          b.obj.position.y = b.baseY + Math.sin(elapsedTime * 2.1 + b.phase) * b.amp;
          b.obj.rotation.z = Math.cos(elapsedTime * 1.6 + b.phase) * 0.032;
          b.obj.rotation.x = Math.sin(elapsedTime * 1.3 + b.phase) * 0.02;
        }
        if (mRefs.cruisingTrawler && activeAssetRef.current === 'marina_combined') {
          const t = (elapsedTime * 0.18) % (Math.PI * 2);
          const rx = 8.4;
          const rz = 2.6;
          const cx = Math.cos(t) * rx;
          const cz = 8.2 + Math.sin(t) * rz;
          const nextX = Math.cos(t + 0.05) * rx;
          const nextZ = 8.2 + Math.sin(t + 0.05) * rz;
          mRefs.cruisingTrawler.position.set(cx, Math.sin(elapsedTime * 2.4) * 0.04, cz);
          mRefs.cruisingTrawler.rotation.y = Math.atan2(nextX - cx, nextZ - cz);
          mRefs.cruisingTrawler.rotation.z = Math.cos(elapsedTime * 2.0) * 0.025;
        }

        // Aviation animations
        const aRefs = aviationRefsRef.current;
        if (aRefs.radarDish) {
          aRefs.radarDish.rotation.y += delta * 1.45;
        }
        for (let i = 0; i < aRefs.propellers.length; i++) {
          aRefs.propellers[i].rotation.z += delta * 24;
        }
        if (aRefs.flyingPlane && activeAssetRef.current === 'combined') {
          const cycle = (elapsedTime % 12) / 12;
          if (cycle < 0.25) {
            const t = cycle / 0.25;
            const eased = t * t;
            aRefs.flyingPlane.position.set(
              -5.8 + eased * 11.5,
              0.36 + Math.max(0, t - 0.65) * 2.2,
              2.32,
            );
            aRefs.flyingPlane.rotation.set(0, Math.PI / 2, Math.max(0, t - 0.65) * 0.35);
          } else if (cycle < 0.75) {
            const t = (cycle - 0.25) / 0.5;
            const angle = t * Math.PI * 1.5;
            const radius = 8.4;
            const px = Math.cos(angle - Math.PI / 2) * radius + 2.5;
            const pz = Math.sin(angle - Math.PI / 2) * radius + 0.4;
            const py = 2.6 + Math.sin(t * Math.PI) * 1.6;
            aRefs.flyingPlane.position.set(px, py, pz);
            aRefs.flyingPlane.rotation.set(0, -angle + Math.PI / 2, 0.22);
          } else {
            const t = (cycle - 0.75) / 0.25;
            aRefs.flyingPlane.position.set(
              -7.2 + t * 1.4,
              THREE.MathUtils.lerp(1.4, 0.36, t),
              2.32,
            );
            aRefs.flyingPlane.rotation.set(0, Math.PI / 2, THREE.MathUtils.lerp(-0.1, 0, t));
          }
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      envTex.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleExportGlb = async (assetId: StudioAssetId) => {
    const meta = ASSET_CATALOG.find((a) => a.id === assetId);
    if (!meta || exportingId) return;
    setExportingId(assetId);
    try {
      const maxAniso = sceneObjectsRef.current.maxAnisotropy || 4;
      let built: THREE.Group;
      if (assetId === 'resort_combined') built = buildCombinedResortScene(maxAniso).group;
      else if (assetId === 'resort_hotel') built = buildResortHotelModel(maxAniso).group;
      else if (assetId === 'resort_pool') built = buildResortPoolModel(maxAniso).group;
      else if (assetId === 'resort_bungalow') built = buildResortBungalowModel(maxAniso).group;
      else if (assetId === 'sports_combined') built = buildCombinedSportsComplex(maxAniso).group;
      else if (assetId === 'stadium') built = buildStadiumModel(maxAniso).group;
      else if (assetId === 'multicourt') built = buildMultiCourtModel(maxAniso).group;
      else if (assetId === 'tenniscourt') built = buildTennisCourtModel(maxAniso).group;
      else if (assetId === 'marina_combined') built = buildCombinedMarinaScene(maxAniso).group;
      else if (assetId === 'marina_dock') built = buildMarinaDockModel(maxAniso).group;
      else if (assetId === 'boat_small')
        built = buildSmallFishingBoatModel('teal', maxAniso).group;
      else if (assetId === 'boat_large')
        built = buildLargeFishingTrawlerModel(maxAniso).group;
      else if (assetId === 'airport') built = buildAirportModel(maxAniso).group;
      else if (assetId === 'commercial') built = buildCommercialPlaneModel().group;
      else if (assetId === 'seaplane') built = buildSeaplaneModel().group;
      else built = buildCombinedAirportScene(maxAniso).group;

      await exportGroupToGlb(built, meta.filename);
    } finally {
      setExportingId(null);
    }
  };

  const activeGdScript =
    pack === 'resort'
      ? GODOT4_RESORT_GDSCRIPT
      : pack === 'sports'
        ? GODOT4_SPORTS_GDSCRIPT
        : pack === 'marina'
          ? GODOT4_MARINA_GDSCRIPT
          : GODOT4_AIRPORT_GDSCRIPT;

  const activeGdTitle =
    pack === 'resort'
      ? 'ResortController.gd · Lancha VIP e boias animadas no Resort'
      : pack === 'sports'
        ? 'SportsComplexController.gd · Dirigível e bola animada no estádio'
        : pack === 'marina'
          ? 'MarinaController.gd · Balanço nas ondas e hélices dos barcos'
          : 'AirportController.gd · Gira o radar da torre e as hélices no Godot 4';

  const handleCopyGd = async () => {
    try {
      await navigator.clipboard.writeText(activeGdScript);
      setCopiedGd(true);
      setTimeout(() => setCopiedGd(false), 1800);
    } catch {
      setCopiedGd(true);
    }
  };

  const packAssets = ASSET_CATALOG.filter((item) => item.pack === pack);
  const activeMeta = ASSET_CATALOG.find((a) => a.id === activeAsset) ?? packAssets[0];

  const renderCardIcon = (iconType: AssetMeta['iconType']) => {
    if (iconType === 'resort')
      return <Palmtree className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
    if (iconType === 'sports')
      return <Trophy className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
    if (iconType === 'marina')
      return <Anchor className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
    if (iconType === 'boat')
      return <Ship className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
    if (iconType === 'airport')
      return <Building2 className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
    return <Plane className="w-4 h-4 text-[#0B7A8F] shrink-0" aria-hidden="true" />;
  };

  return (
    <section id="modelos3d" className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#0B7A8F] mb-1.5">
              Estúdio 3D para Godot 4 · Exportação glTF Binário (.glb)
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1E33] [text-wrap:balance]">
              Assets 3D: Resort, Quadras, Estádio, Marina e Aeroporto
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Inspecione cada construção e veículo em 360° e baixe os arquivos{' '}
              <span className="font-mono text-xs text-[#0B1E33]">.glb</span> prontos para importar
              em <span className="font-mono text-xs text-[#0B1E33]">res://assets/3d/</span> no
              Godot 4.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              role="group"
              aria-label="Selecionar pacote 3D"
              className="inline-flex flex-wrap items-center p-1 bg-[#F6F8FA] border border-slate-200 rounded-lg"
            >
              <button
                type="button"
                onClick={() => handleSelectPack('resort')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pack === 'resort'
                    ? 'bg-[#0B7A8F] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palmtree className="w-3.5 h-3.5" aria-hidden="true" />
                Resort Tropical
              </button>
              <button
                type="button"
                onClick={() => handleSelectPack('sports')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pack === 'sports'
                    ? 'bg-[#0B7A8F] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                Quadras &amp; Estádio
              </button>
              <button
                type="button"
                onClick={() => handleSelectPack('marina')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pack === 'marina'
                    ? 'bg-[#0B7A8F] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" aria-hidden="true" />
                Marina &amp; Barcos
              </button>
              <button
                type="button"
                onClick={() => handleSelectPack('aviation')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  pack === 'aviation'
                    ? 'bg-[#0B7A8F] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plane className="w-3.5 h-3.5" aria-hidden="true" />
                Aeroporto &amp; Aviões
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 font-mono tabular-nums">
              <span>{stats.meshes} malhas</span>
              <span aria-hidden="true">·</span>
              <span>{stats.triangles.toLocaleString('pt-BR')} triângulos</span>
            </div>
          </div>
        </div>

        {/* Full Unobstructed 3D Viewport with Collapsible Bottom Dock */}
        <div
          ref={viewportContainerRef}
          className="relative w-full h-[500px] sm:h-[580px] rounded-xl overflow-hidden border border-slate-300 bg-[#0B1E33]"
        >
          <div ref={canvasMountRef} className="w-full h-full" />

          {contextLost && (
            <div className="absolute inset-0 bg-[#0B1E33] text-white flex flex-col items-center justify-center p-6 text-center z-20">
              <Trophy className="w-8 h-8 text-[#F8B824] mb-2" aria-hidden="true" />
              <p className="font-semibold text-base">Contexto WebGL pausado pelo navegador</p>
              <p className="text-xs text-slate-300 mt-1">
                Você ainda pode baixar todos os modelos .glb diretamente pelos cartões abaixo.
              </p>
            </div>
          )}

          {/* Minimal Top-Left Asset Readout */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#0B1E33]/85 border border-white/15 rounded-lg px-3.5 py-2 text-white max-w-xs sm:max-w-sm">
            <p className="text-xs font-bold text-[#F8B824]">{activeMeta.label}</p>
            <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
              Arraste para girar · Scroll para zoom · Botão direito para mover
            </p>
          </div>

          {/* Collapsible Bottom Control Dock (No backdrop-filter over WebGL) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(940px,94%)] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockOpen((v) => !v)}
              className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B1E33]/92 border border-white/20 text-[11px] font-semibold text-slate-100 hover:text-white cursor-pointer"
            >
              {dockOpen ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  Ocultar Controles
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  Mostrar Controles
                </>
              )}
            </button>

            {dockOpen && (
              <div className="w-full bg-[#0B1E33]/92 border border-white/15 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 text-white shadow-lg">
                {/* Asset Selector Tabs for active pack */}
                <div
                  role="group"
                  aria-label="Selecionar modelo 3D"
                  className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-lg"
                >
                  {packAssets.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveAsset(item.id)}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeAsset === item.id
                          ? 'bg-[#F8B824] text-[#0B1E33]'
                          : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Scene Controls + GLB Export */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAnimating((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {animating ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        Animar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightingMode((m) => (m === 'day' ? 'sunset' : 'day'))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {lightingMode === 'day' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#F8B824]" aria-hidden="true" />
                        Dia
                      </>
                    ) : (
                      <>
                        <Sunset className="w-3.5 h-3.5 text-[#ff9f5a]" aria-hidden="true" />
                        Noite
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWireframe((w) => !w)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                      wireframe
                        ? 'bg-[#12B5CB] text-[#0B1E33]'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5" aria-hidden="true" />
                    Malha
                  </button>

                  <button
                    type="button"
                    disabled={exportingId === activeAsset}
                    onClick={() => handleExportGlb(activeAsset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-[#0B7A8F] hover:bg-[#12B5CB] hover:text-[#0B1E33] text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    {exportingId === activeAsset ? 'Exportando...' : 'Exportar .GLB'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Complete 3D Catalog — All 4 Packs Always Visible */}
        <div className="mt-8 space-y-8">
          {(
            [
              {
                packId: 'resort' as StudioPack,
                title: '01. Resort Tropical & Hotelaria',
                subtitle: 'Palace Resort, piscina com toboágua, bar tiki e bangalôs de praia',
              },
              {
                packId: 'sports' as StudioPack,
                title: '02. Quadras & Estádio de Esportes',
                subtitle: 'Arena municipal, quadra poliesportiva e quadra de tênis',
              },
              {
                packId: 'marina' as StudioPack,
                title: '03. Marina de Pesca & Barcos',
                subtitle: 'Cais de madeira, mercado do peixe, barcos pequenos e traineiras',
              },
              {
                packId: 'aviation' as StudioPack,
                title: '04. Aeroporto Tropical & Aviões',
                subtitle: 'Pista 09/27, torre com radar, terminal, avião comercial e hidroavião',
              },
            ] as const
          ).map((group) => {
            const items = ASSET_CATALOG.filter((item) => item.pack === group.packId);
            return (
              <div key={group.packId}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                  <h3 className="text-base font-bold text-[#0B1E33]">{group.title}</h3>
                  <span className="text-xs text-slate-500">{group.subtitle}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const isSelected = activeAsset === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#F0F9FB] border-[#0B7A8F]'
                            : 'bg-[#F6F8FA] border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="font-bold text-sm text-[#0B1E33]">{item.label}</h4>
                            {renderCardIcon(item.iconType)}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2">
                          <span className="text-[11px] font-mono text-slate-500 truncate">
                            {item.filename}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPack(item.pack);
                                setActiveAsset(item.id);
                                viewportContainerRef.current?.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'center',
                                });
                              }}
                              className="flex-1 py-1.5 px-2.5 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-[#0B1E33] rounded-md cursor-pointer whitespace-nowrap"
                            >
                              {isSelected ? 'Em Exibição' : 'Visualizar 3D'}
                            </button>
                            <button
                              type="button"
                              disabled={exportingId === item.id}
                              onClick={() => handleExportGlb(item.id)}
                              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs font-semibold bg-[#0B7A8F] hover:bg-[#096475] text-white rounded-md cursor-pointer whitespace-nowrap disabled:opacity-60"
                            >
                              <Download className="w-3.5 h-3.5" aria-hidden="true" />
                              {exportingId === item.id ? '...' : '.GLB'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Godot 4 3D Import & GDScript Animation Snippet */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-[#F6F8FA] border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#0B1E33] mb-2">
                Como importar os modelos .GLB no Godot 4
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
                <li>
                  1. Copie os arquivos{' '}
                  <span className="font-mono text-xs text-[#0B1E33]">.glb</span> para{' '}
                  <span className="font-mono text-xs text-[#0B1E33]">res://assets/3d/</span> no seu
                  projeto Godot 4.
                </li>
                <li>
                  2. Os modelos já exportam materiais PBR, texturas embutidas e pivô alinhado no
                  solo / linha da água (<span className="font-mono text-xs text-[#0B1E33]">Y = 0</span>).
                </li>
                <li>
                  3.{' '}
                  {pack === 'resort'
                    ? 'O hotel, a piscina, o bar tiki, os bangalôs e a lancha Resort_VIPCatamaran vêm organizados em nós separados para uso modular ou turismo.'
                    : pack === 'sports'
                      ? 'As bolas (MatchBall, BasketballBall, TennisBall), o placar e o dirigível MegaCity_SportsBlimp ficam em nós separados para eventos e jogos noturnos.'
                      : pack === 'marina'
                        ? 'Cada barco (MegaCity_SmallFishingBoat, MegaCity_LargeFishingTrawler) e suas hélices (PropellerSmall, PropellerMain) ficam em nós separados para animar.'
                        : 'Os nós RadarDish, PropellerLeft, PropellerRight e PropellerMain já vêm separados para animar em código.'}
                </li>
              </ul>
            </div>
            <p className="text-xs text-slate-500">
              {pack === 'resort'
                ? 'Dica: posicione o Resort Completo ou os Bangalôs na faixa costeira da ilha com o plano da água em Y = 0.'
                : pack === 'sports'
                  ? 'Dica: alterne a iluminação para "Noite" na barra do estúdio para testar o brilho dos refletores do estádio e do placar.'
                  : pack === 'marina'
                    ? 'Dica: posicione a Marina na borda costeira da sua ilha com o plano da água em Y = 0.'
                    : 'Dica: ative Generate Physics na importação do Godot para selecionar o aeroporto por clique.'}
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#0B1E33] text-slate-100 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-xs font-mono text-slate-300">{activeGdTitle}</span>
              <button
                type="button"
                onClick={handleCopyGd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedGd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#F8B824]" aria-hidden="true" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copiar GDScript
                  </>
                )}
              </button>
            </div>
            <pre className="p-5 text-xs sm:text-[13px] leading-relaxed font-mono overflow-x-auto text-slate-100 flex-1">
              <code>{activeGdScript}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
