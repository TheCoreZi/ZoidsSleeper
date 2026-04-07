import type { Route } from '../landmark';
import { randomEnemy } from '../landmark';
import { calculateMagnisReward, Currency } from '../models/Currency';
import type { PlayerStats } from '../models/Player';
import { createZoid } from '../models/Zoid';
import { checkCampaigns } from '../store/campaignStore';
import { rewardEvents, setEnemyZoid, setRewardEvents } from '../store/gameStore';
import { incrementRouteKills } from '../store/statisticsStore';
import { addCurrency } from '../store/walletStore';

import { ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from '../store/zoidResearchStore';

import { getActiveDeviceId, getActiveScanMode, resetScanAfterBattle, ScanMode } from '../store/scanStore';
import { BaseBattle } from './BaseBattle';
import { attemptScan } from './Scan';

export class Battle extends BaseBattle {
  rewardIdCounter = 0;
  route: Route;

  constructor(playerStats: PlayerStats, route: Route) {
    super(playerStats);
    this.route = route;
    this.enemy = createZoid(randomEnemy(route));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  spawnEnemy(): void {
    this.enemy = createZoid(randomEnemy(this.route));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.counter = 0;
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return false;
  }

  protected onEnemyDefeated(): void {
    const reward = calculateMagnisReward(this.route.baseReward);
    addCurrency(Currency.Magnis, reward);
    setRewardEvents([...rewardEvents().slice(-4), { amount: reward, id: this.rewardIdCounter++ }]);
    incrementRouteKills(this.route.id);
    const deviceId = getActiveDeviceId();
    if (deviceId && getActiveScanMode() !== ScanMode.Off) {
      attemptScan(this.enemy.id, deviceId);
    }
    resetScanAfterBattle();
    checkCampaigns();
    this.spawnEnemy();
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
