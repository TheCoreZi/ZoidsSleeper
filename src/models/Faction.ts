export const Faction = {
  DarkArmy: 'dark_army',
  GuylosEmpire: 'guylos_empire',
  HelicRepublic: 'helic_republic',
  Neutral: 'neutral',
  NeoZenebas: 'neo_zenebas',
  ZenebasEmpire: 'zenebas_empire',
} as const;

export type Faction = (typeof Faction)[keyof typeof Faction];

export interface FactionData {
  color: string;
  id: Faction;
  image: string;
}

export const FACTIONS: Record<Faction, FactionData> = {
  [Faction.DarkArmy]: { color: '#2a942f', id: Faction.DarkArmy, image: 'images/faction/dark_army.png' },
  [Faction.GuylosEmpire]: { color: '#da1919', id: Faction.GuylosEmpire, image: 'images/faction/guylos.png' },
  [Faction.HelicRepublic]: { color: '#3192d2', id: Faction.HelicRepublic, image: 'images/faction/helic.png' },
  [Faction.Neutral]: { color: '#7b1fa2', id: Faction.Neutral, image: 'images/faction/neutral.png' },
  [Faction.NeoZenebas]: { color: '#8890a0', id: Faction.NeoZenebas, image: 'images/faction/neo_zenebas.png' },
  [Faction.ZenebasEmpire]: { color: '#8b2020', id: Faction.ZenebasEmpire, image: 'images/faction/zenebas.png' },
};

export const ALL_FACTIONS: Faction[] = Object.values(Faction);

export const FACTION_BONUS_TABLE: Record<Faction, Record<Faction, number>> = {
  [Faction.DarkArmy]: {
    [Faction.DarkArmy]: 1.20, [Faction.GuylosEmpire]: 1.05, [Faction.HelicRepublic]: 0.85,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 0.85, [Faction.ZenebasEmpire]: 1.05,
  },
  [Faction.GuylosEmpire]: {
    [Faction.DarkArmy]: 1.10, [Faction.GuylosEmpire]: 1.25, [Faction.HelicRepublic]: 0.90,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 0.85, [Faction.ZenebasEmpire]: 0.95,
  },
  [Faction.HelicRepublic]: {
    [Faction.DarkArmy]: 0.90, [Faction.GuylosEmpire]: 0.95, [Faction.HelicRepublic]: 1.30,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 0.90, [Faction.ZenebasEmpire]: 0.95,
  },
  [Faction.Neutral]: {
    [Faction.DarkArmy]: 1, [Faction.GuylosEmpire]: 1, [Faction.HelicRepublic]: 1,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 1, [Faction.ZenebasEmpire]: 1,
  },
  [Faction.NeoZenebas]: {
    [Faction.DarkArmy]: 0.85, [Faction.GuylosEmpire]: 0.95, [Faction.HelicRepublic]: 0.90,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 1.25, [Faction.ZenebasEmpire]: 1.15,
  },
  [Faction.ZenebasEmpire]: {
    [Faction.DarkArmy]: 0.85, [Faction.GuylosEmpire]: 0.95, [Faction.HelicRepublic]: 0.90,
    [Faction.Neutral]: 1, [Faction.NeoZenebas]: 1.15, [Faction.ZenebasEmpire]: 1.25,
  },
};

export interface FactionTheme {
  accent: string;
  accentHover: string;
  accentRgb: string;
  accentSubtle: string;
  border: string;
  buttonBg: string;
  buttonHover: string;
  deepBg: string;
  panelBg: string;
  panelBgRgb: string;
  surfaceBg: string;
  tooltipBg: string;
}

export const FACTION_THEMES: Record<Faction, FactionTheme> = {
  [Faction.DarkArmy]: {
    accent: '#2edd6f', accentHover: '#6aef9a', accentRgb: '46 221 111',
    accentSubtle: '#26b85c', border: '#0f4420', buttonBg: '#0f4420', buttonHover: '#1a6633',
    deepBg: '#061208', panelBg: '#132e1a', panelBgRgb: '19 46 26', surfaceBg: '#0e220f', tooltipBg: '#0b2412',
  },
  [Faction.GuylosEmpire]: {
    accent: '#ff4c4c', accentHover: '#ff7a7a', accentRgb: '255 76 76',
    accentSubtle: '#e04040', border: '#5c1010', buttonBg: '#5c1010', buttonHover: '#7a1a1a',
    deepBg: '#120608', panelBg: '#2e1216', panelBgRgb: '46 18 22', surfaceBg: '#220a0e', tooltipBg: '#2a0d12',
  },
  [Faction.HelicRepublic]: {
    accent: '#00d4ff', accentHover: '#5be0ff', accentRgb: '0 212 255',
    accentSubtle: '#4fc3f7', border: '#0f3460', buttonBg: '#0f3460', buttonHover: '#1a4a8a',
    deepBg: '#0a0a1a', panelBg: '#16213e', panelBgRgb: '22 33 62', surfaceBg: '#1a1a2e', tooltipBg: '#0d1b36',
  },
  [Faction.Neutral]: {
    accent: '#b388c9', accentHover: '#d1a8e0', accentRgb: '179 136 201',
    accentSubtle: '#c090d8', border: '#3a1060', buttonBg: '#3a1060', buttonHover: '#501880',
    deepBg: '#0a0410', panelBg: '#150c22', panelBgRgb: '21 12 34', surfaceBg: '#110a1c', tooltipBg: '#180d28',
  },
  [Faction.NeoZenebas]: {
    accent: '#e0e0e0', accentHover: '#f0f0f0', accentRgb: '224 224 224',
    accentSubtle: '#aaaaaa', border: '#303238', buttonBg: '#303238', buttonHover: '#424550',
    deepBg: '#08090c', panelBg: '#14161c', panelBgRgb: '20 22 28', surfaceBg: '#0f1016', tooltipBg: '#111318',
  },
  [Faction.ZenebasEmpire]: {
    accent: '#a0a0a0', accentHover: '#c0c0c0', accentRgb: '160 160 160',
    accentSubtle: '#b0b0b0', border: '#4a1515', buttonBg: '#4a1515', buttonHover: '#6a2020',
    deepBg: '#10060a', panelBg: '#2a1218', panelBgRgb: '42 18 24', surfaceBg: '#200c10', tooltipBg: '#250e14',
  },
};

export function getFactionBonus(playerFaction: Faction, zoidFaction: Faction): number {
  return FACTION_BONUS_TABLE[playerFaction][zoidFaction];
}
