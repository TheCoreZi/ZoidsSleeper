import type { Faction } from './Faction';

export interface PlayerStats {
  attackMult: number;
  baseHealth: number;
  clickAttack: number;
  faction: Faction;
}

export const DEFAULT_PLAYER: PlayerStats = {
  attackMult: 1,
  baseHealth: 10,
  clickAttack: 1,
  faction: 'neutral',
};
