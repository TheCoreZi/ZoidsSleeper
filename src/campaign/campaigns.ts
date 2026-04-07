import { ArmySizeRequirement, ComparisonCondition, NpcTalkedInCampaignRequirement, PilotDefeatRequirement, RouteKillRequirement, ZiDataRequirement } from '../requirement';
import type { Campaign } from './Campaign';

export const CAMPAIGNS: Record<string, Campaign> = {
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
    ],
  },
};
