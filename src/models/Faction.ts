export const Faction = {
  DarkArmy: 'dark_army',
  GuylosEmpire: 'guylos_empire',
  HelicRepublic: 'helic_republic',
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
  [Faction.NeoZenebas]: { color: '#cfd8dc', id: Faction.NeoZenebas },
  [Faction.ZenebasEmpire]: { color: '#6e1d1d', id: Faction.ZenebasEmpire },
};
