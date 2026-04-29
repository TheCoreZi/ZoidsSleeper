import { Faction } from '../models/Faction';
import { AllOfRequirement, ArmySizeRequirement, CampaignCompletedRequirement, ComparisonCondition, DungeonCompletionRequirement, FactionRequirement, MissionCompletedRequirement, NpcTalkedInCampaignRequirement, PilotDefeatRequirement, RouteKillRequirement, ZiDataRequirement } from '../requirement';
import { CUTSCENES } from '../cutscene';
import { activateCityActionReward, grantReward } from '../reward';
import { enqueueDialog } from '../store/gameStore';
import { POST_DEMO_TALK, STRAY_CHAIN_TRIGGER } from '../story/eventchains/strayChain';
import type { Campaign } from './Campaign';

export const CAMPAIGNS: Record<string, Campaign> = {
  olympus_guylos: {
    hidden: true,
    id: 'olympus_guylos',
    missions: [
      { id: 'report_to_imperial_hq', goals: [new MissionCompletedRequirement('olympus_guylos', 'report_to_imperial_hq')] },
    ],
    unlockRequirements: [new FactionRequirement(Faction.GuylosEmpire)],
  },
  olympus_threat: {
    hidden: true,
    id: 'olympus_threat',
    missions: [
      { id: 'report_to_republican_camp', goals: [new MissionCompletedRequirement('olympus_threat', 'report_to_republican_camp')] },
    ],
    unlockRequirements: [new FactionRequirement(Faction.HelicRepublic)],
  },
  shells_of_time: {
    autoStart: true,
    devOnly: true,
    id: 'shells_of_time',
    missions: [
      { id: 'head_to_porto_nido', goals: [new NpcTalkedInCampaignRequirement('shells_of_time', 'arcadia_guard')] },
      { id: 'fight_arcadia_guard', goals: [new PilotDefeatRequirement('arcadia_guard')], onComplete: () => enqueueDialog(CUTSCENES.narration_dr_t_appears.toDialogScript()) },
      { id: 'meet_dr_t', goals: [new NpcTalkedInCampaignRequirement('shells_of_time', 'dr_t')] },
      { id: 'clear_ruins', goals: [new DungeonCompletionRequirement('sommerso_ruins_sortie', 1)] },
      { id: 'meet_father', goals: [new NpcTalkedInCampaignRequirement('shells_of_time', 'dr_thrun')] },
      { id: 'father_backstory', goals: [new NpcTalkedInCampaignRequirement('shells_of_time', 'dr_thrun')] },
      { id: 'clear_ruins_demo', goals: [new DungeonCompletionRequirement('sommerso_ruins_sortie', 2)], onComplete: () => grantReward(activateCityActionReward(POST_DEMO_TALK)) },
      { id: 'clear_ruins_stray', goals: [new DungeonCompletionRequirement('sommerso_ruins_sortie', 3)], onComplete: () => grantReward(activateCityActionReward(STRAY_CHAIN_TRIGGER)) },
      { id: 'survive_stray', goals: [new MissionCompletedRequirement('shells_of_time', 'survive_stray')] },
    ],
    unlockRequirements: [new CampaignCompletedRequirement('sleeper_commander')],
  },
  sleeper_commander: {
    autoStart: true,
    id: 'sleeper_commander',
    missions: [
      { id: 'talk_to_boy', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'boy')] },
      { id: 'hone_skills', goals: [new RouteKillRequirement('gleam_outskirts', 10)] },
      { id: 'beat_bandit', goals: [new PilotDefeatRequirement('bandit1')] },
      { id: 'talk_to_hostage', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'woman')] },
      { id: 'report_to_captain', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'captain_malinoff')] },
      { id: 'talk_to_jenkins', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'jenkins')] },
      { id: 'obtain_zi_data', goals: [new ZiDataRequirement(ComparisonCondition.AtLeast, 1)] },
      { id: 'jenkins_to_work', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'jenkins')] },
      { id: 'grow_army', goals: [new ArmySizeRequirement(ComparisonCondition.AtLeast, 2)] },
      { id: 'captain_farewell', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'captain_malinoff')] },
      { id: 'talk_to_priest_leon', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'priest_leon')] },
      { id: 'talk_to_maria', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'maria_flyheight')] },
      { id: 'elmia_desert_patrol', goals: [new RouteKillRequirement('elmia_desert', 10)] },
      { id: 'listen_to_bandits', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'bianco')] },
      { id: 'defeat_bul', goals: [new PilotDefeatRequirement('bul')] },
      { id: 'find_van', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'van')] },
      { id: 'defeat_bianco_nero', goals: [new PilotDefeatRequirement('bianco_nero')], onComplete: () => enqueueDialog(CUTSCENES.narration_shield_liger.toDialogScript()) },
      { id: 'interrogate_bandits', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'bianco')] },
      { id: 'maria_van_status', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'maria_flyheight')] },
      // --- New campaign segment: Wind Oasis & Arcobaleno Camp ---
      { id: 'talk_to_van_and_fiona', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'van'), new NpcTalkedInCampaignRequirement('sleeper_commander', 'fiona')] },
      { id: 'check_colony_uproar', goals: [new MissionCompletedRequirement('sleeper_commander', 'check_colony_uproar')] },
      { id: 'repel_attackers', goals: [new PilotDefeatRequirement('viola_verde_giallo')], onComplete: () => enqueueDialog(CUTSCENES.narration_maria_kidnapped.toDialogScript()) },
      { id: 'tell_van_kidnapping', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'van')] },
      { id: 'return_to_colony_leon', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'priest_leon')] },
      { id: 'talk_to_van_tied', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'van')] },
      { id: 'scout_arcobaleno', goals: [new MissionCompletedRequirement('sleeper_commander', 'scout_arcobaleno')] },
      { id: 'ambush_arcobaleno', goals: [new AllOfRequirement([new PilotDefeatRequirement('bul_arcobaleno'), new PilotDefeatRequirement('nero'), new PilotDefeatRequirement('bianco')])] },
      { id: 'rosso_confrontation', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'rosso')] },
      { id: 'fight_rosso', goals: [new PilotDefeatRequirement('rosso')], onComplete: () => enqueueDialog(CUTSCENES.narration_turtle_savior.toDialogScript()) },
      { id: 'fight_rosso_rematch', goals: [new PilotDefeatRequirement('rosso', 2)], onComplete: () => enqueueDialog(CUTSCENES.narration_bandits_flee.toDialogScript()) },
      { id: 'talk_to_girl', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'kara')] },
      { id: 'check_van_colony', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'maria_flyheight')] },
      { id: 'find_van_oasis', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'van')] },
      { id: 'fight_van', goals: [new PilotDefeatRequirement('van_shield_liger')], onComplete: () => enqueueDialog(CUTSCENES.narration_van_farewell.toDialogScript()) },
      { id: 'deliver_girl', goals: [new NpcTalkedInCampaignRequirement('sleeper_commander', 'woman')] },
    ],
  },
};
