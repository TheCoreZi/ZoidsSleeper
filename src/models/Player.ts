export interface PlayerStats {
  baseHealth: number;
  clickAttack: number;
}

export const DEFAULT_PLAYER: PlayerStats = {
  baseHealth: 0,
  clickAttack: 1,
};
