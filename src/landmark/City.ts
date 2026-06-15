import { CUTSCENES } from '../cutscene';
import { type ConsumableItem, ITEMS } from '../item';
import { CoreType } from '../item/ZoidCore';
import { PILOTS } from '../models/Pilot';
import { ANCIENT_TORTOISE_DUEL, BARRAGE_TORTOISE_DUEL } from '../models/StoryBlueprints';
import { GALE_EW_CHAIN } from '../story/eventchains/galeEwChain';
import { FEATURE_FLAGS } from '../featureFlag';
import { ArmySizeRequirement, COMPOUND_REQUIREMENTS, ComparisonCondition, FeatureFlagRequirement, ImpossibleRequirement, ItemRequirement, MissionCompletedRequirement, NpcTalkedInCampaignRequirement, PilotDefeatRequirement, RouteKillRequirement, WildDefeatRequirement } from '../requirement';
import { activateCityActionReward, compositeReward, cutsceneReward, itemReward, missionAdvanceReward, removeItemReward, removeZiDataReward, removeZoidReward, typedZoidCoreReward, zoidReward } from '../reward';
import { ActionDuelPilot } from './action/ActionDuelPilot';
import { ActionFightPilot } from './action/ActionFightPilot';
import { ActionFightWild } from './action/ActionFightWild';
import { ActionPlayCutscene } from './action/ActionPlayCutscene';
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

const C = 'sleeper_commander';
const S = 'shells_of_time';

const AUTOMATIC_ACTIONS: Record<string, CityAction[]> = {
  arthur_talk_fight_decide: (() => {
    const requirements = [new FeatureFlagRequirement(FEATURE_FLAGS.SHELLS_OF_TIME), new MissionCompletedRequirement(C, 'deliver_girl')];
    const completeRequirements = [new PilotDefeatRequirement('arthur')];
    const hidden = [new ImpossibleRequirement()];
    const decision = new ActionTalkToNPC('arthur', [new PilotDefeatRequirement('arthur')]);
    const fight = new ActionFightPilot(PILOTS['arthur'], hidden, completeRequirements, false, activateCityActionReward(decision));
    const intro = new ActionTalkToNPC('arthur', requirements, completeRequirements, activateCityActionReward(fight));
    return [intro, fight, decision];
  })(),
  concho_talk_fight_decide: (() => {
    const requirements = [new FeatureFlagRequirement(FEATURE_FLAGS.SHELLS_OF_TIME), new MissionCompletedRequirement(C, 'deliver_girl')];
    const completeRequirements = [new PilotDefeatRequirement('concho_cancer')];
    const hidden = [new ImpossibleRequirement()];
    const decision = new ActionTalkToNPC('concho_cancer', [new PilotDefeatRequirement('concho_cancer')]);
    const fight = new ActionFightPilot(PILOTS['concho_cancer'], hidden, completeRequirements, false, activateCityActionReward(decision));
    const intro = new ActionTalkToNPC('concho_cancer', requirements, completeRequirements, activateCityActionReward(fight));
    return [intro, fight, decision];
  })(),
  pillbug_dealer_shop: (() => {
    const requirements = [new MissionCompletedRequirement(S, 'duel_gale_evolved')];
    const hidden = [new ImpossibleRequirement()];
    const depot = new ActionVisitDepot([ITEMS.layered_armor as ConsumableItem], hidden, 'ui:visit_pillbug_shop');
    const intro = new ActionTalkToNPC('pillbug_dealer', requirements, undefined, activateCityActionReward(depot));
    return [intro, depot];
  })(),
  porto_nido_ask_doctor: (() => {
    const completeRequirements = [new PilotDefeatRequirement('arcadia_guard')];
    const hidden = [new ImpossibleRequirement()];
    const fight = new ActionFightPilot(PILOTS['arcadia_guard'], hidden, completeRequirements);
    const ask = new ActionTalkToNPC('arcadia_guard', undefined, completeRequirements, activateCityActionReward(fight), 'ui:ask_around');
    return [ask, fight];
  })(),
};

