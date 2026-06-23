import type { Faction } from './Faction';
import type { Rank } from './Rank';

export interface PlayerStats {
  attackMult: number;
  baseHealth: number;
  clickAttack: number;
  evolvingEnabled: boolean;
  faction: Faction;
  factionRanks?: Partial<Record<Faction, Rank>>;
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
  nurturingSlots: 0,
  reinforcementsEnabled: false,
};
