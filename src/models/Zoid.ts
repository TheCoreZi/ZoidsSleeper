import type { Drop } from '../item/Drop';
import { ZiDataDrop } from '../item/ZiDataDrop';
import { Faction, getFactionBonus } from './Faction';
import { LevelType, levelFromExperience } from './LevelType';
import { TerrainType, getTerrainBonus } from './Terrain';

export const ZoidSize = {
  Colossal: 'colossal',
  XL: 'xl',
  L: 'l',
  M: 'm',
  S: 's',
  XS: 'xs',
} as const;

export type ZoidSize = (typeof ZoidSize)[keyof typeof ZoidSize];

/** A zoid owned by the player, tracking accumulated experience. */
export interface OwnedZoid {
  rebornBonusPercent?: number;
  copies?: number;
  experience: number;
  id: string;
}

export { ZoidResearchStatus } from './ZoidResearchStatus';

/** Static base template for a zoid species (attack, health, faction, price, etc.) */
export interface ZoidSpecies {
  id: string;
  name: string;
  attack: number;
  coreFragments: number;
  maxHealth: number;
  baseExp: number;
  scanRate: number;
  price: number;
  size: ZoidSize;
  faction: Faction;
  itemDrops?: Drop[];
  levelType: LevelType;
  terrainTypes: TerrainType[];
}

/** A live zoid in combat with mutable health. Extends CustomizedZoid. */
export interface SpawnedZoid extends CustomizedZoid {
  health: number;
}

/** Configuration to spawn an enemy: species id + level + optional stat overrides. */
export interface ZoidBlueprint {
  attackOverride?: number;
  bonusMultiplier?: number;
  id: string;
  imageOverride?: string;
  level: number;
  maxHealthOverride?: number;
  rebornBonusPercent?: number;
  scannable?: boolean;
}

/** Computed stats for a zoid at a specific level, built from a ZoidBlueprint. */
export interface CustomizedZoid {
  attack: number;
  id: string;
  imageOverride?: string;
  level: number;
  maxHealth: number;
  name: string;
  scannable: boolean;
}

