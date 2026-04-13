import { RewardType } from './Reward';

export interface CutsceneReward {
  cutsceneId: string;
  type: typeof RewardType.Cutscene;
}

export function cutsceneReward(cutsceneId: string): CutsceneReward {
  return { cutsceneId, type: RewardType.Cutscene };
}
