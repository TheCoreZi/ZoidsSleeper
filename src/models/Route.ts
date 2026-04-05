import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { type ZoidRef, type ZoidStats, resolveZoid } from './Zoid';

export interface Route extends Landmark {
  connects: [string, string];
  enemies: ZoidRef[];
  type: typeof LandmarkType.Route;
}

export const ROUTES: Route[] = [
  {
    battleBackground: BattleBackground.Grass,
    connects: ['gleam-village', 'abandoned-camp'],
    enemies: [
      { id: 'merda', level: 5 },
      { id: 'gator', level: 5 },
    ],
    id: 'gleam-outskirts',
    name: 'Gleam Outskirts',
    type: LandmarkType.Route,
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function randomEnemy(route: Route): ZoidStats {
  const ref = route.enemies[Math.floor(Math.random() * route.enemies.length)];
  return resolveZoid(ref);
}
