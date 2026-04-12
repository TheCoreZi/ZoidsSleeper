import type { ZoidBlueprint } from '../models/Zoid';

export interface Pilot {
  id: string;
  magnisReward: number;
  name: string;
  zoids: ZoidBlueprint[];
}

export const PILOTS: Record<string, Pilot> = {
  bandit1: {
    id: 'bandit1',
    magnisReward: 3000,
    name: 'Bandit',
    zoids: [
      { attackOverride: 1, id: 'molga', level: 5, maxHealthOverride: 320 },
    ],
  },
  bianco_nero: {
    id: 'bianco_nero',
    magnisReward: 1200,
    name: 'Bianco & Nero',
    zoids: [
      { id: 'command_wolf', level: 15, maxHealthOverride: 800 },
      { id: 'command_wolf', level: 17, maxHealthOverride: 900 },
    ],
  },
  bul: {
    id: 'bul',
    magnisReward: 1000,
    name: 'Bul',
    zoids: [
      { id: 'guysack', level: 5, imageOverride:'guysack_bs', maxHealthOverride: 2500 },
    ],
  },
};

export function getPilotImage(id: string): string {
  return `images/pilots/${id}.png`;
}
