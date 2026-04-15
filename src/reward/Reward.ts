import type { CutsceneReward } from './CutsceneReward';
import type { ItemReward } from './ItemReward';
import type { MissionAdvanceReward } from './MissionAdvanceReward';

const RewardType = {
  Cutscene: 'cutscene',
  Item: 'item',
  MissionAdvance: 'mission_advance',
} as const;

type RewardType = typeof RewardType[keyof typeof RewardType];

export type Reward = CutsceneReward | ItemReward | MissionAdvanceReward;

export { RewardType };
