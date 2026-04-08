import type { ZoidRef } from '../models/Zoid';

export interface Pilot {
  id: string;
  magnisReward: number;
  name: string;
  zoids: ZoidRef[];
}

export const PILOTS: Record<string, Pilot> = {
  bandit1: {
    id: 'bandit1',
    magnisReward: 200,
    name: 'Bandit',
    zoids: [
      { id: 'molga', level: 5 },
    ],
  },
  bianco_nero: {
    id: 'bianco_nero',
    magnisReward: 800,
    name: 'Bianco & Nero',
    zoids: [
      { id: 'command_wolf', level: 15 },
      { id: 'command_wolf', level: 15 },
    ],
  },
  bul: {
    id: 'bul',
    magnisReward: 500,
    name: 'Bul',
    zoids: [
      { id: 'guysack', level: 5, imageOverride:'guysack_bs', maxHealthOverride: 2500 },
    ],
  },
};

export function getPilotImage(id: string): string {
  return `images/pilots/${id}.png`;
}
