import type { Route } from '../landmark';
import { randomEnemy } from '../landmark';
import { buildDropPool, rollDrops } from '../item/rollDrops';
import { grantCurrencyReward } from '../store/walletStore';
import type { PlayerStats } from '../models/Player';
import { getZoidById, spawnZoid } from '../models/Zoid';
import { checkCampaigns } from '../store/campaignStore';
import { emitRewardEvent, setEnemyZoid } from '../store/gameStore';
import { incrementRouteKills } from '../store/statisticsStore';

import { ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from '../store/zoidResearchStore';

import { resetScanAfterBattle } from '../store/scanStore';
import { BaseBattle } from './BaseBattle';

export class Battle extends BaseBattle {
  route: Route;

  constructor(playerStats: PlayerStats, route: Route) {
    super(playerStats);
    this.route = route;
    this.enemy = spawnZoid(randomEnemy(route));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  spawnEnemy(): void {
    this.enemy = spawnZoid(randomEnemy(this.route));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.counter = 0;
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return false;
  }

  protected onEnemyDefeated(): void {
    const scanned = this.tryScan();
    const reward = grantCurrencyReward(this.route.baseReward, 1, scanned);
    emitRewardEvent(reward.magnis, 'magnis');
    emitRewardEvent(reward.ziMetal, 'zi_metal');

    const species = getZoidById(this.enemy.id);
    const drops = buildDropPool(this.route.itemDrops, species.itemDrops);
    const drop = rollDrops(drops);
    if (drop) {drop.grant();}

    incrementRouteKills(this.route.id);
    resetScanAfterBattle();
    checkCampaigns();
    this.spawnEnemy();
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
