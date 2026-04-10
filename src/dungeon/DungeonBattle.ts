import { BaseBattle } from '../game/BaseBattle';
import { grantCurrencyReward } from '../store/walletStore';
import type { PlayerStats } from '../models/Player';
import { spawnZoid, buildZoid, type ZoidBlueprint, ZoidResearchStatus } from '../models/Zoid';

import { rewardEvents, setEnemyZoid, setPilotPlayerHealth, setPilotPlayerMaxHealth, setRewardEvents } from '../store/gameStore';
import { resetScanAfterBattle } from '../store/scanStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import type { DungeonSortieEvent } from './DungeonSortieEvent';
import { changePlayerHealth, dungeonRun, isPlayerDead } from './dungeonStore';
import { SortieNodeType, type SortieNodeType as SortieNodeTypeValue } from './DungeonGraph';

export class DungeonBattle extends BaseBattle {
  currentEnemyIndex = -1;
  enemies: ZoidBlueprint[];
  rewardIdCounter = 0;
  onDefeat: (() => void) | null = null;
  onNodeComplete: (() => void) | null = null;

  private config: DungeonSortieEvent;
  private nodeType: SortieNodeTypeValue;

  constructor(playerStats: PlayerStats, config: DungeonSortieEvent, nodeType: SortieNodeTypeValue) {
    super(playerStats);
    this.config = config;
    this.nodeType = nodeType;
    this.enemies = this.buildEnemyList(nodeType);
    const run = dungeonRun();
    if (run) {setPilotPlayerMaxHealth(run.playerMaxHealth);}
    this.nextEnemy();
  }

  protected get isPilotBattle(): boolean {
    return false;
  }

  protected onBattleTick(): void {
    const run = dungeonRun();
    if (!run) {return;}
    const damage = this.enemy.attack;
    changePlayerHealth(-damage);
    this.emitPlayerDamageNumber(damage);
    this.syncPlayerHealth();
    if (isPlayerDead()) {
      this.onDefeat?.();
    }
  }

  protected onEnemyDefeated(): void {
    const rewardMultiplier = this.nodeType === SortieNodeType.Elite ? 3 : 1;
    const scanned = this.nodeType !== SortieNodeType.Boss && this.tryScan();
    const reward = grantCurrencyReward(this.config.baseReward, rewardMultiplier, scanned);
    const events = [...rewardEvents().slice(-4), { amount: reward.magnis, currency: 'magnis', id: this.rewardIdCounter++ }];
    if (reward.ziMetal > 0) {events.push({ amount: reward.ziMetal, currency: 'zi_metal', id: this.rewardIdCounter++ });}
    setRewardEvents(events);
    resetScanAfterBattle();
    if (this.currentEnemyIndex < this.enemies.length - 1) {
      this.nextEnemy();
    } else {
      this.onNodeComplete?.();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    this.syncPlayerHealth();
  }

  private syncPlayerHealth(): void {
    const run = dungeonRun();
    if (!run) {return;}
    setPilotPlayerHealth(run.playerHealth);
  }

  private buildEnemyList(nodeType: SortieNodeTypeValue): ZoidBlueprint[] {
    const pool = nodeType === SortieNodeType.Elite ? this.config.eliteEnemies : this.config.enemies;
    const available = pool.filter((e) => e.requirement?.isCompleted() ?? true);
    const source = available.length > 0 ? available : pool.slice(0, 1);
    const count = nodeType === SortieNodeType.Elite ? randomBetween(1, 3) : 1;
    return Array.from({ length: count }, () => pickRandom(source).zoidData);
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = spawnZoid(buildZoid(this.enemies[this.currentEnemyIndex]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
