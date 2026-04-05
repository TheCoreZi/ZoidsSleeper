import type { ZoidRef } from './Zoid';

export interface Pilot {
  id: string;
  name: string;
  zoids: ZoidRef[];
}

export const PILOTS: Pilot[] = [
  {
    id: 'bandit1',
    name: 'Bandit',
    zoids: [
      { id: 'molga', level: 2 },
      { id: 'molga', level: 2 },
      { id: 'command_wolf', level: 4 },
    ],
  },
];

export function getPilot(id: string): Pilot | undefined {
  return PILOTS.find((p) => p.id === id);
}

export function getPilotImage(id: string): string {
  return `images/pilots/${id}.png`;
}

export function randomPilot(): Pilot {
  return PILOTS[Math.floor(Math.random() * PILOTS.length)];
}
