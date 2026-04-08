import { RewardType } from './Reward';

export interface ItemReward {
  amount: number;
  itemId: string;
  type: typeof RewardType.Item;
  unique: boolean;
}

export function itemReward(itemId: string, amount: number, unique: boolean): ItemReward {
  return { amount, itemId, type: RewardType.Item, unique };
}
