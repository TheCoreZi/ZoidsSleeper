import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { CITIES } from './City';
import { DUNGEONS } from './Dungeon';
import type { Landmark } from './Landmark';
import { isLandmarkUnlocked } from './Landmark';
import { ROUTES } from './Route';

const ALL_LANDMARKS: Landmark[] = [...CITIES, ...DUNGEONS, ...ROUTES];

let zoidLocationMap: Map<string, string[]> | null = null;

function buildZoidLocationMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const add = (zoidId: string, landmarkId: string) => {
    const list = map.get(zoidId);
    if (list) {
      if (!list.includes(landmarkId)) { list.push(landmarkId); }
    } else {
      map.set(zoidId, [landmarkId]);
    }
  };
  for (const route of ROUTES) {
    for (const enemy of route.enemies) {
      add(enemy.id, route.id);
    }
  }
  for (const dungeon of DUNGEONS) {
    for (const action of dungeon.actions ?? []) {
      if (action instanceof DungeonSortieEvent) {
        for (const enemy of action.enemies) { add(enemy.zoidData.id, dungeon.id); }
        for (const elite of action.eliteEnemies) { add(elite.zoidData.id, dungeon.id); }
      }
    }
  }
  return map;
}

export function getLandmarkById(id: string): Landmark | undefined {
  return ALL_LANDMARKS.find((l) => l.id === id);
}

export function getZoidLocations(zoidId: string): string[] {
  zoidLocationMap ??= buildZoidLocationMap();
  const all = zoidLocationMap.get(zoidId) ?? [];
  return all.filter((id) => {
    const landmark = getLandmarkById(id);
    return landmark && isLandmarkUnlocked(landmark);
  });
}
