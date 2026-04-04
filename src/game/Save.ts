import { SAVE_TICK, TICK_TIME } from '../constants';
import type { OwnedZoid } from '../models/Zoid';
import { party } from '../store/partyStore';
import type { Game } from './Game';

const SAVE_KEY = 'zoids-sleeper-save';

interface SaveData {
  enemyHealth: number;
  hasSeenPilotBattle: boolean;
  party?: OwnedZoid[];
  routeNumber: number;
}

export class Save {
  counter = 0;

  gameTick(game: Game): void {
    this.counter += TICK_TIME;
    if (this.counter >= SAVE_TICK) {
      this.counter = 0;
      this.store(game);
    }
  }

  load(): SaveData | null {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  store(game: Game): void {
    const data: SaveData = {
      enemyHealth: game.battle.enemy.health,
      hasSeenPilotBattle: game.hasSeenPilotBattle,
      party: party(),
      routeNumber: game.battle.route.number,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
