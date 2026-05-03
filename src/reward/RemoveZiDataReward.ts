import { RewardType } from './Reward';

export interface RemoveZiDataReward {
  amount: number;
  type: typeof RewardType.RemoveZiData;
  zoidId: string;
}

export function removeZiDataReward(zoidId: string, amount: number): RemoveZiDataReward {
  return { amount, type: RewardType.RemoveZiData, zoidId };
}
