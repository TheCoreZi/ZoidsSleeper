import type { Faction } from './Faction';
import type { Rank } from './Rank';

export const DEFAULT_PLAYER_NAME = 'Zoidbert';
export const MAX_PLAYER_NAME_LENGTH = 20;

export interface PlayerStats {
  attackMult: number;
  baseHealth: number;
  clickAttack: number;
  evolvingEnabled: boolean;
  faction: Faction;
  factionRanks?: Partial<Record<Faction, Rank>>;
  name: string;
  nurturingSlots: number;
  organoidId?: string;
  reinforcementsEnabled: boolean;
}

export const DEFAULT_PLAYER: PlayerStats = {
  attackMult: 1,
  baseHealth: 10,
  clickAttack: 1,
  evolvingEnabled: false,
  faction: 'neutral',
  name: DEFAULT_PLAYER_NAME,
  nurturingSlots: 0,
  reinforcementsEnabled: false,
};

export function isValidPlayerName(name: string): boolean {
  const length = normalizePlayerName(name).length;
  return length > 0 && length <= MAX_PLAYER_NAME_LENGTH;
}

export function normalizePlayerName(name: string): string {
  return name.trim();
}
