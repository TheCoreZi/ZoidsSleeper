import { MissionCompletedRequirement } from '../requirement';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { type ZoidRef, type ZoidStats, resolveZoid } from '../models/Zoid';
import { CAMPAIGNS } from '../campaign/campaigns';

export interface Route extends Landmark {
  connects: [string, string];
  enemies: ZoidRef[];
  type: typeof LandmarkType.Route;
}

export const ROUTES: Route[] = [
  {
    battleBackground: BattleBackground.Grass,
    connects: ['gleam_village', 'abandoned_camp'],
    enemies: [
      { id: 'merda', level: 5 },
      { id: 'gator', level: 5 },
    ],
    id: 'gleam_outskirts',
    name: 'Gleam Outskirts',
    requirements: [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'talk_to_boy')],
    type: LandmarkType.Route,
  },
  {
    battleBackground: BattleBackground.Desert,
    connects: ['abandoned_camp', 'wind_colony'],
    enemies: [
      { id: 'merda', level: 8 },
      { id: 'gator', level: 8 },
    ],
    id: 'wind_road',
    name: 'Wind Road',
    requirements: [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'report_to_captain')],
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
