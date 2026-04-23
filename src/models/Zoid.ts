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
  attack: number;
  baseExp: number;
  itemDrops?: Drop[];
  scanRate: number;
  faction: Faction;
  id: string;
  levelType: LevelType;
  maxHealth: number;
  name: string;
  price: number;
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
}

/** Computed stats for a zoid at a specific level, built from a ZoidBlueprint. */
export interface CustomizedZoid {
  attack: number;
  id: string;
  imageOverride?: string;
  level: number;
  maxHealth: number;
  name: string;
}

export const ZOID_LIST: Record<string, ZoidSpecies> = {
  command_wolf: { attack: 200, baseExp: 50, scanRate: 15, faction: Faction.HelicRepublic, id: 'command_wolf', levelType: LevelType.MediumFast, maxHealth: 200, name: 'Command Wolf', price: 40000 },
  command_wolf_desert: { attack: 200, baseExp: 50, scanRate: 15, faction: Faction.HelicRepublic, id: 'command_wolf_desert', levelType: LevelType.MediumFast, maxHealth: 200, name: 'Command Wolf (Desert)', price: 40000 },
  elephantus: { attack: 100, baseExp: 15, scanRate: -1, faction: Faction.HelicRepublic, id: 'elephantus', levelType: LevelType.MediumSlow, maxHealth: 200, name: 'Elephantus', price: 50000 },
  garius: { attack: 50, baseExp: 10, scanRate: -1, faction: Faction.HelicRepublic, id: 'garius', levelType: LevelType.Fast, maxHealth: 100, name: 'Garius', price: 2000 },
  gator: { attack: 150, baseExp: 35, scanRate: 60, faction: Faction.GuylosEmpire, id: 'gator', levelType: LevelType.MediumFast, maxHealth: 200, name: 'Gator', price: 4000 },
  glidoler: { attack: 100, baseExp: 10, scanRate: -1, faction: Faction.HelicRepublic, id: 'glidoler', levelType: LevelType.MediumFast, maxHealth: 40, name: 'Glidoler', price: 2000 },
  gorgodos: { attack: 140, baseExp: 50, scanRate: 20, faction: Faction.HelicRepublic, id: 'gorgodos', levelType: LevelType.Slow, maxHealth: 400, name: 'Gorgodos', price: 12000 },
  gurantula: { attack: 120, baseExp: 35, scanRate: -1, faction: Faction.HelicRepublic, id: 'gurantula', levelType: LevelType.Fast, maxHealth: 300, name: 'Gurantula', price: 4000 },
  guysack: { attack: 180, baseExp: 45, itemDrops: [new ZiDataDrop('gurantula', 30)], scanRate: -1, faction: Faction.HelicRepublic, id: 'guysack', levelType: LevelType.MediumFast, maxHealth: 500, name: 'Guysack', price: 20000 },
  heldigunner: { attack: 200, baseExp: 70, scanRate: 10, faction: Faction.GuylosEmpire, id: 'heldigunner', levelType: LevelType.MediumFast, maxHealth: 400, name: 'Heldigunner', price: 30000 },
  malder: { attack: 20, baseExp: 40, scanRate: 50, faction: Faction.ZenebasEmpire, id: 'malder', levelType: LevelType.Erratic, maxHealth: 700, name: 'Malder', price: 8000 },
  merda: { attack: 50, baseExp: 20, scanRate: 75, faction: Faction.ZenebasEmpire, id: 'merda', levelType: LevelType.Fast, maxHealth: 100, name: 'Merda', price: 2000 },
  molga: { attack: 100, baseExp: 35, scanRate: 20, faction: Faction.ZenebasEmpire, id: 'molga', levelType: LevelType.Fast, maxHealth: 400, name: 'Molga', price: 20000 },
  red_horn: { attack: 280, baseExp: 120, scanRate: 10, faction: Faction.GuylosEmpire, id: 'red_horn', levelType: LevelType.Fluctuating, maxHealth: 800, name: 'Red Horn', price: 100000 },
  redler: { attack: 300, baseExp: 55, scanRate: 20, faction: Faction.GuylosEmpire, id: 'redler', levelType: LevelType.MediumFast, maxHealth: 150, name: 'Redler', price: 55000 },
  shield_liger: { attack: 250, baseExp: 100, scanRate: 1, faction: Faction.HelicRepublic, id: 'shield_liger', levelType: LevelType.MediumFast, maxHealth: 600, name: 'Shield Liger', price: 100000 },
  spiker: { attack: 150, baseExp: 35, scanRate: 55, faction: Faction.HelicRepublic, id: 'spiker', levelType: LevelType.Fast, maxHealth: 180, name: 'Spiker', price: 4000 },
  tortoise: { attack: 100, baseExp: 30, scanRate: 20, faction: Faction.ZenebasEmpire, id: 'tortoise', levelType: LevelType.Fast, maxHealth: 700, name: 'Cannon Tortoise', price: 9000 },
  zatton: { attack: 120, baseExp: 40, scanRate: 30, faction: Faction.ZenebasEmpire, id: 'zatton', levelType: LevelType.MediumSlow, maxHealth: 350, name: 'Zatton', price: 10000 },
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

export function buildZoid({ attackOverride, bonusMultiplier = 1, id, imageOverride, level, maxHealthOverride }: ZoidBlueprint): CustomizedZoid {
  const base = getZoidById(id);
  return {
    attack: attackOverride ?? calculateStat(base.attack, level, bonusMultiplier),
    id: base.id,
    imageOverride,
    level,
    maxHealth: maxHealthOverride ?? calculateStat(base.maxHealth, level, bonusMultiplier),
    name: base.name,
  };
}

export interface PartyData {
  commanderZoidId: string;
  zoids: OwnedZoid[];
}

export const DEFAULT_PARTY: PartyData = { commanderZoidId: '', zoids: [] };
