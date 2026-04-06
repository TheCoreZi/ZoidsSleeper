import { SAVE_TICK, TICK_TIME } from '../constants';
import type { CampaignSaveData } from '../campaign/Campaign';
import type { OwnedZoid } from '../models/Zoid';
import { campaignStates } from '../store/campaignStore';
import { currentLandmark } from '../store/landmarkStore';
import { party } from '../store/partyStore';
import { pilotDefeats, routeKills } from '../store/statisticsStore';
import { wallet } from '../store/walletStore';
const SAVE_KEY = 'zoids-sleeper-save';

interface SaveData {
  campaigns?: Record<string, CampaignSaveData>;
  landmarkId: string;
  party?: OwnedZoid[];
  pilotDefeats?: Record<string, number>;
  routeKills?: Record<string, number>;
  wallet?: Record<string, number>;
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
      campaigns: campaignStates(),
      landmarkId: currentLandmark().id,
      party: party(),
      pilotDefeats: pilotDefeats(),
      routeKills: routeKills(),
      wallet: wallet(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
