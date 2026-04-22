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
}

export const FACTIONS: Record<Faction, FactionData> = {
  [Faction.DarkArmy]: { color: '#2a942f', id: Faction.DarkArmy },
  [Faction.GuylosEmpire]: { color: '#da1919', id: Faction.GuylosEmpire },
  [Faction.HelicRepublic]: { color: '#3192d2', id: Faction.HelicRepublic },
  [Faction.Neutral]: { color: '#9e9e9e', id: Faction.Neutral },
  [Faction.NeoZenebas]: { color: '#cfd8dc', id: Faction.NeoZenebas },
  [Faction.ZenebasEmpire]: { color: '#6e1d1d', id: Faction.ZenebasEmpire },
};

const FACTION_BONUS_TABLE: Record<Faction, Record<Faction, number>> = {
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

export function getFactionBonus(playerFaction: Faction, zoidFaction: Faction): number {
  return FACTION_BONUS_TABLE[playerFaction][zoidFaction];
}
