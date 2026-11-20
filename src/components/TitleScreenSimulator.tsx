import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowLeft,
  Download,
  Coins,
  Users,
  Vote,
  Trees,
  Building2,
  Hammer,
  Landmark,
} from 'lucide-react';
import { MEGACITY_ASSETS } from '../data/assets';
import { soundFx } from '../utils/soundFx';
import { triggerDataDownload } from '../utils/pixelKeying';

type BgTheme = 'day' | 'sunset';
type SimScreen = 'menu' | 'factions' | 'new_island' | 'settings';

interface FactionState {
  id: string;
  name: string;
  approval: number;
  statusLabel: string;
}

interface TitleScreenSimulatorProps {
  transparentLogoUrl: string | null;
  transparentEmblemUrl: string | null;
  logoExtracting: boolean;
}

const INITIAL_FACTIONS: FactionState[] = [
  { id: 'capitalists', name: 'Capitalistas', approval: 78, statusLabel: 'Satisfeitos' },
  { id: 'ecologists', name: 'Ecologistas', approval: 64, statusLabel: 'Atentos' },
  { id: 'unionists', name: 'Sindicalistas', approval: 71, statusLabel: 'Apoiadores' },
  { id: 'traditionalists', name: 'Tradicionalistas', approval: 69, statusLabel: 'Estáveis' },
];

const ISLAND_ARCHETYPES = [
  {
    id: 'archipelago',
    name: 'Arquipélago Dourado',
    economy: 'Turismo & Exportação Naval',
    difficulty: 'Equilibrada',
    bonus: '+15% receita portuária',
  },
  {
    id: 'volcano',
    name: 'Baía do Vulcão',
    economy: 'Mineração & Energia Geotérmica',
    difficulty: 'Desafiadora',
    bonus: '+25% produção industrial',
  },
  {
    id: 'emerald',
    name: 'Porto Esmeralda',
    economy: 'Agricultura Tropical & Comércio',
    difficulty: 'Amigável',
    bonus: '+10% aprovação inicial',
  },
];

function getStatusText(score: number): string {
  if (score >= 75) return 'Muito Satisfeitos';
  if (score >= 60) return 'Apoiadores';
  if (score >= 45) return 'Divididos';
  return 'Em Protesto';
}

