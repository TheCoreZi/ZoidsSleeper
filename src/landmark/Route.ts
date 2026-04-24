import type { Drop } from '../item/Drop';
import type { Requirement } from '../requirement';
import { CampaignStartedRequirement, MissionCompletedRequirement, RouteKillRequirement, ZoidCreatedRequirement } from '../requirement';
import type { CurrencyReward } from '../models/Currency';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { type ZoidBlueprint, type CustomizedZoid, getZoidById, buildZoid } from '../models/Zoid';
import { probabilityRandom } from '../utils/probabilityRandom';
import { CAMPAIGNS } from '../campaign/campaigns';

export interface RouteEnemy {
  blueprint: ZoidBlueprint;
  probability?: number;
  unlockRequirement?: Requirement;
}

export interface Route extends Landmark {
  baseReward: CurrencyReward;
  connects: [string, string];
  enemies: RouteEnemy[];
  itemDrops?: Drop[];
  routeHealth: number;
  type: typeof LandmarkType.Route;
}

export const ROUTES: Route[] = [
  {
    battleBackground: BattleBackground.Grass,
    connects: ['gleam_village', 'abandoned_camp'],
    enemies: [
      { blueprint: { id: 'merda', level: 5 } },
      { blueprint: { id: 'gator', level: 5 } },
      { blueprint: { id: 'malder', level: 5 } },
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
      { blueprint: { id: 'garius', level: 8, maxHealthOverride: 1000 }, probability:.05, unlockRequirement: new ZoidCreatedRequirement('garius') },
      { blueprint: { id: 'merda', level: 8 } },
      { blueprint: { id: 'gator', level: 8 } },
      { blueprint: { id: 'malder', level: 8 } },
      { blueprint: { id: 'zatton', level: 10 } },
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
      { blueprint: { id: 'gator', level: 14 } },
      { blueprint: { id: 'malder', level: 12 } },
      { blueprint: { id: 'merda', level: 12 } },
      { blueprint: { id: 'molga', level: 14 } },
      { blueprint: { id: 'zatton', level: 15 } },
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
      { blueprint: { id: 'gator', level: 18 } },
      { blueprint: { id: 'malder', level: 16 } },
      { blueprint: { id: 'spiker', level: 18 } },
      { blueprint: { id: 'zatton', level: 20 } },
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
      { blueprint: { id: 'gorgodos', level: 22 } },
      { blueprint: { id: 'molga', level: 20 } },
      { blueprint: { id: 'spiker', level: 20 } },
      { blueprint: { id: 'zatton', level: 22 } },
    ],
    id: 'bandit_trail',
    name: 'Bandit Trail',
    routeHealth: 400,
    requirements: [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'talk_to_van_tied')],
    type: LandmarkType.Route,
  },
  {
    baseReward: { magnis: 150, zi_metal: 22 },
    battleBackground: BattleBackground.Plain,
    connects: ['gleam_village', 'tauros_grotto'],
    enemies: [
      { blueprint: { id: 'stealth_viper', level: 24 } },
      { blueprint: { id: 'gunbeetle', level: 24 } },
      { blueprint: { id: 'spiker', level: 24 } },
      { blueprint: { id: 'molga', level: 25 } },
      { blueprint: { id: 'malder', level: 24 } },
    ],
    devOnly: true,
    id: 'tauros_edge',
    name: 'Tauros Edge',
    routeHealth: 600,
    requirements: [new CampaignStartedRequirement(CAMPAIGNS.shells_of_time.id)],
    type: LandmarkType.Route,
  },
  {
    baseReward: { magnis: 155, zi_metal: 22 },
    battleBackground: BattleBackground.Dirt,
    connects: ['tauros_grotto', 'porto_nido'],
    enemies: [
      { blueprint: { id: 'giraffsworder', level: 26 } },
      { blueprint: { id: 'sea_panther', level: 27 }, probability: .01 },
      { blueprint: { id: 'zatton', level: 26 } },
      { blueprint: { id: 'gator', level: 28 } },
    ],
    devOnly: true,
    id: 'south_coast',
    name: 'South Coast',
    routeHealth: 700,
    requirements: [new RouteKillRequirement('tauros_edge', 10)],
    type: LandmarkType.Route,
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

export function getUnlockedEnemies(route: Route): RouteEnemy[] {
  return route.enemies.filter((e) => e.unlockRequirement?.isCompleted() ?? true);
}

export function randomEnemy(route: Route): CustomizedZoid {
  const enemies = getUnlockedEnemies(route);
  const enemy = probabilityRandom(enemies, (e) => e.probability);
  const ref = enemy.blueprint;
  const stats = buildZoid(ref);
  if (ref.maxHealthOverride) { return stats; }
  const baseHp = getZoidById(ref.id).maxHealth;
  const avgHp = enemies.reduce((sum, e) => sum + getZoidById(e.blueprint.id).maxHealth, 0) / enemies.length;
  return { ...stats, maxHealth: Math.max(1, Math.round(route.routeHealth * (0.6 + baseHp / avgHp / 2 ))) };
}
