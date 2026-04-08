import { CAMPAIGNS } from '../campaign/campaigns';
import { PILOTS } from '../models/Pilot';
import { MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { cutsceneReward } from '../reward';
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

const C = CAMPAIGNS.sleeper_commander;

export const DUNGEONS: Dungeon[] = [
  {
    actions: [
      new ActionTalkToNPC('bianco', undefined, [new PilotDefeatRequirement('bul')], undefined, 'ui:listen_to_bandits'),
      new ActionFightPilot(PILOTS['bul'], [new MissionCompletedRequirement(C.id, 'listen_to_bandits')], [new PilotDefeatRequirement('bul')]),
      new ActionTalkToNPC('van', [new PilotDefeatRequirement('bul')], [new PilotDefeatRequirement('bianco_nero')]),
      new ActionFightPilot(PILOTS['bianco_nero'], [new MissionCompletedRequirement(C.id, 'find_van')], [new PilotDefeatRequirement('bianco_nero')]),
      new ActionTalkToNPC('bianco', [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')], [new MissionCompletedRequirement(C.id, 'interrogate_bandits')], cutsceneReward('dialog:narration_discover_fione'), 'ui:interrogate_bandits'),
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
