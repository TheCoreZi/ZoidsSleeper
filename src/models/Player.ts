export interface PlayerStats {
  baseHealth: number;
  clickBonus: number;
}

export const DEFAULT_PLAYER: PlayerStats = {
  baseHealth: 0,
  clickBonus: 1,
};

export function calculateClickAttack(player: PlayerStats): number {
  return Math.max(1, Math.floor(Math.pow(player.clickBonus, 1.4)));
}
