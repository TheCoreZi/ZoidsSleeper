import type { CutsceneReward } from './CutsceneReward';
import type { ItemReward } from './ItemReward';

const RewardType = {
  Cutscene: 'cutscene',
  Item: 'item',
} as const;

type RewardType = typeof RewardType[keyof typeof RewardType];

export type Reward = CutsceneReward | ItemReward;

export { RewardType };
