import type { Faction } from './Faction';

export interface PlayerStats {
  attackMult: number;
  baseHealth: number;
  clickAttack: number;
  coreNurturingEnabled: boolean;
  faction: Faction;
  reinforcementsEnabled: boolean;
}

export const DEFAULT_PLAYER: PlayerStats = {
  attackMult: 1,
  baseHealth: 10,
  clickAttack: 1,
  coreNurturingEnabled: false,
  faction: 'neutral',
  reinforcementsEnabled: false,
};
