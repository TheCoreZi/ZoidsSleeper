import { SAVE_TICK, TICK_TIME } from '../constants';
import type { CampaignSaveData } from '../campaign/Campaign';
import type { PlayerStats } from '../models/Player';
import type { OwnedZoid } from '../models/Zoid';
import type { ZoidResearchStatus } from '../models/Zoid';
import { campaignStates } from '../store/campaignStore';
import { playerStats } from '../store/gameStore';
import { currentLandmark } from '../store/landmarkStore';
import { party } from '../store/partyStore';
import { pilotDefeats, routeKills } from '../store/statisticsStore';
import { inventory } from '../store/inventoryStore';
import { wallet } from '../store/walletStore';
import { zoidDataLog } from '../store/zoidDataStore';
import { zoidResearch } from '../store/zoidResearchStore';
const SAVE_KEY = 'zoids-sleeper-save';

interface SaveData {
  campaigns?: Record<string, CampaignSaveData>;
  inventory?: Record<string, number>;
  landmarkId: string;
  party?: OwnedZoid[];
  pilotDefeats?: Record<string, number>;
  playerStats?: PlayerStats;
  routeKills?: Record<string, number>;
  wallet?: Record<string, number>;
  zoidData?: Record<string, number>;
  zoidResearch?: Record<string, ZoidResearchStatus>;
}

export class Save {
  counter = 0;

  static reset(): void {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }

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
      inventory: inventory(),
      landmarkId: currentLandmark().id,
      party: party(),
      pilotDefeats: pilotDefeats(),
      playerStats: playerStats() ?? undefined,
      routeKills: routeKills(),
      wallet: wallet(),
      zoidData: zoidDataLog(),
      zoidResearch: zoidResearch(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
