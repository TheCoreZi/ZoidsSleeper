import type { Drop } from '../item/Drop';
import { MissionCompletedRequirement } from '../requirement';
import type { CurrencyReward } from '../models/Currency';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { type ZoidBlueprint, type CustomizedZoid, getZoidById, buildZoid } from '../models/Zoid';
import { CAMPAIGNS } from '../campaign/campaigns';

export interface Route extends Landmark {
  baseReward: CurrencyReward;
  connects: [string, string];
  enemies: ZoidBlueprint[];
  itemDrops?: Drop[];
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
    baseReward: { magnis: 30, zi_metal: 4 },
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
    baseReward: { magnis: 50, zi_metal: 8 },
    routeHealth: 66,
    name: 'Wind Road',
    requirements: [new MissionCompletedRequirement('sleeper_commander', 'captain_farewell')],
    type: LandmarkType.Route,
  },
  {
    baseReward: { magnis: 80, zi_metal: 13 },
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
  {
    baseReward: { magnis: 100, zi_metal: 16 },
    battleBackground: BattleBackground.Desert,
    connects: ['wind_colony', 'wind_oasis'],
    enemies: [
      { id: 'gator', level: 18 },
      { id: 'malder', level: 16 },
      { id: 'spiker', level: 18 },
      { id: 'zatton', level: 20 },
    ],
    id: 'dustwind_trail',
    name: 'Dustwind Trail',
    routeHealth: 300,
    requirements: [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'maria_van_status')],
    type: LandmarkType.Route,
  },
  {
    baseReward: { magnis: 120, zi_metal: 20 },
    battleBackground: BattleBackground.Desert,
    connects: ['wind_colony', 'arcobaleno_camp'],
    enemies: [
      { id: 'gorgodos', level: 22 },
      { id: 'molga', level: 20 },
      { id: 'spiker', level: 20 },
      { id: 'zatton', level: 22 },
    ],
    id: 'bandit_trail',
    name: 'Bandit Trail',
    routeHealth: 400,
    requirements: [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'talk_to_van_tied')],
    type: LandmarkType.Route,
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function randomEnemy(route: Route): CustomizedZoid {
  const ref = route.enemies[Math.floor(Math.random() * route.enemies.length)];
  const stats = buildZoid(ref);
  const baseHp = getZoidById(ref.id).maxHealth;
  const avgHp = route.enemies.reduce((sum, e) => sum + getZoidById(e.id).maxHealth, 0) / route.enemies.length;
  return { ...stats, maxHealth: Math.max(1, Math.round(route.routeHealth * (0.6 + baseHp / avgHp / 2 ))) };
}
