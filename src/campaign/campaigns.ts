import { NpcTalkedInCampaignRequirement, PilotDefeatRequirement, RouteKillRequirement } from '../requirement';
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
    ],
  },
};
