import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { CITIES } from './City';
import { DUNGEONS } from './Dungeon';
import type { Landmark } from './Landmark';
import { isLandmarkUnlocked } from './Landmark';
import { getUnlockedEnemies, ROUTES } from './Route';

const ALL_LANDMARKS: Landmark[] = [...CITIES, ...DUNGEONS, ...ROUTES];

export function getLandmarkById(id: string): Landmark | undefined {
  return ALL_LANDMARKS.find((l) => l.id === id);
}

export function getZoidLocations(zoidId: string): string[] {
  const locations: string[] = [];
  for (const route of ROUTES) {
    if (isLandmarkUnlocked(route) && getUnlockedEnemies(route).some((e) => e.blueprint.id === zoidId)) {
      locations.push(route.id);
    }
  }
  for (const dungeon of DUNGEONS) {
    if (!isLandmarkUnlocked(dungeon)) { continue; }
    for (const action of dungeon.actions ?? []) {
      if (action instanceof DungeonSortieEvent) {
        const hasEnemy = action.enemies.some((e) => e.zoidData.id === zoidId)
          || action.eliteEnemies.some((e) => e.zoidData.id === zoidId);
        if (hasEnemy) { locations.push(dungeon.id); break; }
      }
    }
  }
  return locations;
}
