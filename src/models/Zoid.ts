import { LevelType, levelFromExperience } from './LevelType';

export interface OwnedZoid {
  experience: number;
  id: string;
}

export interface ZoidData {
  attack: number;
  baseExp: number;
  dropRate: number;
  id: string;
  levelType: LevelType;
  maxHealth: number;
  name: string;
}

export interface ZoidInstance extends ZoidStats {
  health: number;
}

export interface ZoidRef {
  attackOverride?: number;
  bonusMultiplier?: number;
  id: string;
  level: number;
  maxHealthOverride?: number;
}

export interface ZoidStats {
  attack: number;
  id: string;
  level: number;
  maxHealth: number;
  name: string;
}

export const ZOID_LIST: Record<string, ZoidData> = {
  command_wolf: { attack: 200, baseExp: 50, dropRate: 15, id: 'command_wolf', levelType: LevelType.MediumFast, maxHealth: 200, name: 'Command Wolf' },
  elephantus: { attack: 100, baseExp: 15, dropRate: -1, id: 'elephantus', levelType: LevelType.MediumSlow, maxHealth: 200, name: 'Elephantus' },
  garius: { attack: 50, baseExp: 10, dropRate: -1, id: 'garius', levelType: LevelType.Fast, maxHealth: 100, name: 'Garius' },
  gator: { attack: 150, baseExp: 35, dropRate: 25, id: 'gator', levelType: LevelType.MediumFast, maxHealth: 200, name: 'Gator' },
  glidoler: { attack: 100, baseExp: 10, dropRate: -1, id: 'glidoler', levelType: LevelType.MediumFast, maxHealth: 40, name: 'Glidoler' },
  malder: { attack: 20, baseExp: 40, dropRate: 10, id: 'malder', levelType: LevelType.Erratic, maxHealth: 700, name: 'Malder' },
  merda: { attack: 50, baseExp: 20, dropRate: 50, id: 'merda', levelType: LevelType.Fast, maxHealth: 100, name: 'Merda' },
  molga: { attack: 100, baseExp: 35, dropRate: 20, id: 'molga', levelType: LevelType.Fast, maxHealth: 400, name: 'Molga' },
  tortoise: { attack: 100, baseExp: 30, dropRate: 20, id: 'tortoise', levelType: LevelType.Fast, maxHealth: 700, name: 'Cannon Tortoise' },
  zatton: { attack: 120, baseExp: 40, dropRate: 5, id: 'zatton', levelType: LevelType.MediumSlow, maxHealth: 350, name: 'Zatton' },
};

export function calculatePartyAttack(party: OwnedZoid[]): number {
  return party.reduce((sum, z) => sum + resolveZoid({ id: z.id, level: getOwnedZoidLevel(z) }).attack, 0);
}

export function calculatePartyMaxHealth(party: OwnedZoid[]): number {
  return party.reduce((sum, z) => sum + resolveZoid({ id: z.id, level: getOwnedZoidLevel(z) }).maxHealth, 0);
}

export function calculateStat(baseStat: number, level: number, bonusMultiplier = 1): number {
  return Math.max(1, Math.floor(baseStat * (level / 100) * bonusMultiplier));
}

export function createZoid(stats: ZoidStats): ZoidInstance {
  return { ...stats, health: stats.maxHealth };
}

export function getOwnedZoidLevel(owned: OwnedZoid): number {
  const data = getZoidById(owned.id);
  return levelFromExperience(owned.experience, data.levelType);
}

export function getZoidById(id: string): ZoidData {
  const zoid = ZOID_LIST[id];
  if (!zoid) {throw new Error(`Unknown Zoid: ${id}`);}
  return zoid;
}

export function getZoidImage(id: string): string {
  return `images/zoids/${id}.png`;
}

export function resolveZoid({ attackOverride, bonusMultiplier = 1, id, level, maxHealthOverride }: ZoidRef): ZoidStats {
  const base = getZoidById(id);
  return {
    attack: attackOverride ?? calculateStat(base.attack, level, bonusMultiplier),
    id: base.id,
    level,
    maxHealth: maxHealthOverride ?? calculateStat(base.maxHealth, level, bonusMultiplier),
    name: base.name,
  };
}

export const DEFAULT_PARTY: OwnedZoid[] = [];
