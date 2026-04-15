import { CUTSCENES } from '../cutscene';
import { type ConsumableItem, ITEMS } from '../item';
import { PILOTS } from '../models/Pilot';
import { COMPOUND_REQUIREMENTS, ItemRequirement, MissionCompletedRequirement, NpcTalkedInCampaignRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
import { itemReward, missionAdvanceReward } from '../reward';
import { ActionFightPilot } from './action/ActionFightPilot';
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

export const CITIES: City[] = [
  {
    actions: [
      new ActionFightPilot(PILOTS['bandit1'], undefined, [new PilotDefeatRequirement('bandit1')]),
      new ActionTalkToNPC('watchman', [new MissionCompletedRequirement(C, 'talk_to_jenkins')]),
      new ActionTalkToNPC('woman', [new PilotDefeatRequirement('bandit1')], [new MissionCompletedRequirement(C, 'report_to_captain')], itemReward('sleeper_module', 1, true)),
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
      new ActionPlayCutscene(CUTSCENES.narration_arcobaleno_plan, 'ui:scout_camp', [new MissionCompletedRequirement(C, 'talk_to_van_tied')], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], missionAdvanceReward(C)),
      new ActionFightPilot(PILOTS['bianco'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('bianco')]),
      new ActionFightPilot(PILOTS['bul_arcobaleno'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('bul_arcobaleno')]),
      new ActionFightPilot(PILOTS['nero'], [new MissionCompletedRequirement(C, 'scout_arcobaleno')], [new PilotDefeatRequirement('nero')]),
      new ActionTalkToNPC('rosso', [new MissionCompletedRequirement(C, 'ambush_arcobaleno')], [new NpcTalkedInCampaignRequirement(C, 'rosso')]),
      new ActionFightPilot(PILOTS['rosso'], [new MissionCompletedRequirement(C, 'rosso_confrontation')], [new PilotDefeatRequirement('rosso')], true),
      new ActionFightPilot(PILOTS['rosso'], [new PilotDefeatRequirement('rosso')], [new PilotDefeatRequirement('rosso', 2)]),
      new ActionTalkToNPC('girl', [new MissionCompletedRequirement(C, 'fight_rosso_rematch')], [new NpcTalkedInCampaignRequirement(C, 'girl')]),
    ],
    battleBackground: BattleBackground.Desert,
    id: 'arcobaleno_camp',
    mapPosition: { x: 48, y: 80 },
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
    ],
    battleBackground: BattleBackground.Grass,
    id: 'gleam_village',
    mapPosition: { x: 53, y: 87 },
    name: 'Gleam Village',
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
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'return_to_colony_leon')], [new MissionCompletedRequirement(C, 'fight_bul_arcobaleno')]),
      new ActionFightPilot(PILOTS['viola_verde_giallo'], [new MissionCompletedRequirement(C, 'check_colony_uproar')], [new PilotDefeatRequirement('viola_verde_giallo')]),
    ],
    battleBackground: BattleBackground.Grass,
    id: 'wind_colony',
    mapPosition: { x: 50, y: 83 },
    name: 'Wind Colony',
    requirements: [new RouteKillRequirement('wind_road', 10)],
    type: LandmarkType.City,
  },
  {
    actions: [
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'maria_van_status')], [new MissionCompletedRequirement(C, 'tell_van_kidnapping')]),
      new ActionTalkToNPC('fiona', [new MissionCompletedRequirement(C, 'maria_van_status')], [new MissionCompletedRequirement(C, 'tell_van_kidnapping')]),
      new ActionTalkToNPC('van', [new MissionCompletedRequirement(C, 'check_van_colony')], [new PilotDefeatRequirement('van_shield_liger')]),
      new ActionFightPilot(PILOTS['van_shield_liger'], [new MissionCompletedRequirement(C, 'find_van_oasis')], [new PilotDefeatRequirement('van_shield_liger')]),
    ],
    battleBackground: BattleBackground.Desert,
    id: 'wind_oasis',
    mapPosition: { x: 49, y: 81.5 },
    name: 'Wind Oasis',
    requirements: [new RouteKillRequirement('dustwind_trail', 10)],
    type: LandmarkType.City,
  },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
