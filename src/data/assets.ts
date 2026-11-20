export const MEGACITY_ASSETS = {
  bgDay: {
    id: 'bg-day',
    title: 'Fundo Principal — Dia Tropical',
    subtitle: 'Cenário 16:9 · Ilha, porto e Palácio Presidencial ao sol',
    src: '/src/assets/images/megacity_bg_day_1794969990317.jpg',
    filename: 'megacity_bg_dia_1920x1080.png',
    godotPath: 'res://assets/ui/bg_megacity_day.png',
    usage: 'Tela inicial padrão, campanha diurna e tela de carregamento.',
  },
  bgSunset: {
    id: 'bg-sunset',
    title: 'Fundo Alternativo — Noite de Eleição',
    subtitle: 'Cenário 16:9 · Pôr do sol dourado com fogos no palácio',
    src: '/src/assets/images/megacity_bg_sunset_1794969991721.jpg',
    filename: 'megacity_bg_eleicao_1920x1080.png',
    godotPath: 'res://assets/ui/bg_megacity_election.png',
    usage: 'Véspera de eleição, vitória eleitoral ou tema noturno desbloqueável.',
  },
  logoPrimary: {
    id: 'logo-primary',
    title: 'Logo Oficial MegaCity',
    subtitle: 'Logotipo pixel art com skyline, palmeiras e estrela presidencial',
    src: '/src/assets/images/megacity_logo_primary_1794969993313.jpg',
    filename: 'megacity_logo_transparente.png',
    godotPath: 'res://assets/ui/megacity_logo.png',
    usage: 'TextureRect principal no topo esquerdo ou centro do Menu Inicial.',
  },
  emblemIcon: {
    id: 'emblem-icon',
    title: 'Emblema Presidencial & Ícone',
    subtitle: 'Selo 1:1 · Ícone do executável Godot e brasão de governo',
    src: '/src/assets/images/megacity_emblem_icon_1794969993296.jpg',
    filename: 'megacity_icon_transparente.png',
    godotPath: 'res://icon.png',
    usage: 'Ícone oficial do projeto Godot 4, barra de tarefas e selo de decretos.',
  },
} as const;

export interface PaletteSwatch {
  name: string;
  hex: string;
  role: string;
  textLight: boolean;
}

export const MEGACITY_PALETTE: PaletteSwatch[] = [
  {
    name: 'Turquesa Caribe',
    hex: '#12B5CB',
    role: 'Oceano, destaques de HUD e progresso eleitoral',
    textLight: false,
  },
  {
    name: 'Ouro Presidencial',
    hex: '#F8B824',
    role: 'Tipografia da logo, medalhas e tesouro da ilha',
    textLight: false,
  },
  {
    name: 'Telhado Terracota',
    hex: '#D95B38',
    role: 'Arquitetura colonial, alertas suaves e fachadas',
    textLight: true,
  },
  {
    name: 'Verde Palmeira',
    hex: '#2E9E47',
    role: 'Vegetação tropical, aprovação positiva e ecologia',
    textLight: true,
  },
  {
    name: 'Areia Solar',
    hex: '#F5D78E',
    role: 'Praias, fundos de pergaminhos e decretos',
    textLight: false,
  },
  {
    name: 'Marinho Contorno',
    hex: '#0E2238',
    role: 'Contornos pixel art, sombras e painéis de UI',
    textLight: true,
  },
];

export const GODOT4_GDSCRIPT_SNIPPET = `extends Control

@onready var bg_day: TextureRect = $BgDay
@onready var bg_election: TextureRect = $BgElection
@onready var logo: TextureRect = $MenuPanel/LogoMegaCity

var is_election_eve: bool = false

func _ready() -> void:
\t# Garante pixels nítidos caso o filtro global não esteja em Nearest
\tlogo.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
\tbg_day.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
\tbg_election.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
\tbg_election.modulate.a = 0.0

func set_election_atmosphere(active: bool) -> void:
\tis_election_eve = active
\tvar tween := create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_CUBIC)
\ttween.tween_property(bg_election, "modulate:a", 1.0 if active else 0.0, 0.8)
`;
