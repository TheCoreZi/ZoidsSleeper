import { CAMPAIGNS } from '../campaign/campaigns';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { DUNGEON_EVENTS } from '../dungeon/dungeonEvents';
import type { BossTier } from '../dungeon/DungeonSortieConfig';
import { DUNGEON_SUPPLIES } from '../dungeon/dungeonSupplies';
import { ItemDrop } from '../item';
import { MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { cutsceneReward } from '../reward';
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
      new DungeonSortieEvent({
        id: 'elmia_ruins_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        bossTiers: [
          { pilots: ['bul'] },
          { pilots: ['bianco_nero'], requirements: [new MissionCompletedRequirement(C.id, 'find_van')] },
          { pilots: ['bianco_nero', 'bul'], requirements: [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')] },
        ] satisfies BossTier[],
        enemies: [
          { zoidData: { attackOverride: 1, id: 'gator', level: 14, maxHealthOverride: 80 } },
          { zoidData: { attackOverride: 1, id: 'malder', level: 12, maxHealthOverride: 100 } },
          { zoidData: { attackOverride: 1, id: 'zatton', level: 15, maxHealthOverride: 150 } },
        ],
        eliteEnemies: [
          { zoidData: { attackOverride: 2, id: 'guysack', level: 20, maxHealthOverride: 300 }, requirement: new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')},
          { zoidData: { attackOverride: 2, id: 'molga', level: 20, bonusMultiplier: 1.1 } },
        ],
        baseReward: { magnis: 200, zi_metal: 5 },
        entryCost: 3,
        layers: 4,
        nodesPerLayer: [3, 4],
        eventPool: [
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.mysterious_creature,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
        requirements: [new MissionCompletedRequirement(C.id, 'listen_to_bandits')],
      }),
      new ActionTalkToNPC('bianco', undefined, [new PilotDefeatRequirement('bul')], undefined, 'ui:listen_to_bandits'),
      new ActionTalkToNPC('van', [new PilotDefeatRequirement('bul')], [new PilotDefeatRequirement('bianco_nero')]),
      new ActionTalkToNPC('bianco', [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')], [new MissionCompletedRequirement(C.id, 'interrogate_bandits')], cutsceneReward('narration_discover_fione'), 'ui:interrogate_bandits'),
    ],
    battleBackground: BattleBackground.Ruin,
    id: 'elmia_ruins',
    mapPosition: { x: 32, y: 28 },
    name: 'Elmia Ruins',
    requirements: [new RouteKillRequirement('elmia_desert', 10)],
    type: LandmarkType.Dungeon,
  },
  {
    actions: [
      new DungeonSortieEvent({
        id: 'tauros_grotto_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        bossTiers: [
          { pilots: ['arcadia_guard'] },
        ] satisfies BossTier[],
        enemies: [
          { zoidData: { attackOverride: 10, id: 'gorgodos', level: 24, maxHealthOverride: 500 } },
          { zoidData: { attackOverride: 15, id: 'gunbeetle', level: 24, maxHealthOverride: 400 } },
          { zoidData: { attackOverride: 12, id: 'gator', level: 25, maxHealthOverride: 480 } },
        ],
        eliteEnemies: [
          { zoidData: { id: 'sinker', level: 30, maxHealthOverride: 400 } },
        ],
        baseReward: { magnis: 300, zi_metal: 10 },
        entryCost: 30,
        layers: 4,
        nodesPerLayer: [3, 4],
        eventPool: [
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.mysterious_creature,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
      }),
    ],
    battleBackground: BattleBackground.Rock,
    devOnly: true,
    id: 'tauros_grotto',
    mapPosition: { x: 33.5, y: 42 },
    name: 'Tauros Grotto',
    requirements: [new RouteKillRequirement('tauros_edge', 10)],
    type: LandmarkType.Dungeon,
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find((d) => d.id === id);
}
