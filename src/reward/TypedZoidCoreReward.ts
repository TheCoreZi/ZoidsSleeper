import type { CoreType } from '../item/ZoidCore';
import { RewardType } from './Reward';

export interface TypedZoidCoreReward {
  coreType: CoreType;
  type: typeof RewardType.TypedZoidCore;
}

export function typedZoidCoreReward(coreType: CoreType): TypedZoidCoreReward {
  return { coreType, type: RewardType.TypedZoidCore };
}
