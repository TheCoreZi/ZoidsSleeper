import { randomEnemy, type Route } from '../models/Route';
import { createZoid } from '../models/Zoid';
import { setEnemyZoid } from '../store/gameStore';
import { incrementRouteKills } from '../store/statisticsStore';
import type { PlayerStats } from '../models/Player';
import { BaseBattle } from './BaseBattle';

export class Battle extends BaseBattle {
  route: Route;

  constructor(playerStats: PlayerStats, route: Route) {
    super(playerStats);
    this.route = route;
    this.enemy = createZoid(randomEnemy(route));
    this.syncToStore();
  }

  spawnEnemy(): void {
    this.enemy = createZoid(randomEnemy(this.route));
    this.counter = 0;
    this.syncToStore();
  }

  protected get isPilotBattle() {
    return false;
  }

  protected onEnemyDefeated(): void {
    incrementRouteKills(this.route.id);
    this.spawnEnemy();
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
