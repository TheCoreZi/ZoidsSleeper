import type { Pilot } from '../models/Pilot';
import type { PlayerStats } from '../models/Player';
import { createZoid, resolveZoid } from '../models/Zoid';
import {
  setBattleState,
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
  pilot: Pilot;
  playerHealth: number;
  playerMaxHealth: number;

  constructor(playerStats: PlayerStats, pilot: Pilot) {
    super(playerStats);
    this.pilot = pilot;
    this.playerMaxHealth = playerStats.baseHealth + partyMaxHealth();
    this.playerHealth = this.playerMaxHealth;
    this.enemy = createZoid(resolveZoid(pilot.zoids[0]));
    this.syncToStore();
  }

  restart(): void {
    this.counter = 0;
    this.currentEnemyIndex = 0;
    this.enemy = createZoid(resolveZoid(this.pilot.zoids[0]));
    this.playerHealth = this.playerMaxHealth;
    setBattleState('pilot-fighting');
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
      setBattleState('pilot-victory');
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    setPilotEnemyProgress({ current: this.currentEnemyIndex, total: this.pilot.zoids.length });
    setPilotPlayerHealth(this.playerHealth);
    setPilotPlayerMaxHealth(this.playerMaxHealth);
    setPilotZoidIds(this.pilot.zoids.map((z) => z.id));
  }

  private enemyAttack(): void {
    this.playerHealth = Math.max(0, this.playerHealth - this.enemy.attack);
    this.syncToStore();
    if (this.playerHealth <= 0) {
      setBattleState('pilot-defeat');
    }
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = createZoid(resolveZoid(this.pilot.zoids[this.currentEnemyIndex]));
    this.syncToStore();
  }
}
