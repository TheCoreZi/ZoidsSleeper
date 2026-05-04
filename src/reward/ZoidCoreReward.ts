import { RewardType } from './Reward';

export interface ZoidCoreReward {
  type: typeof RewardType.ZoidCore;
  zoidSpeciesId: string;
}

export function zoidCoreReward(zoidSpeciesId: string): ZoidCoreReward {
  return { type: RewardType.ZoidCore, zoidSpeciesId };
}
