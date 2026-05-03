import { RewardType } from './Reward';

export interface RemoveItemReward {
  amount: number;
  itemId: string;
  type: typeof RewardType.RemoveItem;
}

export function removeItemReward(itemId: string, amount: number): RemoveItemReward {
  return { amount, itemId, type: RewardType.RemoveItem };
}
