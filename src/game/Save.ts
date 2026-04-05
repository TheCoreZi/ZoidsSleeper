import { SAVE_TICK, TICK_TIME } from '../constants';
import type { OwnedZoid } from '../models/Zoid';
import { currentLandmark } from '../store/landmarkStore';
import { party } from '../store/partyStore';
import { routeKills } from '../store/statisticsStore';
const SAVE_KEY = 'zoids-sleeper-save';

interface SaveData {
  landmarkId: string;
  party?: OwnedZoid[];
  routeKills?: Record<string, number>;
}

export class Save {
  counter = 0;

  gameTick(): void {
    this.counter += TICK_TIME;
    if (this.counter >= SAVE_TICK) {
      this.counter = 0;
      this.store();
    }
  }

  load(): SaveData | null {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  store(): void {
    const data: SaveData = {
      landmarkId: currentLandmark().id,
      party: party(),
      routeKills: routeKills(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
