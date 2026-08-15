import { CAMPAIGNS } from '../campaign/campaigns';
import { CUTSCENES } from '../cutscene';
import { FEATURE_FLAGS } from '../featureFlag';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { DUNGEON_EVENTS } from '../dungeon/dungeonEvents';
import { BossTier, PilotBossEntry, WildBossEntry } from '../dungeon/DungeonSortieConfig';
import { NodeProbability } from '../dungeon/DungeonSortieEvent';
import { DUNGEON_SUPPLIES } from '../dungeon/dungeonSupplies';
import { ItemDrop } from '../item';
import { COMPOUND_REQUIREMENTS, CurrentMissionRequirement, DungeonCompletionRequirement, MissionCompletedRequirement, PilotDefeatRequirement, RouteKillRequirement, ZoidCreatedRequirement } from '../requirement';
import { PILOTS } from '../models/Pilot';
import { activateCityActionReward, cutsceneReward, missionAdvanceReward } from '../reward';
import { ActionDuelWild } from './action/ActionDuelWild';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionPlayCutscene } from './action/ActionPlayCutscene';
import { ActionFightWild } from './action/ActionFightWild';
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
const G = CAMPAIGNS.olympus_guylos;
const O = CAMPAIGNS.olympus_threat;
const S = CAMPAIGNS.shells_of_time;

