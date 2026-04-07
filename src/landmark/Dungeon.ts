import { CAMPAIGNS } from '../campaign/campaigns';
import { PILOTS } from '../models/Pilot';
import { MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionTalkToNPC } from './action/ActionTalkToNPC';
import type { CityAction } from './action/CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';

export interface Dungeon extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.Dungeon;
}

export const DUNGEONS: Dungeon[] = [
  {
    actions: [
      new ActionTalkToNPC('bianco', [new PilotDefeatRequirement('bul')], undefined, undefined, 'ui:listen_to_bandits'),
      new ActionFightPilot(PILOTS['bul'], [new PilotDefeatRequirement('bul')], [new MissionCompletedRequirement(CAMPAIGNS.sleeper_commander.id, 'listen_to_bandits')]),
    ],
    battleBackground: BattleBackground.Desert,
    id: 'elmia_ruins',
    mapPosition: { x: 52, y: 82 },
    name: 'Elmia Ruins',
    requirements: [new RouteKillRequirement('elmia_desert', 10)],
    type: LandmarkType.Dungeon,
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find((d) => d.id === id);
}
