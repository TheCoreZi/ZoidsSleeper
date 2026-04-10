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
import { migrate } from './migrations';
const SAVE_KEY = 'zoids-sleeper-save';

// When changing this interface, bump version (npm version patch) and add a migration in migrations.ts
export interface SaveData {
  campaigns?: Record<string, CampaignSaveData>;
  inventory?: Record<string, number>;
  landmarkId: string;
  party?: OwnedZoid[];
  pilotDefeats?: Record<string, number>;
  playerStats?: PlayerStats;
  routeKills?: Record<string, number>;
  version: string;
  wallet?: Record<string, number>;
  zoidData?: Record<string, number>;
  zoidResearch?: Record<string, ZoidResearchStatus>;
}

export class Save {
  counter = 0;

  static decode(base64: string): string {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  static encode(raw: string): string {
    const bytes = new TextEncoder().encode(raw);
    return btoa(String.fromCharCode(...bytes));
  }

  static exportSave(): void {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return;
    }
    const encoded = Save.encode(raw);
    const blob = new Blob([encoded], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zoids-sleeper_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async importSave(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const decoded = Save.decode(text.trim());
      const parsed = JSON.parse(decoded);
      if (!parsed.version) {
        return false;
      }
      migrate(parsed, parsed.version);
      localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
      location.reload();
      return true;
    } catch {
      return false;
    }
  }

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
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw);
    migrate(data, data.version);
    return data;
  }

  store(): void {
    const data: SaveData = {
      campaigns: campaignStates(),
      inventory: inventory(),
      landmarkId: currentLandmark().id,
      party: party(),
      version: __APP_VERSION__,
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
