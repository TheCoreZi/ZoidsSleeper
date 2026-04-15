import { type Pilot, getActiveZoids } from '../models/Pilot';
import type { PlayerStats } from '../models/Player';
import type { ZoidBlueprint } from '../models/Zoid';
import { spawnZoid, buildZoid, ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from '../store/zoidResearchStore';
import {
  setEnemyZoid,
  setPilotEnemyProgress,
  setPilotInfo,
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
  zoids: ZoidBlueprint[];

  constructor(playerStats: PlayerStats, pilot: Pilot, initialHealth?: number, initialMaxHealth?: number) {
    super(playerStats);
    this.pilot = pilot;
    this.zoids = getActiveZoids(pilot);
    this.playerMaxHealth = initialMaxHealth ?? (playerStats.baseHealth + partyMaxHealth());
    this.playerHealth = initialHealth ?? this.playerMaxHealth;
    this.enemy = spawnZoid(buildZoid(this.zoids[0]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return true;
  }

  protected onBattleTick(): void {
    if (this.enemy.health <= 0) {return;}
    this.enemyAttack();
  }

  protected onEnemyDefeated(): void {
    if (this.currentEnemyIndex < this.zoids.length - 1) {
      this.nextEnemy();
    } else {
      this.onVictory?.();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    setPilotEnemyProgress({ current: this.currentEnemyIndex, total: this.zoids.length });
    setPilotInfo({ id: this.pilot.id, name: this.pilot.name });
    setPilotPlayerHealth(this.playerHealth);
    setPilotPlayerMaxHealth(this.playerMaxHealth);
    setPilotZoidIds(this.zoids.map((z) => ({ id: z.id, imageOverride: z.imageOverride })));
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
