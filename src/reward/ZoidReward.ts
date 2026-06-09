import { RewardType } from './Reward';

export interface ZoidReward {
  type: typeof RewardType.Zoid;
  zoidId: string;
}

export function zoidReward(zoidId: string): ZoidReward {
  return { type: RewardType.Zoid, zoidId };
}
