import type { OwnedZoidStats } from '../evolution';
import { t } from '../i18n';
import { Faction, getFactionBonus } from './Faction';
import { levelFromExperience } from './LevelType';
import { TerrainType, getTerrainBonus } from './Terrain';

import type { ZoidSpecies } from './ZoidSpecies';

export { ZoidSize } from './ZoidSpecies';

/** A zoid owned by the player, tracking accumulated experience. */
export interface OwnedZoid {
  copies?: number;
  dateObtained?: number;
  experience: number;
  id: string;
  rebornBonusPercent?: number;
  rebornCount?: number;
}

export { ZoidResearchStatus } from './ZoidResearchStatus';

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

import { ZOID_LIST } from './zoidCatalog';

export { ZOID_LIST };

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

export function computeOwnedZoidStats(owned: OwnedZoid, playerFaction: Faction): OwnedZoidStats {
  const species = getZoidById(owned.id);
  const level = getOwnedZoidLevel(owned);
  const factionBonus = getFactionBonus(playerFaction, species.faction);
  const rebornMultiplier = 1 + (owned.rebornBonusPercent ?? 0) / 100;
  return {
    attack: Math.floor(calculateStat(species.attack, level, factionBonus) * rebornMultiplier),
    faction: playerFaction,
    health: Math.floor(calculateStat(species.maxHealth, level, factionBonus) * rebornMultiplier),
    level,
  };
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

export function getZoidName(id: string): string {
  const key = `zoids:${id}`;
  const translated = t(key);
  return translated === key ? id : translated;
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
