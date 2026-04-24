import { BaseBattle } from '../game/BaseBattle';
import { buildDropPool, rollDrops } from '../item/rollDrops';
import { grantCurrencyReward } from '../store/walletStore';
import { spawnZoid, buildZoid, getZoidById, ZoidResearchStatus } from '../models/Zoid';

import { emitRewardEvent, setEnemyZoid, setPilotPlayerHealth, setPilotPlayerMaxHealth } from '../store/gameStore';
import { resetScanAfterBattle } from '../store/scanStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import { WildDungeonBoss, type DungeonEnemy } from './DungeonSortieConfig';
import type { DungeonSortieEvent } from './DungeonSortieEvent';
import { changePlayerHealth, dungeonRun, isPlayerDead } from './dungeonStore';
import { SortieNodeType, type SortieNodeType as SortieNodeTypeValue } from './DungeonGraph';

export class DungeonBattle extends BaseBattle {
  currentEnemyIndex = -1;
  enemies: DungeonEnemy[];
  onDefeat: (() => void) | null = null;
  onNodeComplete: (() => void) | null = null;

  private config: DungeonSortieEvent;
  private nodeType: SortieNodeTypeValue;

  constructor(config: DungeonSortieEvent, nodeType: SortieNodeTypeValue) {
    super();
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
    const rewardMultiplier = this.getRewardMultiplier();
    const scanned = this.tryScan();
    const reward = grantCurrencyReward(this.config.baseReward, rewardMultiplier, scanned);
    emitRewardEvent(reward.magnis, 'magnis');
    emitRewardEvent(reward.ziMetal, 'zi_metal');

    const species = getZoidById(this.enemy.id);
    const dungeonEnemy = this.enemies[this.currentEnemyIndex];
    const drops = buildDropPool(dungeonEnemy.itemDrops, this.config.itemDrops, species.itemDrops);
    const drop = rollDrops(drops);
    if (drop) {drop.grant();}

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

  private buildBossEnemy(): DungeonEnemy[] {
    const boss = dungeonRun()?.boss;
    if (boss instanceof WildDungeonBoss) {return [{ zoidData: boss.zoidData }];}
    return [];
  }

  private buildEnemyList(nodeType: SortieNodeTypeValue): DungeonEnemy[] {
    if (nodeType === SortieNodeType.Boss) {return this.buildBossEnemy();}
    const pool = nodeType === SortieNodeType.Elite ? this.config.eliteEnemies : this.config.enemies;
    const available = pool.filter((e) => e.requirement?.isCompleted() ?? true);
    const source = available.length > 0 ? available : pool.slice(0, 1);
    const count = nodeType === SortieNodeType.Elite ? randomBetween(1, 3) : 1;
    return Array.from({ length: count }, () => pickRandom(source));
  }

  private getRewardMultiplier(): number {
    switch (this.nodeType) {
      case SortieNodeType.Boss: return 5;
      case SortieNodeType.Elite: return 3;
      default: return 1;
    }
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = spawnZoid(buildZoid(this.enemies[this.currentEnemyIndex].zoidData));
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
