import { type ConsumableItem, ITEMS } from '../item';
import { PILOTS } from '../models/Pilot';
import { ItemRequirement, MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { addItem } from '../store/inventoryStore';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionTalkToNPC } from './action/ActionTalkToNPC';
import { ActionVisitDepot } from './action/ActionVisitDepot';
import { ActionVisitLab } from './action/ActionVisitLab';
import type { CityAction } from './action/CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';

export interface City extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.City;
}

export const CITIES: City[] = [
  {
    actions: [
      new ActionFightPilot(PILOTS['bandit1'], undefined, [new PilotDefeatRequirement('bandit1')]),
      new ActionTalkToNPC('woman', [new PilotDefeatRequirement('bandit1')], [new MissionCompletedRequirement('sleeper_commander', 'report_to_captain')], () => addItem('sleeper_module', 1, true)),
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
      new ActionVisitDepot([ITEMS.core_probe as ConsumableItem], [new ItemRequirement(ITEMS.core_analyzer.id)]),
      new ActionVisitLab('jenkins_lab', [new MissionCompletedRequirement('sleeper_commander', 'jenkins_to_work')]),
      new ActionTalkToNPC('becker', [new ItemRequirement(ITEMS.core_probe.id)]),
      new ActionTalkToNPC('boy', undefined, [new MissionCompletedRequirement('sleeper_commander', 'talk_to_hostage')]),
      new ActionTalkToNPC('captain_malinoff', [new ItemRequirement(ITEMS.sleeper_module.id)], [new MissionCompletedRequirement('sleeper_commander', 'talk_to_jenkins')]),
      new ActionTalkToNPC('captain_malinoff', [new MissionCompletedRequirement('sleeper_commander', 'grow_army')]),
      new ActionTalkToNPC('jenkins', [new MissionCompletedRequirement('sleeper_commander', 'report_to_captain')], [new MissionCompletedRequirement('sleeper_commander', 'jenkins_to_work')], () => addItem(ITEMS.core_analyzer.id, 1, true)),
      new ActionTalkToNPC('scrap_dealer'),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'gleam_village',
    mapPosition: { x: 53, y: 87 },
    name: 'Gleam Village',
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('maria_flyheight', [new MissionCompletedRequirement('sleeper_commander', 'talk_to_priest_leon')]),
      new ActionTalkToNPC('priest_leon', undefined, [new MissionCompletedRequirement('sleeper_commander', 'talk_to_maria')]),
    ],
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
