import type { Drop } from '../item/Drop';
import { ZiDataDrop } from '../item/ZiDataDrop';
import { Faction, getFactionBonus } from './Faction';
import { LevelType, levelFromExperience } from './LevelType';
import { TerrainType, getTerrainBonus } from './Terrain';

/** A zoid owned by the player, tracking accumulated experience. */
export interface OwnedZoid {
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
  aquadon: { id: 'aquadon', name: 'Aquadon', attack: 70, maxHealth: 80, baseExp: 10, scanRate: 65, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400 },
  barigator: { id: 'barigator', name: 'Barigator', attack: 130, maxHealth: 250, baseExp: 50, scanRate: 25, price: 20000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1200 },
  command_wolf: { id: 'command_wolf', name: 'Command Wolf', attack: 200, maxHealth: 200, baseExp: 50, scanRate: 15, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000 },
  command_wolf_desert: { id: 'command_wolf_desert', name: 'Command Wolf (Desert)', attack: 200, maxHealth: 200, baseExp: 50, scanRate: 15, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000 },
  crablaster: { id: 'crablaster', name: 'Crablaster', attack: 40, maxHealth: 60, baseExp: 20, scanRate: 80, price: 3000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400 },
  dcsj: { id: 'dcsj', name: 'Shield Liger DCS-J', attack: 320, maxHealth: 800, baseExp: 200, scanRate: 10, price: 150000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 2500 },
  dragon_horse: { id: 'dragon_horse', name: 'Dragon Horse', attack: 20, maxHealth: 80, baseExp: 20, scanRate: 80, price: 1000, faction: Faction.Neutral, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 250 },
  elephantus: { id: 'elephantus', name: 'Elephantus', attack: 100, maxHealth: 200, baseExp: 15, scanRate: 10, price: 50000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500 },
  garius: { id: 'garius', name: 'Garius', attack: 50, maxHealth: 100, baseExp: 10, scanRate: 10, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1000 },
  gator: { id: 'gator', name: 'Gator', attack: 150, maxHealth: 200, baseExp: 35, scanRate: 60, price: 4000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 600 },
  geruder: { id: 'geruder', name: 'Geruder', attack: 160, maxHealth: 450, baseExp: 50, scanRate: 20, price: 35000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fluctuating, terrainTypes: [TerrainType.Land], coreFragments: 1600 },
  giraffsworder: { id: 'giraffsworder', name: 'Girafsworder', attack: 180, maxHealth: 150, baseExp: 35, scanRate: 40, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800 },
  glidoler: { id: 'glidoler', name: 'Glidoler', attack: 100, maxHealth: 40, baseExp: 10, scanRate: 10, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air, TerrainType.Land, TerrainType.Water], coreFragments: 1000 },
  gorgodos: { id: 'gorgodos', name: 'Gorgodos', attack: 140, maxHealth: 400, baseExp: 50, scanRate: 20, price: 12000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 1000 },
  gunbeetle: { id: 'gunbeetle', name: 'Gunbeetle', attack: 120, maxHealth: 200, baseExp: 35, scanRate: 40, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800 },
  gurantula: { id: 'gurantula', name: 'Gurantula', attack: 120, maxHealth: 300, baseExp: 35, scanRate: -1, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 600 },
  guysack: { id: 'guysack', name: 'Guysack', attack: 180, maxHealth: 500, baseExp: 45, scanRate: -1, price: 20000, faction: Faction.HelicRepublic, itemDrops: [new ZiDataDrop('gurantula', 30)], levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1200 },
  hammerrock: { id: 'hammerrock', name: 'Hammerrock', attack: 180, maxHealth: 350, baseExp: 70, scanRate: 15, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1600 },
  helcat: { id: 'helcat', name: 'Helcat', attack: 160, maxHealth: 250, baseExp: 50, scanRate: 30, price: 35000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600 },
  helcat_stray: { id: 'helcat_stray', name: 'Stray Helcat', attack: 200, maxHealth: 200, baseExp: 70, scanRate: 30, price: 50000, faction: Faction.Neutral, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2500 },
  heldigunner: { id: 'heldigunner', name: 'Heldigunner', attack: 200, maxHealth: 400, baseExp: 70, scanRate: 10, price: 30000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600 },
  helldiver: { id: 'helldiver', name: 'Helldiver', attack: 120, maxHealth: 60, baseExp: 20, scanRate: 70, price: 3000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Water], coreFragments: 600 },
  hidocker: { id: 'hidocker', name: 'Hidocker', attack: 60, maxHealth: 250, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500 },
  hyperscissors: { id: 'hyperscissors', name: 'Hyperscissors', attack: 40, maxHealth: 140, baseExp: 20, scanRate: 75, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400 },
  malder: { id: 'malder', name: 'Malder', attack: 20, maxHealth: 700, baseExp: 40, scanRate: 50, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 800 },
  merda: { id: 'merda', name: 'Merda', attack: 50, maxHealth: 100, baseExp: 20, scanRate: 75, price: 2000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 400 },
  molga: { id: 'molga', name: 'Molga', attack: 100, maxHealth: 400, baseExp: 35, scanRate: 20, price: 20000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1200 },
  red_horn: { id: 'red_horn', name: 'Red Horn', attack: 280, maxHealth: 800, baseExp: 120, scanRate: 10, price: 100000, faction: Faction.GuylosEmpire, levelType: LevelType.Fluctuating, terrainTypes: [TerrainType.Land], coreFragments: 2800 },
  redler: { id: 'redler', name: 'Redler', attack: 300, maxHealth: 150, baseExp: 55, scanRate: 20, price: 55000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air], coreFragments: 2000 },
  sea_batoras: { id: 'sea_batoras', name: 'Sea Batoras', attack: 60, maxHealth: 100, baseExp: 20, scanRate: 70, price: 2500, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400 },
  sea_panther: { id: 'sea_panther', name: 'Sea Panther', attack: 90, maxHealth: 300, baseExp: 30, scanRate: 40, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1600 },
  shield_liger: { id: 'shield_liger', name: 'Shield Liger', attack: 250, maxHealth: 600, baseExp: 100, scanRate: 1, price: 100000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000 },
  sinker: { id: 'sinker', name: 'Sinker', attack: 200, maxHealth: 120, baseExp: 40, scanRate: 40, price: 20000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Air, TerrainType.Water], coreFragments: 1200 },
  spiker: { id: 'spiker', name: 'Spiker', attack: 150, maxHealth: 180, baseExp: 35, scanRate: 55, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 600 },
  stealth_viper: { id: 'stealth_viper', name: 'Stealth Viper', attack: 170, maxHealth: 200, baseExp: 45, scanRate: 40, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1600 },
  tortoise: { id: 'tortoise', name: 'Cannon Tortoise', attack: 100, maxHealth: 700, baseExp: 30, scanRate: 20, price: 9000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 800 },
  zatton: { id: 'zatton', name: 'Zatton', attack: 120, maxHealth: 350, baseExp: 40, scanRate: 30, price: 10000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1000 },
};

