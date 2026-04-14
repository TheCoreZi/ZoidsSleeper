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
      { attackOverride: 1, id: 'molga', level: 5, maxHealthOverride: 250 },
    ],
  },
  bianco_nero: {
    id: 'bianco_nero',
    magnisReward: 1200,
    name: 'Bianco & Nero',
    zoids: [
      { attackOverride: 8, id: 'command_wolf', level: 15, maxHealthOverride: 450 },
      { attackOverride: 8, id: 'command_wolf', level: 17, maxHealthOverride: 550 },
    ],
  },
  bul: {
    id: 'bul',
    magnisReward: 1000,
    name: 'Bul',
    zoids: [
      { attackOverride: 5, id: 'guysack', imageOverride: 'guysack_bs', level: 5, maxHealthOverride: 1500 },
    ],
  },
};

export function getPilotImage(id: string): string {
  return `images/pilots/${id}.png`;
}
