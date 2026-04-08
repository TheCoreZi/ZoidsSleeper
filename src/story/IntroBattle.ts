import { BaseBattle } from '../game/BaseBattle';
import type { PlayerStats } from '../models/Player';
import { spawnZoid, buildZoid } from '../models/Zoid';
import { setEnemyZoid } from '../store/gameStore';

const STARTER_LEVEL = 5;

export class IntroBattle extends BaseBattle {
  onVictory: (() => void) | null = null;

  constructor(playerStats: PlayerStats, zoidId: string) {
    super(playerStats);
    this.enemy = spawnZoid(buildZoid({ id: zoidId, level: STARTER_LEVEL, maxHealthOverride: 100 }));
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return false;
  }

  protected onEnemyDefeated(): void {
    this.onVictory?.();
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