export function calculatePartyAttack(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral, terrain: TerrainType = TerrainType.Land): number {
  return party.reduce((sum, z) => {
    const species = getZoidById(z.id);
    const factionBonus = getFactionBonus(playerFaction, species.faction);
    const attack = buildZoid({ bonusMultiplier: factionBonus, id: z.id, level: getOwnedZoidLevel(z) }).attack;
    const terrainBonus = getTerrainBonus(terrain, species.terrainTypes);
    return sum + Math.floor(attack * terrainBonus);
  }, 0);
}

export function calculatePartyMaxHealth(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral): number {
  return party.reduce((sum, z) => {
    const bonus = getFactionBonus(playerFaction, getZoidById(z.id).faction);
    return sum + buildZoid({ bonusMultiplier: bonus, id: z.id, level: getOwnedZoidLevel(z) }).maxHealth;
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

export function buildZoid({ attackOverride, bonusMultiplier = 1, id, imageOverride, level, maxHealthOverride, scannable = true }: ZoidBlueprint): CustomizedZoid {
  const base = getZoidById(id);
  return {
    attack: attackOverride ?? calculateStat(base.attack, level, bonusMultiplier),
    id: base.id,
    imageOverride,
    level,
    maxHealth: maxHealthOverride ?? calculateStat(base.maxHealth, level, bonusMultiplier),
    name: base.name,
    scannable,
  };
}

export interface PartyData {
  commanderZoidId: string;
  zoids: OwnedZoid[];
}

export const DEFAULT_PARTY: PartyData = { commanderZoidId: '', zoids: [] };