export const ZOID_LIST: Record<string, ZoidSpecies> = {
  ancient_tortoise: { id: 'ancient_tortoise', name: 'Ancient Tortoise', attack: 180, maxHealth: 600, baseExp: 60, scanRate: -1, price: 15000, faction: Faction.Neutral, levelType: LevelType.Slow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1300, size: ZoidSize.S },
  aquadon: { id: 'aquadon', name: 'Aquadon', attack: 100, maxHealth: 80, baseExp: 50, scanRate: 65, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400, size: ZoidSize.S },
  barigator: { id: 'barigator', name: 'Barigator', attack: 160, maxHealth: 350, baseExp: 50, scanRate: 35, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1600, size: ZoidSize.M },
  barrage_tortoise: { id: 'barrage_tortoise', name: 'Barrage Tortoise', attack: 210, maxHealth: 1000, baseExp: 150, scanRate: -1, price: 200000, faction: Faction.Neutral, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1500, size: ZoidSize.M },
  bear_fighter: { id: 'bear_fighter', name: 'Bear Fighter', attack: 220, maxHealth: 500, baseExp: 80, scanRate: 35, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1800, size: ZoidSize.M },
  cannon_tortoise_bc: { id: 'cannon_tortoise_bc', name: 'Cannon Tortoise BC', attack: 230, maxHealth: 700, baseExp: 80, scanRate: 30, price: 0, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1500, size: ZoidSize.S },
  cannon_tortoise_os: { id: 'cannon_tortoise_os', name: 'Cannon Tortoise OS', attack: 200, maxHealth: 800, baseExp: 100, scanRate: -1, price: 50000, faction: Faction.Neutral, levelType: LevelType.Slow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 2000, size: ZoidSize.S },
  command_wolf: { id: 'command_wolf', name: 'Command Wolf', attack: 200, maxHealth: 250, baseExp: 50, scanRate: 35, price: 35000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M },
  command_wolf_desert: { id: 'command_wolf_desert', name: 'Command Wolf (Desert)', attack: 200, maxHealth: 250, baseExp: 50, scanRate: 35, price: 35000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M },
  crablaster: { id: 'crablaster', name: 'Crablaster', attack: 50, maxHealth: 140, baseExp: 20, scanRate: 75, price: 2500, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400, size: ZoidSize.XS },
  dcsj: { id: 'dcsj', name: 'Shield Liger DCS-J', attack: 320, maxHealth: 600, baseExp: 150, scanRate: 20, price: 150000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L },
  dragon_horse: { id: 'dragon_horse', name: 'Dragon Horse', attack: 20, maxHealth: 70, baseExp: 20, scanRate: 50, price: 1000, faction: Faction.Neutral, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 250, size: ZoidSize.XS },
  elephantus: { id: 'elephantus', name: 'Elephantus', attack: 100, maxHealth: 200, baseExp: 80, scanRate: 30, price: 20000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.M },
  garius: { id: 'garius', name: 'Garius', attack: 50, maxHealth: 100, baseExp: 50, scanRate: 40, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.S },
  gator: { id: 'gator', name: 'Gator', attack: 150, maxHealth: 200, baseExp: 35, scanRate: 60, price: 4000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.S },
  gator_radome: { id: 'gator_radome', name: 'Gator Radome', attack: 150, maxHealth: 350, baseExp: 45, scanRate: 50, price: 8000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1500, size: ZoidSize.S },
  geruder: { id: 'geruder', name: 'Geruder', attack: 160, maxHealth: 450, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fluctuating, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.M },
  giraffsworder: { id: 'giraffsworder', name: 'Girafsworder', attack: 160, maxHealth: 150, baseExp: 35, scanRate: 45, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS },
  glidoler: { id: 'glidoler', name: 'Glidoler', attack: 100, maxHealth: 40, baseExp: 50, scanRate: 40, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air, TerrainType.Land, TerrainType.Water], coreFragments: 1000, size: ZoidSize.S },
  gorgodos: { id: 'gorgodos', name: 'Gorgodos', attack: 140, maxHealth: 400, baseExp: 50, scanRate: 35, price: 12000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.M },
  gunbeetle: { id: 'gunbeetle', name: 'Gunbeetle', attack: 120, maxHealth: 200, baseExp: 35, scanRate: 45, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS },
  gurantula: { id: 'gurantula', name: 'Gurantula', attack: 120, maxHealth: 300, baseExp: 35, scanRate: -1, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS },
  guysack: { id: 'guysack', name: 'Guysack', attack: 170, maxHealth: 400, baseExp: 45, scanRate: -1, price: 8000, faction: Faction.HelicRepublic, itemDrops: [new ZiDataDrop('gurantula', 30)], levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.S },
  hammerrock: { id: 'hammerrock', name: 'Hammerrock', attack: 220, maxHealth: 450, baseExp: 80, scanRate: 25, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.S },
  helcat: { id: 'helcat', name: 'Helcat', attack: 160, maxHealth: 250, baseExp: 50, scanRate: 40, price: 25000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.S },
  helcat_stray: { id: 'helcat_stray', name: 'Stray Helcat', attack: 200, maxHealth: 250, baseExp: 70, scanRate: 30, price: 50000, faction: Faction.Neutral, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.M },
  heldigunner: { id: 'heldigunner', name: 'Heldigunner', attack: 200, maxHealth: 400, baseExp: 70, scanRate: 35, price: 30000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M },
  helldiver: { id: 'helldiver', name: 'Helldiver', attack: 170, maxHealth: 90, baseExp: 20, scanRate: 70, price: 3000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 600, size: ZoidSize.XS },
  hidocker: { id: 'hidocker', name: 'Hidocker', attack: 90, maxHealth: 250, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L },
  hyperscissors: { id: 'hyperscissors', name: 'Hyperscissors', attack: 40, maxHealth: 150, baseExp: 20, scanRate: 75, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400, size: ZoidSize.XS },
  iron_kong: { id: 'iron_kong', name: 'Iron Kong', attack: 350, maxHealth: 1200, baseExp: 200, scanRate: 10, price: 200000, faction: Faction.GuylosEmpire, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 3000, size: ZoidSize.XL },
  malder: { id: 'malder', name: 'Malder', attack: 20, maxHealth: 700, baseExp: 70, scanRate: 50, price: 6000, faction: Faction.ZenebasEmpire, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.S },
  merda: { id: 'merda', name: 'Merda', attack: 50, maxHealth: 100, baseExp: 20, scanRate: 80, price: 2000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 400, size: ZoidSize.XS },
  missile_tortoise: { id: 'missile_tortoise', name: 'Missile Tortoise', attack: 180, maxHealth: 500, baseExp: 60, scanRate: 40, price: 15000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1400, size: ZoidSize.S },
  molga: { id: 'molga', name: 'Molga', attack: 100, maxHealth: 400, baseExp: 50, scanRate: 40, price: 20000, faction: Faction.GuylosEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.S },
  red_horn: { id: 'red_horn', name: 'Red Horn', attack: 280, maxHealth: 800, baseExp: 120, scanRate: 20, price: 150000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L },
  redler: { id: 'redler', name: 'Redler', attack: 210, maxHealth: 150, baseExp: 70, scanRate: 30, price: 42000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air], coreFragments: 1600, size: ZoidSize.M },
  saber_tiger: { id: 'saber_tiger', name: 'Saber Tiger', attack: 300, maxHealth: 450, baseExp: 100, scanRate: 25, price: 100000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.L },
  saber_tiger_gs: { id: 'saber_tiger_gs', name: 'Saber Tiger GS', attack: 350, maxHealth: 650, baseExp: 150, scanRate: -1, price: 160000, faction: Faction.Neutral, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L },
  saber_tiger_rs: { id: 'saber_tiger_rs', name: 'Saber Tiger RS', attack: 320, maxHealth: 500, baseExp: 150, scanRate: -1, price: 150000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L },
  sea_batoras: { id: 'sea_batoras', name: 'Sea Batoras', attack: 50, maxHealth: 180, baseExp: 20, scanRate: 70, price: 2500, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400, size: ZoidSize.XS },
  sea_panther: { id: 'sea_panther', name: 'Sea Panther', attack: 90, maxHealth: 400, baseExp: 50, scanRate: 40, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1400, size: ZoidSize.M },
  shield_liger: { id: 'shield_liger', name: 'Shield Liger', attack: 250, maxHealth: 600, baseExp: 100, scanRate: 25, price: 100000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.L },
  sinker: { id: 'sinker', name: 'Sinker', attack: 180, maxHealth: 120, baseExp: 40, scanRate: 40, price: 20000, faction: Faction.GuylosEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Air, TerrainType.Water], coreFragments: 1200, size: ZoidSize.S },
  spiker: { id: 'spiker', name: 'Spiker', attack: 150, maxHealth: 180, baseExp: 35, scanRate: 55, price: 5000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS },
  stealth_viper: { id: 'stealth_viper', name: 'Stealth Viper', attack: 180, maxHealth: 200, baseExp: 45, scanRate: 40, price: 25000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M },
  cannon_tortoise: { id: 'cannon_tortoise', name: 'Cannon Tortoise', attack: 160, maxHealth: 500, baseExp: 50, scanRate: 40, price: 8000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1300, size: ZoidSize.S },
  zatton: { id: 'zatton', name: 'Zatton', attack: 120, maxHealth: 350, baseExp: 40, scanRate: 40, price: 10000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.M },
};