export const DUNGEONS: Dungeon[] = [
  {
    actions: [
      new DungeonSortieEvent({
        baseReward: { magnis: 250, zi_metal: 8 },
        bossTiers: [
          new BossTier([new WildBossEntry({ attackOverride: 100, id: 'guysack', level: 70, maxHealthOverride: 30000, scannable: false })]),
          new BossTier([new WildBossEntry({ attackOverride: 150, id: 'guysack', level: 70, maxHealthOverride: 35000, scannable: false })], [new MissionCompletedRequirement(G.id, 'clear_hollow_ruins')]),
          new BossTier([new WildBossEntry({ attackOverride: 200, id: 'guysack', level: 75, maxHealthOverride: 40000, scannable: false })], [new MissionCompletedRequirement(G.id, 'escape_ruins')]),
          new BossTier([new WildBossEntry({ attackOverride: 300, id: 'guysack_heavy_armor', level: 80, maxHealthOverride: 50000, scannable: false })], [new MissionCompletedRequirement(G.id, 'defeat_guysack_heavy_armor')]),
        ],
        eliteEnemies: [
          { zoidData: { attackOverride: 200, id: 'guysack', level: 30, maxHealthOverride: 3000 } },
        ],
        enemies: [
          { zoidData: { attackOverride: 100, id: 'guysack', level: 25, maxHealthOverride: 2000 } },
        ],
        entryCost: 80,
        eventPool: [
          DUNGEON_EVENTS.enemy_patrol,
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
          DUNGEON_EVENTS.fallen_soldiers,
          DUNGEON_EVENTS.stray_zoid,
        ],
        nodeTypeChances: {
          combat: new NodeProbability(0.50, -0.20),
          elite: new NodeProbability(0.25, 0.30),
          event: new NodeProbability(0.20, -0.05),
        },
        fragmentYield: 5,
        id: 'hollow_ruins_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        layers: 5,
        nodesPerLayer: [4, 5],
        requirements: [new MissionCompletedRequirement(G.id, 'scout_ruins')],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
      }),
      new ActionTalkToNPC('eddie_crescent', [new MissionCompletedRequirement(G.id, 'scout_ruins')], [new MissionCompletedRequirement(G.id, 'clear_hollow_ruins')], undefined, 'ui:scout_area'),
      new ActionTalkToNPC('eddie_crescent', [new MissionCompletedRequirement(G.id, 'ruins_briefing')], [new MissionCompletedRequirement(G.id, 'scout_ruins')], missionAdvanceReward(G.id), 'ui:scout_area'),
      new ActionPlayCutscene(CUTSCENES.narration_ruins_aftermath, 'ui:review_findings',
        [new MissionCompletedRequirement(G.id, 'clear_hollow_ruins')],
        [new MissionCompletedRequirement(G.id, 'explore_lower_level')]),

      // Mission 5: First fight against Guysack Heavy Armor (hold the line)
      new ActionFightWild(
        'guysack_heavy_armor_wild',
        [{ attackOverride: 200, id: 'guysack_heavy_armor', level: 75, maxHealthOverride: 40000, scannable: false }],
        { magnis: 5000, zi_metal: 50 },
        5,
        [new MissionCompletedRequirement(G.id, 'explore_lower_level')],
        [new MissionCompletedRequirement(G.id, 'fight_guysack_heavy_armor')]
      ),
      // Mission 7: Rhine's escape plan
      new ActionTalkToNPC('rhine_hawk',
        [new MissionCompletedRequirement(G.id, 'escape_ruins')],
        [new MissionCompletedRequirement(G.id, 'rhine_plan')],
        undefined,
        'ui:escape_ruins'),
      // Mission 9: Final duel against Guysack Heavy Armor (destroy transmitters)
      new ActionDuelWild(
        'zoids:guysack_heavy_armor',
        'guysack_heavy_armor_wild',
        [{ attackOverride: 150, id: 'guysack_heavy_armor', level: 80, maxHealthOverride: 10000, scannable: false }],
        { magnis: 10000, zi_metal: 100 },
        10,
        [new MissionCompletedRequirement(G.id, 'return_to_eddie')],
        [new MissionCompletedRequirement(G.id, 'defeat_guysack_heavy_armor')]
      ),
      // --- Helic Campaign: Sleeper Ruins ---
      // Helic sortie (clear Imperial Sleepers + install transmitters)
      new DungeonSortieEvent({
        baseReward: { magnis: 250, zi_metal: 8 },
        bossTiers: [
          new BossTier([new WildBossEntry({ attackOverride: 150, id: 'cannory_molga', level: 70, maxHealthOverride: 30000, scannable: false })]),
          new BossTier([new WildBossEntry({ attackOverride: 200, id: 'cannory_molga', level: 75, maxHealthOverride: 40000, scannable: false })], [new MissionCompletedRequirement(O.id, 'clear_ruins')]),
          new BossTier([new WildBossEntry({ attackOverride: 300, id: 'cannory_molga', level: 80, maxHealthOverride: 50000, scannable: false })], [new MissionCompletedRequirement(O.id, 'install_transmitters')]),
          new BossTier([new WildBossEntry({ attackOverride: 300, id: 'guysack_heavy_armor', level: 80, maxHealthOverride: 50000, scannable: false })], [new CurrentMissionRequirement(O.id, 'escape_ruins')]),
        ],
        eliteEnemies: [
          { zoidData: { attackOverride: 200, id: 'molga', level: 30, maxHealthOverride: 3000 } },
        ],
        enemies: [
          { zoidData: { attackOverride: 100, id: 'molga', level: 25, maxHealthOverride: 2000 } },
        ],
        entryCost: 80,
        eventPool: [
          DUNGEON_EVENTS.enemy_patrol,
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
          DUNGEON_EVENTS.fallen_soldiers,
          DUNGEON_EVENTS.stray_zoid,
        ],
        nodeTypeChances: {
          combat: new NodeProbability(0.50, -0.20),
          elite: new NodeProbability(0.25, 0.30),
          event: new NodeProbability(0.20, -0.05),
        },
        fragmentYield: 5,
        id: 'hollow_ruins_helic_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        layers: 5,
        nodesPerLayer: [4, 5],
        requirements: [new MissionCompletedRequirement(O.id, 'badol_post_ambush')],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
      }),
      // Helic: Badol post-ambush talk
      new ActionTalkToNPC('badol_decisive',
        [new MissionCompletedRequirement(O.id, 'fight_sea_panther')],
        [new MissionCompletedRequirement(O.id, 'clear_ruins')]),
      // Helic: Activate system (talk to Rain)
      new ActionTalkToNPC('cynian_rain',
        [
          new MissionCompletedRequirement(O.id, 'install_transmitters'),
          new DungeonCompletionRequirement('hollow_ruins_helic_sortie', 3),
        ],
        [new MissionCompletedRequirement(O.id, 'fight_rain')],
        undefined,
        'ui:activate_system'),
      // Helic: Fight Rain
      new ActionFightPilot(PILOTS['cynian_rain_duel'],
        [new MissionCompletedRequirement(O.id, 'activate_system')],
        [new PilotDefeatRequirement('cynian_rain_duel')]),
    ],
    battleBackground: BattleBackground.Ruin,
    featureFlag: FEATURE_FLAGS.RED_RIVER,
    id: 'hollow_ruins',
    mapPosition: { x: 31, y: 27 },
    name: 'Hollow Ruins',
    requirements: [new RouteKillRequirement('ruins_path', 10)],
    type: LandmarkType.Dungeon,
  },
  {
    actions: [
      new DungeonSortieEvent({
        fragmentYield: 2,
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
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
        requirements: [COMPOUND_REQUIREMENTS.moonbay_elmia_not_faction],
      }),
      new DungeonSortieEvent({
        fragmentYield: 6,
        id: 'elmia_ruins_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        bossTiers: [
          new BossTier([new PilotBossEntry('bul'), new WildBossEntry({ id: 'cannon_tortoise_bc', level: 90, maxHealthOverride: 100000, attackOverride: 200, scannable: false})]),
          new BossTier([new PilotBossEntry('bianco_nero'), new PilotBossEntry('bul'), new WildBossEntry({ id: 'cannon_tortoise_bc', level: 90, maxHealthOverride: 100000, attackOverride: 200, scannable: false}) ], [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')]),
          new BossTier([new PilotBossEntry('bianco_nero'), new PilotBossEntry('bul'), new WildBossEntry({ id: 'cannon_tortoise_bc', level: 90, maxHealthOverride: 100000, attackOverride: 200, scannable: false}), new WildBossEntry({id:'glidoler', level:90, maxHealthOverride: 80000, attackOverride: 300})], [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero'), new ZoidCreatedRequirement('glidoler')]),
        ],
        enemies: [
          { zoidData: { attackOverride: 150, id: 'gator', level: 80, maxHealthOverride: 6000 } },
          { zoidData: { attackOverride: 100, id: 'malder', level: 80, maxHealthOverride: 7000 } },
          { zoidData: { attackOverride: 180, id: 'zatton', level: 82, maxHealthOverride: 6000 } },
        ],
        eliteEnemies: [
          { zoidData: { attackOverride: 200, id: 'guysack', level: 75, maxHealthOverride: 8000 } },
          { zoidData: { attackOverride: 200, id: 'molga', level: 75, maxHealthOverride: 8000 } },
        ],
        baseReward: { magnis: 400, zi_metal: 15 },
        entryCost: 100,
        layers: 5,
        nodesPerLayer: [3, 4],
        eventPool: [
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
          DUNGEON_EVENTS.downed_zoid,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
        requirements: [COMPOUND_REQUIREMENTS.moonbay_elmia],
      }),
      new ActionTalkToNPC('bianco', undefined, [new PilotDefeatRequirement('bul')], undefined, 'ui:listen_to_bandits'),
      new ActionTalkToNPC('van', [new PilotDefeatRequirement('bul')], [new PilotDefeatRequirement('bianco_nero')]),
      new ActionTalkToNPC('bianco', [new MissionCompletedRequirement(C.id, 'defeat_bianco_nero')], [new MissionCompletedRequirement(C.id, 'interrogate_bandits')], cutsceneReward('narration_discover_fione'), 'ui:interrogate_bandits'),
      // Segment 2: Recover cargo - elmia bandits
      ...(() => {
        const moonbayTalk = new ActionTalkToNPC('moonbay',
          [new PilotDefeatRequirement('bandits_elmia')],
          [new MissionCompletedRequirement(G.id, 'recover_cargo')]);
        return [
          new ActionFightPilot(PILOTS['bandits_elmia'],
            [new MissionCompletedRequirement(G.id, 'arcobaleno_ambush')],
            [new PilotDefeatRequirement('bandits_elmia')],
            false,
            activateCityActionReward(moonbayTalk)),
          moonbayTalk,
        ];
      })(),
    ],
    battleBackground: BattleBackground.Ruin,
    id: 'elmia_ruins',
    mapPosition: { x: 27, y: 29 },
    name: 'Elmia Ruins',
    requirements: [new RouteKillRequirement('elmia_desert', 10)],
    type: LandmarkType.Dungeon,
  },
  {
    actions: [
      new DungeonSortieEvent({
        fragmentYield: 2,
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
          DUNGEON_EVENTS.enemy_patrol,
          DUNGEON_EVENTS.fallen_soldiers,
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
        requirements: [COMPOUND_REQUIREMENTS.tauros_not_faction],
      }),
      new DungeonSortieEvent({
        fragmentYield: 6,
        id: 'tauros_grotto_sortie',
        itemDrops: [new ItemDrop('core_preserver', 10)],
        bossTiers: [
          new BossTier([new WildBossEntry({ id: 'sinker', level: 80, maxHealthOverride: 40000, attackOverride: 300 })]),
          new BossTier([new WildBossEntry({ id: 'sinker', level: 80, maxHealthOverride: 40000, attackOverride: 300 }), new WildBossEntry({ id: 'elephantus', level: 100, maxHealthOverride: 100000 })], [new ZoidCreatedRequirement('elephantus')]),
        ],
        enemies: [
          { zoidData: { attackOverride: 100, id: 'gorgodos', level: 70, maxHealthOverride: 5000 } },
          { zoidData: { attackOverride: 150, id: 'gunbeetle', level: 72, maxHealthOverride: 4000 } },
          { zoidData: { attackOverride: 120, id: 'gator', level: 75, maxHealthOverride: 4800 } },
        ],
        eliteEnemies: [
          { zoidData: { id: 'giraffsworder', level: 80, maxHealthOverride: 8000 } },
          { zoidData: { id: 'gunbeetle', level: 80, maxHealthOverride: 8000 } },
        ],
        baseReward: { magnis: 400, zi_metal: 60 },
        entryCost: 100,
        layers: 6,
        nodesPerLayer: [3, 4],
        eventPool: [
          DUNGEON_EVENTS.enemy_patrol,
          DUNGEON_EVENTS.fallen_soldiers,
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.sealed_chamber,
        ],
        supplyOptions: [
          DUNGEON_SUPPLIES.field_repair,
          DUNGEON_SUPPLIES.overclock,
        ],
        requirements: [COMPOUND_REQUIREMENTS.tauros_moonbay],
      }),
      // Segment 2: Arrive at Tauros
      new ActionTalkToNPC('eddie_crescent',
        [new MissionCompletedRequirement(G.id, 'fight_dock_thugs')],
        [new MissionCompletedRequirement(G.id, 'find_moonbay')]),
      // Segment 2: Meet Moonbay (after dungeon complete)
      new ActionTalkToNPC('moonbay',
        [new MissionCompletedRequirement(G.id, 'find_moonbay')],
        [new MissionCompletedRequirement(G.id, 'arcobaleno_ambush')]),
    ],
    battleBackground: BattleBackground.Rock,

    id: 'tauros_grotto',
    mapPosition: { x: 34, y: 44 },
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
          DUNGEON_EVENTS.enemy_patrol,
          DUNGEON_EVENTS.fallen_soldiers,
          DUNGEON_EVENTS.mysterious_creature,
          DUNGEON_EVENTS.mysterious_device,
          DUNGEON_EVENTS.downed_zoid,
          DUNGEON_EVENTS.sealed_chamber,
          DUNGEON_EVENTS.stray_zoid,
        ],
        fragmentYield: 3,
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

    id: 'sommerso_ruins',
    mapPosition: { x:33, y: 50 },
    name: 'Sommerso Ruins',
    requirements: [new RouteKillRequirement('sommerso_trail', 10)],
    type: LandmarkType.Dungeon,
  },
];

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find((d) => d.id === id);
}
