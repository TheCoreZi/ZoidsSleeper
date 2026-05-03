import { RewardType } from './Reward';

export interface RemoveZoidReward {
  type: typeof RewardType.RemoveZoid;
  zoidId: string;
}

export function removeZoidReward(zoidId: string): RemoveZoidReward {
  return { type: RewardType.RemoveZoid, zoidId };
}
