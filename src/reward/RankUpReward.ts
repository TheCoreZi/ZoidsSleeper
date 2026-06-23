import type { Faction } from '../models/Faction';
import type { Rank } from '../models/Rank';
import { RewardType } from './Reward';

export interface RankUpReward {
  faction: Faction;
  rank: Rank;
  type: typeof RewardType.RankUp;
}

export function rankUpReward(rank: Rank, faction: Faction): RankUpReward {
  return { faction, rank, type: RewardType.RankUp };
}
