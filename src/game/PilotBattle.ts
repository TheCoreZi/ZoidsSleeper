import type { Pilot } from '../models/Pilot';
import type { PlayerStats } from '../models/Player';
import { createZoid, resolveZoid, ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from '../store/zoidResearchStore';
import {
  setEnemyZoid,
  setPilotEnemyProgress,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
  setPilotZoidIds,
} from '../store/gameStore';
import { partyMaxHealth } from '../store/partyStore';
import { BaseBattle } from './BaseBattle';

export class PilotBattle extends BaseBattle {
  currentEnemyIndex = 0;
  onDefeat: (() => void) | null = null;
  onVictory: (() => void) | null = null;
  pilot: Pilot;
  playerHealth: number;
  playerMaxHealth: number;

  constructor(playerStats: PlayerStats, pilot: Pilot) {
    super(playerStats);
    this.pilot = pilot;
    this.playerMaxHealth = playerStats.baseHealth + partyMaxHealth();
    this.playerHealth = this.playerMaxHealth;
    this.enemy = createZoid(resolveZoid(pilot.zoids[0]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return true;
  }

  protected onBattleTick(): void {
    this.enemyAttack();
  }

  protected onEnemyDefeated(): void {
    if (this.currentEnemyIndex < this.pilot.zoids.length - 1) {
      this.nextEnemy();
    } else {
      this.onVictory?.();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    setPilotEnemyProgress({ current: this.currentEnemyIndex, total: this.pilot.zoids.length });
    setPilotPlayerHealth(this.playerHealth);
    setPilotPlayerMaxHealth(this.playerMaxHealth);
    setPilotZoidIds(this.pilot.zoids.map((z) => ({ id: z.id, imageOverride: z.imageOverride })));
  }

  private enemyAttack(): void {
    this.playerHealth = Math.max(0, this.playerHealth - this.enemy.attack);
    this.syncToStore();
    if (this.playerHealth <= 0) {
      this.onDefeat?.();
    }
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = createZoid(resolveZoid(this.pilot.zoids[this.currentEnemyIndex]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }
}
