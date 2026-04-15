import { RewardType } from './Reward';

export interface MissionAdvanceReward {
  campaignId: string;
  type: typeof RewardType.MissionAdvance;
}

export function missionAdvanceReward(campaignId: string): MissionAdvanceReward {
  return { campaignId, type: RewardType.MissionAdvance };
}
