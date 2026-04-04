import { type ZoidRef, type ZoidStats, resolveZoid } from './Zoid';

export type BackgroundType = 'desert' | 'grass';

export interface Route {
  background: BackgroundType;
  enemies: ZoidRef[];
  name: string;
  number: number;
}

export const ROUTES: Route[] = [
  { background: 'grass', enemies: [
    { id: 'molga', level: 1 },
    { id: 'merda', level: 1},
  ], name: 'Grasslands', number: 1 },
];

export function getRoute(number: number): Route | undefined {
  return ROUTES.find((r) => r.number === number);
}

export function randomEnemy(route: Route): ZoidStats {
  const ref = route.enemies[Math.floor(Math.random() * route.enemies.length)];
  return resolveZoid(ref);
}
