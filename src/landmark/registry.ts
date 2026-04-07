import { CITIES } from './City';
import { DUNGEONS } from './Dungeon';
import type { Landmark } from './Landmark';
import { ROUTES } from './Route';

const ALL_LANDMARKS: Landmark[] = [...CITIES, ...DUNGEONS, ...ROUTES];

export function getLandmarkById(id: string): Landmark | undefined {
  return ALL_LANDMARKS.find((l) => l.id === id);
}
