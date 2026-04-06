import { MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionTalkToNPC } from './action/ActionTalkToNPC';
import type { CityAction } from './action/CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { PILOTS } from '../models/Pilot';

export interface City extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.City;
}

export const CITIES: City[] = [
  {
    actions: [
      new ActionFightPilot(PILOTS['bandit1'], [new PilotDefeatRequirement('bandit1')]),
      new ActionTalkToNPC('woman', undefined, [new PilotDefeatRequirement('bandit1')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'abandoned_camp',
    mapPosition: { x: 51.5, y: 85 },
    name: 'Abandoned Camp',
    requirements: [new RouteKillRequirement('gleam_outskirts', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('boy'),
      new ActionTalkToNPC('captain_malinoff', undefined, [new MissionCompletedRequirement('sleeper_commander', 'talk_to_hostage')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'gleam_village',
    mapPosition: { x: 53, y: 87 },
    name: 'Gleam Village',
    type: LandmarkType.City,
  },
  {
    actions: [],
    battleBackground: BattleBackground.Grass,
    id: 'wind_colony',
    mapPosition: { x: 50, y: 83 },
    name: 'Wind Colony',
    requirements: [new RouteKillRequirement('wind_road', 10)],
    type: LandmarkType.City,
  },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
