import { CAMPAIGNS } from '../campaign/campaigns';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { DUNGEON_EVENTS } from '../dungeon/dungeonEvents';
import { BossTier, PilotBossEntry, WildBossEntry } from '../dungeon/DungeonSortieConfig';
import { DUNGEON_SUPPLIES } from '../dungeon/dungeonSupplies';
import { ItemDrop } from '../item';
import { DungeonCompletionRequirement, MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement, ZoidCreatedRequirement } from '../requirement';
import { cutsceneReward } from '../reward';
import { ActionTalkToNPC } from './action/ActionTalkToNPC';
import type { CityAction } from './action/CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { STRAY_CHAIN_ACTIONS } from '../story/eventchains/strayChain';

export interface Dungeon extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.Dungeon;
}

const C = CAMPAIGNS.sleeper_commander;
const S = CAMPAIGNS.shells_of_time;

export const DUNGEONS: Dungeon[] = [
  {
    actions: [
      new DungeonSortieEvent({
        id: 'elmia_ruins_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        bossTiers: [
          new BossTier([new PilotBossEntry('bul')]),
          new BossTier([new PilotBossEntry('bianco_nero')], [new MissionCompletedRequirement(C.id, 'find_van')]),
          new BossTier([new PilotBossEntry('bianco_nero'), new PilotBossEntry('bul')], [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')]),
          new BossTier([new PilotBossEntry('bianco_nero'), new PilotBossEntry('bul'), new WildBossEntry({id:'glidoler', level:40, maxHealthOverride: 4000, attackOverride: 30})], [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero'), new ZoidCreatedRequirement('glidoler')]),
        ],
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
          new BossTier([new WildBossEntry({ id: 'sinker', level: 40, maxHealthOverride: 6000, attackOverride: 20 })]),
          new BossTier([new WildBossEntry({ id: 'sinker', level: 40, maxHealthOverride: 6000, attackOverride: 20 }), new WildBossEntry({ id: 'elephantus', level: 24, maxHealthOverride: 8000 })], [new ZoidCreatedRequirement('elephantus')]),
        ],
        enemies: [
          { zoidData: { attackOverride: 10, id: 'gorgodos', level: 24, maxHealthOverride: 500 } },
          { zoidData: { attackOverride: 15, id: 'gunbeetle', level: 24, maxHealthOverride: 400 } },
          { zoidData: { attackOverride: 12, id: 'gator', level: 25, maxHealthOverride: 480 } },
        ],
        eliteEnemies: [
          { zoidData: { id: 'giraffsworder', level: 30, maxHealthOverride: 800 } },
          { zoidData: { id: 'gunbeetle', level: 30, maxHealthOverride: 800 } },
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
  {
    actions: [
      new DungeonSortieEvent({
        baseReward: { magnis: 400, zi_metal: 15 },
        bossTiers: [
          new BossTier([new WildBossEntry({ attackOverride: 25, id: 'hidocker', level: 45, maxHealthOverride: 10000 })]),
          new BossTier([new WildBossEntry({ attackOverride: 30, id: 'helcat', level: 45, maxHealthOverride: 8000 })], [new MissionCompletedRequirement(S.id, 'father_backstory')]),
          new BossTier([new WildBossEntry({ attackOverride: 65, id: 'helcat_stray', level: 50, maxHealthOverride: 15000, scannable: false })], [new MissionCompletedRequirement(S.id, 'clear_ruins_demo')]),
          new BossTier([new WildBossEntry({ attackOverride: 25, id: 'hidocker', level: 45, maxHealthOverride: 10000 }), new WildBossEntry({ attackOverride: 30, id: 'helcat', level: 45, maxHealthOverride: 8000 })], [new MissionCompletedRequirement(S.id, 'survive_stray')]),
        ],
        eliteEnemies: [
          { zoidData: { id: 'aquadon', level: 38, maxHealthOverride: 1000 } },
          { zoidData: { id: 'stealth_viper', level: 36, maxHealthOverride: 1200 } },
        ],
        enemies: [
          { zoidData: { attackOverride: 15, id: 'giraffsworder', level: 32, maxHealthOverride: 700 } },
          { zoidData: { attackOverride: 18, id: 'gunbeetle', level: 32, maxHealthOverride: 600 } },
          { zoidData: { attackOverride: 12, id: 'gorgodos', level: 30, maxHealthOverride: 650 } },
        ],
        entryCost: 50,
        eventPool: [
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.mysterious_creature,
        ],
        id: 'sommerso_ruins_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        layers: 4,
        nodesPerLayer: [3, 4],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
      }),
      new ActionTalkToNPC('dr_thrun', [new DungeonCompletionRequirement('sommerso_ruins_sortie', 1)], [new MissionCompletedRequirement(S.id, 'meet_father')]),
      ...STRAY_CHAIN_ACTIONS,
    ],
    battleBackground: BattleBackground.Ruin,
    devOnly: true,
    id: 'sommerso_ruins',
    mapPosition: { x: 40, y: 42 },
    name: 'Sommerso Ruins',
    requirements: [new RouteKillRequirement('sommerso_trail', 10)],
    type: LandmarkType.Dungeon,
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find((d) => d.id === id);
}
