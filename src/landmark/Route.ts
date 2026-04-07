import { MissionCompletedRequirement } from '../requirement';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { type ZoidRef, type ZoidStats, getZoidById, resolveZoid } from '../models/Zoid';
import { CAMPAIGNS } from '../campaign/campaigns';

export interface Route extends Landmark {
  connects: [string, string];
  enemies: ZoidRef[];
  baseReward: number;
  routeHealth: number;
  type: typeof LandmarkType.Route;
}

export const ROUTES: Route[] = [
  {
    battleBackground: BattleBackground.Grass,
    connects: ['gleam_village', 'abandoned_camp'],
    enemies: [
      { id: 'merda', level: 5 },
      { id: 'gator', level: 5 },
      { id: 'malder', level: 5 },
    ],
    id: 'gleam_outskirts',
    baseReward: 30, // 5 ~ 55 Magnis
    routeHealth: 20,
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
      { id: 'malder', level: 8 },
      { id: 'zatton', level: 10 },
    ],
    id: 'wind_road',
    baseReward: 50, // 25 ~ 75 Magnis
    routeHealth: 66,
    name: 'Wind Road',
    requirements: [new MissionCompletedRequirement('sleeper_commander', 'captain_farewell')],
    type: LandmarkType.Route,
  },
  {
    baseReward: 80,
    battleBackground: BattleBackground.Desert,
    connects: ['wind_colony', 'elmia_ruins'],
    enemies: [
      { id: 'gator', level: 14 },
      { id: 'malder', level: 12 },
      { id: 'merda', level: 12 },
      { id: 'molga', level: 14 },
      { id: 'zatton', level: 15 },
    ],
    id: 'elmia_desert',
    name: 'Elmia Desert',
    routeHealth: 200,
    requirements: [new MissionCompletedRequirement('sleeper_commander', 'talk_to_maria')],
    type: LandmarkType.Route,
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function randomEnemy(route: Route): ZoidStats {
  const ref = route.enemies[Math.floor(Math.random() * route.enemies.length)];
  const stats = resolveZoid(ref);
  const baseHp = getZoidById(ref.id).maxHealth;
  const avgHp = route.enemies.reduce((sum, e) => sum + getZoidById(e.id).maxHealth, 0) / route.enemies.length;
  return { ...stats, maxHealth: Math.max(1, Math.round(route.routeHealth * (0.6 + baseHp / avgHp / 2 ))) };
}
