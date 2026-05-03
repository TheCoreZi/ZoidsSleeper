import { type Reward, RewardType } from './Reward';

export interface CompositeReward {
  rewards: Reward[];
  type: typeof RewardType.Composite;
}

export function compositeReward(...rewards: Reward[]): CompositeReward {
  return { rewards, type: RewardType.Composite };
}