export function calculatePartyAttack(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral, terrain: TerrainType = TerrainType.Land): number {
  return party.reduce((sum, z) => {
    const species = getZoidById(z.id);
    const factionBonus = getFactionBonus(playerFaction, species.faction);
    const built = buildZoid({ bonusMultiplier: factionBonus, id: z.id, level: getOwnedZoidLevel(z), rebornBonusPercent: z.rebornBonusPercent });
    const terrainBonus = getTerrainBonus(terrain, species.terrainTypes);
    return sum + Math.floor(built.attack * terrainBonus);
  }, 0);
}

export function calculatePartyMaxHealth(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral): number {
  return party.reduce((sum, z) => {
    const bonus = getFactionBonus(playerFaction, getZoidById(z.id).faction);
    return sum + buildZoid({ bonusMultiplier: bonus, id: z.id, level: getOwnedZoidLevel(z), rebornBonusPercent: z.rebornBonusPercent }).maxHealth;
  }, 0);
}

export function calculateStat(baseStat: number, level: number, bonusMultiplier = 1): number {
  return Math.max(1, Math.floor(baseStat * (level / 100) * bonusMultiplier));
}

export function spawnZoid(stats: CustomizedZoid): SpawnedZoid {
  return { ...stats, health: stats.maxHealth };
}

export function getOwnedZoidLevel(owned: OwnedZoid): number {
  const data = getZoidById(owned.id);
  return levelFromExperience(owned.experience, data.levelType);
}

export function getZoidById(id: string): ZoidSpecies {
  const zoid = ZOID_LIST[id];
  if (!zoid) {throw new Error(`Unknown Zoid: ${id}`);}
  return zoid;
}

export function getZoidImage(id: string, imageOverride?: string): string {
  return `images/zoids/${imageOverride ?? id}.png`;
}

export function buildZoid({ attackOverride, bonusMultiplier = 1, id, imageOverride, level, maxHealthOverride, rebornBonusPercent = 0, scannable = true }: ZoidBlueprint): CustomizedZoid {
  const base = getZoidById(id);
  const rebornMultiplier = 1 + rebornBonusPercent / 100;
  return {
    attack: attackOverride ?? Math.floor(calculateStat(base.attack, level, bonusMultiplier) * rebornMultiplier),
    id: base.id,
    imageOverride,
    level,
    maxHealth: maxHealthOverride ?? Math.floor(calculateStat(base.maxHealth, level, bonusMultiplier) * rebornMultiplier),
    name: base.name,
    scannable,
  };
}

export interface PartyData {
  commanderZoidId: string;
  zoids: OwnedZoid[];
}

export const DEFAULT_PARTY: PartyData = { commanderZoidId: '', zoids: [] };
