import type { PlayerStats } from '../models/Player';
import type { ZoidBlueprint } from '../models/Zoid';
import { spawnZoid, buildZoid, ZoidResearchStatus } from '../models/Zoid';
import { addFragments } from '../store/nurturingStore';
import { resetScanAfterBattle } from '../store/scanStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import {
  setEnemyZoid,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
} from '../store/gameStore';
import { BaseBattle } from './BaseBattle';

export class WildBossBattle extends BaseBattle {
  currentEnemyIndex = 0;
  fragmentYield: number;
  onDefeat: (() => void) | null = null;
  onVictory: (() => void) | null = null;
  zoids: ZoidBlueprint[];

  constructor(_playerStats: PlayerStats, zoids: ZoidBlueprint[], fragmentYield = 0) {
    super();
    this.fragmentYield = fragmentYield;
    this.zoids = zoids;
    this.enemy = spawnZoid(buildZoid(this.zoids[0]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return false;
  }

  protected onBattleTick(): void {
    if (this.enemy.health <= 0) { return; }
    this.enemyAttack();
  }

  protected onEnemyDefeated(): void {
    this.tryScan();
    resetScanAfterBattle();
    addFragments(this.fragmentYield);
    if (this.currentEnemyIndex < this.zoids.length - 1) {
      this.nextEnemy();
    } else {
      this.onVictory?.();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    setPilotPlayerHealth(this.playerHealth);
    setPilotPlayerMaxHealth(this.playerMaxHealth);
  }

  private enemyAttack(): void {
    const damage = Math.min(this.playerHealth, this.enemy.attack);
    this.playerHealth = Math.max(0, this.playerHealth - this.enemy.attack);
    this.emitPlayerDamageNumber(damage);
    this.syncToStore();
    if (this.playerHealth <= 0) {
      this.onDefeat?.();
    }
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = spawnZoid(buildZoid(this.zoids[this.currentEnemyIndex]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }
}
