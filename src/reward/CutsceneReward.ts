import { RewardType } from './Reward';

export interface CutsceneReward {
  dialogKey: string;
  type: typeof RewardType.Cutscene;
}

export function cutsceneReward(dialogKey: string): CutsceneReward {
  return { dialogKey, type: RewardType.Cutscene };
}
