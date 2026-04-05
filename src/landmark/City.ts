import { NPCDialogs } from '../npc/dialogs';
import { PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionTalkToNPC } from './action/ActionTalkToNPC';
import type { CityAction } from './action/CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { getPilot } from './Pilot';

export interface City extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.City;
}

export const CITIES: City[] = [
  {
    actions: [
      new ActionFightPilot(getPilot('bandit1')!, 'Fight Bandit', [new PilotDefeatRequirement('bandit1', 'Bandit')]),
      new ActionTalkToNPC('woman', NPCDialogs.woman, 'Talk to Woman', undefined, [new PilotDefeatRequirement('bandit1', 'Bandit')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'abandoned-camp',
    mapPosition: { x: 51.5, y: 85 },
    name: 'Abandoned Camp',
    requirements: [new RouteKillRequirement('gleam-outskirts', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [new ActionTalkToNPC('boy', NPCDialogs.boy, 'Talk to Boy')],
    battleBackground: BattleBackground.Grass,
    id: 'gleam-village',
    mapPosition: { x: 53, y: 87 },
    name: 'Gleam Village',
    type: LandmarkType.City,
  },
  {
    actions: [],
    battleBackground: BattleBackground.Grass,
    id: 'wind-colony',
    mapPosition: { x: 50, y: 83 },
    name: 'Wind Colony',
    requirements: [new RouteKillRequirement('wind-road', 10)],
    type: LandmarkType.City,
  },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
