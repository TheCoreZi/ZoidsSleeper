import { PILOT_ENCOUNTER_CHANCE } from '../constants';
import { randomEnemy, type Route } from '../models/Route';
import { createZoid } from '../models/Zoid';
import { setEnemyZoid } from '../store/gameStore';
import type { PlayerStats } from '../models/Player';
import { BaseBattle } from './BaseBattle';

export class Battle extends BaseBattle {
  onPilotEncounter: (() => void) | null = null;
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
    if (Math.random() < PILOT_ENCOUNTER_CHANCE && this.onPilotEncounter) {
      this.onPilotEncounter();
    } else {
      this.spawnEnemy();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
  }
}
