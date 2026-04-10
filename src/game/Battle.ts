import type { Route } from '../landmark';
import { randomEnemy } from '../landmark';
import { grantCurrencyReward } from '../store/walletStore';
import type { PlayerStats } from '../models/Player';
import { spawnZoid } from '../models/Zoid';
import { checkCampaigns } from '../store/campaignStore';
import { rewardEvents, setEnemyZoid, setRewardEvents } from '../store/gameStore';
import { incrementRouteKills } from '../store/statisticsStore';

import { ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from '../store/zoidResearchStore';

import { resetScanAfterBattle } from '../store/scanStore';
import { BaseBattle } from './BaseBattle';

export class Battle extends BaseBattle {
  rewardIdCounter = 0;
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
    const events = [...rewardEvents().slice(-4), { amount: reward.magnis, currency: 'magnis', id: this.rewardIdCounter++ }];
    if (reward.ziMetal > 0) {events.push({ amount: reward.ziMetal, currency: 'zi_metal', id: this.rewardIdCounter++ });}
    setRewardEvents(events);
    incrementRouteKills(this.route.id);
    resetScanAfterBattle();
    checkCampaigns();
    this.spawnEnemy();
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