export function TitleScreenSimulator({
  transparentLogoUrl,
  transparentEmblemUrl,
  logoExtracting,
}: TitleScreenSimulatorProps) {
  const [bgTheme, setBgTheme] = useState<BgTheme>('day');
  const [showHud, setShowHud] = useState(true);
  const [showLogoOnly, setShowLogoOnly] = useState(false);
  const [simScreen, setSimScreen] = useState<SimScreen>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [treasury, setTreasury] = useState(48500);
  const [factions, setFactions] = useState<FactionState[]>(INITIAL_FACTIONS);
  const [selectedIsland, setSelectedIsland] = useState(ISLAND_ARCHETYPES[0].id);
  const [lastDecreeNote, setLastDecreeNote] = useState<string>(
    'Mandato em andamento · Eleições previstas para 14 meses.',
  );
  const [pixelFilterMode, setPixelFilterMode] = useState<'Nearest' | 'Linear'>('Nearest');

  const overallApproval = Math.round(
    factions.reduce((acc, item) => acc + item.approval, 0) / factions.length,
  );

  const activeBg = bgTheme === 'day' ? MEGACITY_ASSETS.bgDay.src : MEGACITY_ASSETS.bgSunset.src;

  const toggleSound = () => {
    const next = !soundEnabled;
    soundFx.enabled = next;
    setSoundEnabled(next);
    if (next) soundFx.playBlip(640);
  };

  const handleNavScreen = (screen: SimScreen) => {
    soundFx.playConfirm();
    setSimScreen(screen);
  };

  const enactDecree = (
    title: string,
    cost: number,
    deltas: Record<string, number>,
  ) => {
    if (treasury < cost) {
      soundFx.playBlip(220, 0.1);
      setLastDecreeNote('Tesouro insuficiente para aprovar este decreto.');
      return;
    }
    soundFx.playConfirm();
    setTreasury((prev) => prev - cost);
    setFactions((prev) =>
      prev.map((f) => {
        const nextVal = Math.max(15, Math.min(99, f.approval + (deltas[f.id] ?? 0)));
        return {
          ...f,
          approval: nextVal,
          statusLabel: getStatusText(nextVal),
        };
      }),
    );
    setLastDecreeNote(`Decreto assinado: ${title}. Pesquisa eleitoral atualizada.`);
  };

  const resetMandate = () => {
    soundFx.playBlip(580);
    setTreasury(48500);
    setFactions(INITIAL_FACTIONS);
    setLastDecreeNote('Mandato reiniciado · Eleições previstas para 14 meses.');
  };

  return (
    <section id="simulador" className="pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#0B7A8F] mb-2">
              Prévia interativa em tempo real · Godot 4
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0B1E33] leading-[1.12] [text-wrap:balance]">
              Arte Pixel Art e Identidade Visual de MegaCity
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Teste a combinação entre os fundos tropicais em 16-bit e a logo com transparência
              recortada antes de importar os arquivos na sua cena principal do Godot 4.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Clima do cenário"
              className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-lg"
            >
              <button
                type="button"
                onClick={() => {
                  soundFx.playBlip(560);
                  setBgTheme('day');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  bgTheme === 'day'
                    ? 'bg-[#0B7A8F] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                Dia Tropical
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playBlip(440);
                  setBgTheme('sunset');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  bgTheme === 'sunset'
                    ? 'bg-[#0B1E33] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                Noite de Eleição
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playBlip(520);
                setShowHud((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showHud ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  Ocultar Menu
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  Mostrar Menu
                </>
              )}
            </button>

            {showHud && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playBlip(490);
                  setShowLogoOnly((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {showLogoOnly ? 'Exibir Botões' : 'Somente Logo'}
              </button>
            )}

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'}
              className="inline-flex items-center justify-center w-9 h-9 bg-white border border-slate-200 text-slate-700 hover:text-slate-950 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* 16:9 Godot 4 Viewport Simulator */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300 bg-[#0B1E33] shadow-sm">
          <img
            src={activeBg}
            alt={
              bgTheme === 'day'
                ? 'Fundo pixel art diurno da ilha tropical de MegaCity'
                : 'Fundo pixel art noturno de eleição em MegaCity'
            }
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              pixelFilterMode === 'Nearest' ? 'pixelated' : ''
            }`}
          />

          {/* Measured left-side contrast scrim when menu is visible */}
          {showHud && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#071626]/70 via-[#071626]/25 to-transparent pointer-events-none"
            />
          )}

          {/* In-Game Menu & Logo Overlay */}
          {showHud && (
            <div className="absolute inset-0 p-4 sm:p-8 lg:p-10 flex flex-col justify-between">
              {/* Top Mini-HUD inside viewport */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-48 sm:w-64 md:w-80 lg:w-[360px]">
                  {transparentLogoUrl ? (
                    <img
                      src={transparentLogoUrl}
                      alt="Logo MegaCity em pixel art"
                      referrerPolicy="no-referrer"
                      className={`w-full h-auto drop-shadow-[0_6px_12px_rgba(7,22,38,0.65)] ${
                        pixelFilterMode === 'Nearest' ? 'pixelated' : ''
                      }`}
                    />
                  ) : (
                    <div className="h-24 flex items-center text-white/90 text-sm font-semibold">
                      {logoExtracting ? 'Recortando transparência da logo...' : 'Logo MegaCity'}
                    </div>
                  )}
                </div>

                {/* Compact Presidential Seal + Election Countdown */}
                {!showLogoOnly && (
                  <div className="hidden sm:flex items-center gap-3 bg-[#091C2E]/85 backdrop-blur-sm border border-[#F8B824]/40 rounded-lg px-3.5 py-2 text-white">
                    {transparentEmblemUrl && (
                      <img
                        src={transparentEmblemUrl}
                        alt="Emblema Presidencial MegaCity"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 pixelated shrink-0"
                      />
                    )}
                    <div className="text-xs leading-snug">
                      <p className="font-semibold text-[#F8B824]">
                        Aprovação {overallApproval}% · Tesouro ${treasury.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-slate-200">Godot 4.3 · Filtro {pixelFilterMode}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom/Left Interactive Game Menu Area */}
              {!showLogoOnly && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  {simScreen === 'menu' && (
                    <nav
                      aria-label="Menu simulado do jogo MegaCity"
                      className="w-full max-w-xs flex flex-col gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => handleNavScreen('new_island')}
                        onMouseEnter={() => soundFx.playBlip(580, 0.03)}
                        className="w-full text-left px-4 py-2.5 rounded-lg bg-[#F8B824] hover:bg-[#ffc63d] text-[#0B1E33] font-bold text-sm tracking-tight border-2 border-[#0B1E33] shadow-[0_3px_0_#0B1E33] active:translate-y-0.5 transition-transform cursor-pointer flex items-center justify-between"
                      >
                        <span>Nova Ilha</span>
                        <span className="text-xs font-semibold opacity-80">Campanha</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavScreen('factions')}
                        onMouseEnter={() => soundFx.playBlip(540, 0.03)}
                        className="w-full text-left px-4 py-2.5 rounded-lg bg-[#0D2842]/90 hover:bg-[#14395C] text-white font-semibold text-sm border border-white/20 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Conselho &amp; Facções</span>
                        <span className="text-xs text-[#F8B824] font-mono tabular-nums">
                          {overallApproval}%
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavScreen('settings')}
                        onMouseEnter={() => soundFx.playBlip(500, 0.03)}
                        className="w-full text-left px-4 py-2.5 rounded-lg bg-[#0D2842]/90 hover:bg-[#14395C] text-white font-semibold text-sm border border-white/20 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Configurações Godot</span>
                        <span className="text-xs text-slate-300 font-mono">{pixelFilterMode}</span>
                      </button>
                    </nav>
                  )}

                  {simScreen === 'factions' && (
                    <div className="w-full max-w-2xl bg-[#091C2E]/92 backdrop-blur-md border border-[#F8B824]/45 rounded-xl p-4 sm:p-5 text-white">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <h2 className="text-base font-bold text-[#F8B824]">
                            Conselho da Ilha &amp; Pesquisa Eleitoral
                          </h2>
                          <p className="text-xs text-slate-300">{lastDecreeNote}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playBlip(420);
                            setSimScreen('menu');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          Voltar
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                        {factions.map((f) => (
                          <div
                            key={f.id}
                            className="bg-white/5 border border-white/10 rounded-lg p-2.5"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-100 truncate">{f.name}</span>
                              <span className="font-mono font-bold text-[#F8B824] tabular-nums">
                                {f.approval}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-[#12B5CB] transition-all duration-200"
                                style={{ width: `${f.approval}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-300">{f.statusLabel}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              enactDecree('Incentivo Portuário (-$4.000)', 4000, {
                                capitalists: 10,
                                unionists: 4,
                                ecologists: -6,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#12B5CB]/20 hover:bg-[#12B5CB]/35 border border-[#12B5CB]/40 rounded-md cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Subvencionar Porto
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              enactDecree('Reserva Tropical (-$3.500)', 3500, {
                                ecologists: 14,
                                traditionalists: 5,
                                capitalists: -5,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#2E9E47]/25 hover:bg-[#2E9E47]/40 border border-[#2E9E47]/50 rounded-md cursor-pointer"
                          >
                            <Trees className="w-3.5 h-3.5" aria-hidden="true" />
                            Criar Parque Verde
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              enactDecree('Comício na Praça (-$2.500)', 2500, {
                                unionists: 9,
                                traditionalists: 8,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#F8B824]/20 hover:bg-[#F8B824]/35 border border-[#F8B824]/45 rounded-md cursor-pointer"
                          >
                            <Vote className="w-3.5 h-3.5" aria-hidden="true" />
                            Discurso Eleitoral
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={resetMandate}
                          className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                        >
                          Resetar
                        </button>
                      </div>
                    </div>
                  )}

                  {simScreen === 'new_island' && (
                    <div className="w-full max-w-2xl bg-[#091C2E]/92 backdrop-blur-md border border-[#12B5CB]/45 rounded-xl p-4 sm:p-5 text-white">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className="text-base font-bold text-[#F8B824]">
                          Escolher Ilha para Governar
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playBlip(420);
                            setSimScreen('menu');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          Voltar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {ISLAND_ARCHETYPES.map((island) => {
                          const active = selectedIsland === island.id;
                          return (
                            <button
                              key={island.id}
                              type="button"
                              onClick={() => {
                                soundFx.playConfirm();
                                setSelectedIsland(island.id);
                              }}
                              className={`text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                                active
                                  ? 'bg-[#12B5CB]/25 border-[#F8B824] text-white'
                                  : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                              }`}
                            >
                              <p className="font-bold text-sm mb-1">{island.name}</p>
                              <p className="text-xs text-slate-300 mb-1.5">{island.economy}</p>
                              <p className="text-[11px] font-mono text-[#F8B824]">{island.bonus}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {simScreen === 'settings' && (
                    <div className="w-full max-w-md bg-[#091C2E]/92 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-5 text-white">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className="text-base font-bold text-[#F8B824]">
                          Renderização Pixel Art (Godot 4)
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playBlip(420);
                            setSimScreen('menu');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          Voltar
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">
                        Compare a nitidez da filtragem <span className="font-mono">Nearest</span>{' '}
                        contra <span className="font-mono">Linear</span> diretamente sobre a arte.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playConfirm();
                            setPixelFilterMode('Nearest');
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                            pixelFilterMode === 'Nearest'
                              ? 'bg-[#F8B824] text-[#0B1E33] border-[#F8B824]'
                              : 'bg-white/5 text-white border-white/20'
                          }`}
                        >
                          Nearest (Pixel Nítido)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playBlip(400);
                            setPixelFilterMode('Linear');
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                            pixelFilterMode === 'Linear'
                              ? 'bg-[#F8B824] text-[#0B1E33] border-[#F8B824]'
                              : 'bg-white/5 text-white border-white/20'
                          }`}
                        >
                          Linear (Suavizado)
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="hidden lg:flex items-center gap-4 text-xs text-white/85 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-[#F8B824]" aria-hidden="true" />
                      Governo da Ilha
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-[#12B5CB]" aria-hidden="true" />
                      Construção Urbana
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-[#F8B824]" aria-hidden="true" />
                      Economia &amp; Porto
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#12B5CB]" aria-hidden="true" />
                      Eleições Democráticas
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom caption bar under viewport */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>Proporção 16:9</span>
            <span aria-hidden="true">·</span>
            <span>Espaço livre à esquerda pensado para o Menu do Godot</span>
            <span aria-hidden="true">·</span>
            <span>
              Cena ativa: {bgTheme === 'day' ? 'Dia Tropical' : 'Noite de Eleição'}
            </span>
          </div>
          {transparentLogoUrl && (
            <button
              type="button"
              onClick={() =>
                triggerDataDownload(transparentLogoUrl, MEGACITY_ASSETS.logoPrimary.filename)
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B7A8F] hover:text-[#085a6a] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Baixar Logo PNG Transparente
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
