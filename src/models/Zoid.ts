import type { Drop } from '../item/Drop';
import { ZiDataDrop } from '../item/ZiDataDrop';
import { Faction, getFactionBonus } from './Faction';
import { LevelType, levelFromExperience } from './LevelType';

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
  maxHealth: number;
  baseExp: number;
  scanRate: number;
  price: number;
  faction: Faction;
  itemDrops?: Drop[];
  levelType: LevelType;
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
  aquadon: { id: 'aquadon', name: 'Aquadon', attack: 70, maxHealth: 80, baseExp: 10, scanRate: 65, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast },
  command_wolf: { id: 'command_wolf', name: 'Command Wolf', attack: 200, maxHealth: 200, baseExp: 50, scanRate: 15, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast },
  command_wolf_desert: { id: 'command_wolf_desert', name: 'Command Wolf (Desert)', attack: 200, maxHealth: 200, baseExp: 50, scanRate: 15, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast },
  dcsj: { id: 'dcsj', name: 'Shield Liger DCS-J', attack: 320, maxHealth: 800, baseExp: 200, scanRate: 10, price: 150000, faction: Faction.HelicRepublic, levelType: LevelType.Slow },
  elephantus: { id: 'elephantus', name: 'Elephantus', attack: 100, maxHealth: 200, baseExp: 15, scanRate: 10, price: 50000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow },
  garius: { id: 'garius', name: 'Garius', attack: 50, maxHealth: 100, baseExp: 10, scanRate: 10, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast },
  gator: { id: 'gator', name: 'Gator', attack: 150, maxHealth: 200, baseExp: 35, scanRate: 60, price: 4000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast },
  giraffsworder: { id: 'giraffsworder', name: 'Girafsworder', attack: 180, maxHealth: 150, baseExp: 35, scanRate: 40, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast },
  glidoler: { id: 'glidoler', name: 'Glidoler', attack: 100, maxHealth: 40, baseExp: 10, scanRate: 10, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast },
  gorgodos: { id: 'gorgodos', name: 'Gorgodos', attack: 140, maxHealth: 400, baseExp: 50, scanRate: 20, price: 12000, faction: Faction.HelicRepublic, levelType: LevelType.Slow },
  gunbeetle: { id: 'gunbeetle', name: 'Gunbeetle', attack: 120, maxHealth: 200, baseExp: 35, scanRate: 40, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast },
  gurantula: { id: 'gurantula', name: 'Gurantula', attack: 120, maxHealth: 300, baseExp: 35, scanRate: -1, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast },
  guysack: { id: 'guysack', name: 'Guysack', attack: 180, maxHealth: 500, baseExp: 45, scanRate: -1, price: 20000, faction: Faction.HelicRepublic, itemDrops: [new ZiDataDrop('gurantula', 30)], levelType: LevelType.MediumFast },
  hammerrock: { id: 'hammerrock', name: 'Hammerrock', attack: 180, maxHealth: 350, baseExp: 70, scanRate: 15, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow },
  helcat: { id: 'helcat', name: 'Helcat', attack: 160, maxHealth: 250, baseExp: 50, scanRate: 30, price: 35000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast },
  helcat_stray: { id: 'helcat_stray', name: 'Stray Helcat', attack: 200, maxHealth: 200, baseExp: 70, scanRate: 30, price: 50000, faction: Faction.Neutral, levelType: LevelType.MediumFast },
  heldigunner: { id: 'heldigunner', name: 'Heldigunner', attack: 200, maxHealth: 400, baseExp: 70, scanRate: 10, price: 30000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast },
  hidocker: { id: 'hidocker', name: 'Hidocker', attack: 60, maxHealth: 250, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow },
  malder: { id: 'malder', name: 'Malder', attack: 20, maxHealth: 700, baseExp: 40, scanRate: 50, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.Erratic },
  merda: { id: 'merda', name: 'Merda', attack: 50, maxHealth: 100, baseExp: 20, scanRate: 75, price: 2000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast },
  molga: { id: 'molga', name: 'Molga', attack: 100, maxHealth: 400, baseExp: 35, scanRate: 20, price: 20000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast },
  red_horn: { id: 'red_horn', name: 'Red Horn', attack: 280, maxHealth: 800, baseExp: 120, scanRate: 10, price: 100000, faction: Faction.GuylosEmpire, levelType: LevelType.Fluctuating },
  redler: { id: 'redler', name: 'Redler', attack: 300, maxHealth: 150, baseExp: 55, scanRate: 20, price: 55000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast },
  sea_panther: { id: 'sea_panther', name: 'Sea Panther', attack: 90, maxHealth: 300, baseExp: 30, scanRate: 40, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow },
  shield_liger: { id: 'shield_liger', name: 'Shield Liger', attack: 250, maxHealth: 600, baseExp: 100, scanRate: 1, price: 100000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast },
  sinker: { id: 'sinker', name: 'Sinker', attack: 200, maxHealth: 120, baseExp: 40, scanRate: 40, price: 20000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast },
  spiker: { id: 'spiker', name: 'Spiker', attack: 150, maxHealth: 180, baseExp: 35, scanRate: 55, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast },
  stealth_viper: { id: 'stealth_viper', name: 'Stealth Viper', attack: 170, maxHealth: 200, baseExp: 45, scanRate: 40, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.Fast },
  tortoise: { id: 'tortoise', name: 'Cannon Tortoise', attack: 100, maxHealth: 700, baseExp: 30, scanRate: 20, price: 9000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast },
  zatton: { id: 'zatton', name: 'Zatton', attack: 120, maxHealth: 350, baseExp: 40, scanRate: 30, price: 10000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow },
};

export function calculatePartyAttack(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral): number {
  return party.reduce((sum, z) => {
    const bonus = getFactionBonus(playerFaction, getZoidById(z.id).faction);
    return sum + buildZoid({ bonusMultiplier: bonus, id: z.id, level: getOwnedZoidLevel(z) }).attack;
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