export const CITIES: City[] = [
  {
    actions: [
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'discuss_in_lab')], [new MissionCompletedRequirement(S, 'meet_unia_corin')], undefined, 'ui:find_contact'),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'meet_unia_corin')], [new MissionCompletedRequirement(S, 'confront_officer')]),
      new ActionTalkToNPC('republican_officer', [new MissionCompletedRequirement(S, 'meet_unia_corin')], [new MissionCompletedRequirement(S, 'check_outside')], undefined, 'ui:check_outside'),
      new ActionTalkToNPC('republican_officer', [new MissionCompletedRequirement(S, 'check_outside')], [new MissionCompletedRequirement(S, 'confront_officer')]),
      new ActionTalkToNPC('dr_t', [new MissionCompletedRequirement(S, 'confront_officer')], [new MissionCompletedRequirement(S, 'challenge_officer')], undefined, 'ui:challenge_officer'),
      new ActionDuelPilot(PILOTS['republican_officer'], [new MissionCompletedRequirement(S, 'challenge_officer')], [new PilotDefeatRequirement('republican_officer')]),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'republican_intervention')], [new MissionCompletedRequirement(S, 'unia_trials')]),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'unia_trials'), new ArmySizeRequirement(ComparisonCondition.AtLeast, 2)], [new MissionCompletedRequirement(S, 'unia_trials_accepted')], compositeReward(removeItemReward('core_saver', 50), removeZiDataReward('barigator', 5), removeZoidReward('sea_panther'))),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'unia_trials_accepted')], [new MissionCompletedRequirement(S, 'sanctuary_secrets')], typedZoidCoreReward(CoreType.MiniCore)),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'sanctuary_secrets')], [new MissionCompletedRequirement(S, 'visit_father')]),
      new ActionTalkToNPC('unia_corin', [new MissionCompletedRequirement(S, 'duel_gale_evolved')], [new MissionCompletedRequirement(S, 'talk_to_unia_aftermath')]),
      new ActionVisitDepot([ITEMS.core_proto_core as ConsumableItem], [new MissionCompletedRequirement(S, 'sanctuary_secrets')], 'ui:visit_sanctuary_vault'),
    ],
    battleBackground: BattleBackground.Water,
    featureFlag: FEATURE_FLAGS.SHELLS_OF_TIME,
    id: 'chimera_island',
    mapPosition: { x: 23, y: 48 },
    name: 'Chimera Island',
    requirements: [new RouteKillRequirement('conservation_archipelago', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionFightPilot(PILOTS['bandit1'], undefined, [new PilotDefeatRequirement('bandit1')]),
      new ActionTalkToNPC('watchman', [new MissionCompletedRequirement(C, 'talk_to_jenkins')]),
      new ActionTalkToNPC('woman', [new PilotDefeatRequirement('bandit1')], [new MissionCompletedRequirement(C, 'report_to_captain')], itemReward('sleeper_module', 1, true)),
      ...AUTOMATIC_ACTIONS.arthur_talk_fight_decide,
    ],
    battleBackground: BattleBackground.Grass,
    id: 'abandoned_camp',
    mapPosition: { x: 35, y: 39},
    name: 'Abandoned Camp',
    requirements: [new RouteKillRequirement('gleam_outskirts', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionPlayCutscene(CUTSCENES.narration_arcobaleno_plan, 'ui:scout_camp', [new MissionCompletedRequirement(C, 'talk_to_van_tied')], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], missionAdvanceReward(C)),
      new ActionFightPilot(PILOTS['bianco'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('bianco')]),
      new ActionFightPilot(PILOTS['bul_arcobaleno'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('bul_arcobaleno')]),
      new ActionFightPilot(PILOTS['nero'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('nero')]),
      new ActionTalkToNPC('rosso', [new MissionCompletedRequirement(C, 'ambush_arcobaleno')], [new MissionCompletedRequirement(C, 'rosso_confrontation')]),
      new ActionFightPilot(PILOTS['rosso'], [new MissionCompletedRequirement(C, 'rosso_confrontation')], [new PilotDefeatRequirement('rosso')], true),
      new ActionFightPilot(PILOTS['rosso'], [new PilotDefeatRequirement('rosso')], [new PilotDefeatRequirement('rosso', 2)]),
      new ActionTalkToNPC('kara', [new MissionCompletedRequirement(C, 'fight_rosso_rematch')], [new MissionCompletedRequirement(C, 'deliver_girl')], undefined, 'ui:talk_to_girl'),
      ...AUTOMATIC_ACTIONS.concho_talk_fight_decide,
      new ActionFightWild(
        'ancient_tortoise_wild',
        [{ attackOverride: 70, id: 'ancient_tortoise', level: 55, maxHealthOverride: 45000, scannable: false }],
        { magnis: 10000, zi_metal: 30 },
        10,
        [new MissionCompletedRequirement(S, 'hunt_cannon_tortoise')],
        [new WildDefeatRequirement('ancient_tortoise_wild', 'ancient_tortoise')]
      ),
    ],
    battleBackground: BattleBackground.Desert,
    id: 'arcobaleno_camp',
    mapPosition: { x: 25, y: 37 },
    name: 'Arcobaleno Camp',
    requirements: [new RouteKillRequirement('bandit_trail', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem], [new ItemRequirement(ITEMS.core_analyzer.id)]),
      new ActionVisitLab('jenkins_lab', [new MissionCompletedRequirement(C, 'jenkins_to_work')]),
      new ActionTalkToNPC('becker', [new MissionCompletedRequirement(C, 'talk_to_jenkins')], [COMPOUND_REQUIREMENTS.becker_probes], itemReward(ITEMS.core_preserver.id, 5, false)),
      new ActionTalkToNPC('becker', [COMPOUND_REQUIREMENTS.becker_probes]),
      new ActionTalkToNPC('boy', undefined, [new MissionCompletedRequirement(C, 'talk_to_hostage')]),
      new ActionTalkToNPC('captain_malinoff', [new ItemRequirement(ITEMS.sleeper_module.id)], [new MissionCompletedRequirement(C, 'talk_to_jenkins')]),
      new ActionTalkToNPC('captain_malinoff', [new MissionCompletedRequirement(C, 'grow_army')]),
      new ActionTalkToNPC('jenkins', [new MissionCompletedRequirement(C, 'report_to_captain')], [new MissionCompletedRequirement(C, 'jenkins_to_work')], itemReward(ITEMS.core_analyzer.id, 1, true)),
      new ActionTalkToNPC('scrap_dealer'),
      new ActionTalkToNPC('woman', [new MissionCompletedRequirement(C, 'fight_van')], [new MissionCompletedRequirement(S, 'head_to_porto_nido')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'gleam_village',
    mapPosition: { x: 38, y: 44 },
    name: 'Gleam Village',
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('opis_kerone', [new MissionCompletedRequirement(S, 'investigate_kidnapping')], [new MissionCompletedRequirement(S, 'pursue_kidnappers')]),
      ...GALE_EW_CHAIN,
      new ActionDuelPilot(PILOTS['opis_kerone'], [new MissionCompletedRequirement(S, 'fight_gale_ew')], [new PilotDefeatRequirement('opis_kerone')], false, cutsceneReward('narration_gorge_ambush'), ANCIENT_TORTOISE_DUEL),
      new ActionFightPilot(PILOTS['opis_kerone'], [new MissionCompletedRequirement(S, 'duel_opis_tortoise')], [new PilotDefeatRequirement('opis_kerone', 2)], false, cutsceneReward('narration_tortoise_reborn')),
      new ActionDuelPilot(PILOTS['gale_task'], [new MissionCompletedRequirement(S, 'fight_opis_army')], [new PilotDefeatRequirement('gale_task', 2)], false, compositeReward(cutsceneReward('narration_gorge_retreat'), zoidReward('barrage_tortoise')), BARRAGE_TORTOISE_DUEL),
    ],
    battleBackground: BattleBackground.Desert,
    featureFlag: FEATURE_FLAGS.SHELLS_OF_TIME,
    id: 'desert_gorge',
    mapPosition: { x: 30, y: 40 },
    name: 'Desert Gorge',
    requirements: [new RouteKillRequirement('gorge_approach', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem, ITEMS.core_saver as ConsumableItem], undefined, 'ui:visit_shop'),
      new ActionVisitLab('porto_nido_lab'),
      ...AUTOMATIC_ACTIONS.porto_nido_ask_doctor,
      new ActionTalkToNPC('dr_t', [new PilotDefeatRequirement('arcadia_guard')], [new MissionCompletedRequirement(S, 'meet_father')]),
      new ActionTalkToNPC('dr_thrun', [new MissionCompletedRequirement(S, 'meet_father')], [new MissionCompletedRequirement(S, 'clear_ruins_demo')]),
      new ActionTalkToNPC('dr_thrun', [new MissionCompletedRequirement(S, 'survive_stray')], [new MissionCompletedRequirement(S, 'meet_unia_corin')], undefined, 'ui:talk_to_doctors'),
      new ActionTalkToNPC('dr_t', [new MissionCompletedRequirement(S, 'statue_wont_emerge')], [new MissionCompletedRequirement(S, 'fight_ancient_tortoise')]),
      new ActionPlayCutscene(CUTSCENES.narration_porto_nido_attack, 'ui:check_city',
        [new MissionCompletedRequirement(S, 'care_for_creature')],
        [new MissionCompletedRequirement(S, 'visit_father')],
        missionAdvanceReward(S)),
      new ActionFightPilot(PILOTS['raven'],
        [new MissionCompletedRequirement(S, 'visit_father')],
        [new PilotDefeatRequirement('raven')],
        true),
      new ActionTalkToNPC('republican_officer',
        [new MissionCompletedRequirement(S, 'fight_raven')],
        [new MissionCompletedRequirement(S, 'pursue_kidnappers')]),
      new ActionTalkToNPC('fisherman', [COMPOUND_REQUIREMENTS.fisherman_tutorial]),
    ],
    battleBackground: BattleBackground.Dirt,
    featureFlag: FEATURE_FLAGS.SHELLS_OF_TIME,
    id: 'porto_nido',
    mapPosition: { x: 29, y: 49 },
    name: 'Porto Nido',
    requirements: [new RouteKillRequirement('south_coast', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('explorer', undefined, [COMPOUND_REQUIREMENTS.fight_wind_colony]),
      new ActionTalkToNPC('maria_flyheight', [new MissionCompletedRequirement(C, 'talk_to_priest_leon')], [new MissionCompletedRequirement(C, 'talk_to_van_and_fiona')]),
      new ActionTalkToNPC('maria_flyheight', [new MissionCompletedRequirement(C, 'talk_to_girl')], [new NpcTalkedInCampaignRequirement(C, 'maria_flyheight')]),
      new ActionPlayCutscene(CUTSCENES.narration_colony_attack, 'ui:check_uproar', [new MissionCompletedRequirement(C, 'talk_to_van_and_fiona')], [new MissionCompletedRequirement(C, 'check_colony_uproar')], missionAdvanceReward(C)),
      new ActionTalkToNPC('priest_leon', undefined, [new MissionCompletedRequirement(C, 'talk_to_maria')]),
      new ActionTalkToNPC('priest_leon', [new MissionCompletedRequirement(C, 'tell_van_kidnapping')], [new MissionCompletedRequirement(C, 'return_to_colony_leon')]),
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'return_to_colony_leon')], [new MissionCompletedRequirement(C, 'ambush_arcobaleno')]),
      new ActionFightPilot(PILOTS['viola_verde_giallo'], [new MissionCompletedRequirement(C, 'check_colony_uproar')], [new PilotDefeatRequirement('viola_verde_giallo')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'wind_colony',
    mapPosition: { x: 30, y: 34 },
    name: 'Wind Colony',
    requirements: [new RouteKillRequirement('wind_road', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'maria_van_status')], [new MissionCompletedRequirement(C, 'tell_van_kidnapping')]),
      new ActionTalkToNPC('fiona', [new MissionCompletedRequirement(C, 'maria_van_status')], [new MissionCompletedRequirement(C, 'tell_van_kidnapping')]),
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'check_van_colony')], [new PilotDefeatRequirement('van_shield_liger')]),
      new ActionDuelPilot(PILOTS['van_shield_liger'], [new MissionCompletedRequirement(C, 'find_van_oasis')], [new MissionCompletedRequirement(C, 'fight_van')]),
      ...AUTOMATIC_ACTIONS.pillbug_dealer_shop,
    ],
    battleBackground: BattleBackground.Desert,
    id: 'wind_oasis',
    mapPosition: { x: 34, y: 31 },
    name: 'Wind Oasis',
    requirements: [new RouteKillRequirement('dustwind_trail', 10)],
    type: LandmarkType.City,
  },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
