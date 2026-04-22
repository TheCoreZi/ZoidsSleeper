import type { ActivateCityActionReward } from './ActivateCityActionReward';
import type { CutsceneReward } from './CutsceneReward';
import type { ItemReward } from './ItemReward';
import type { MissionAdvanceReward } from './MissionAdvanceReward';

const RewardType = {
  ActivateCityAction: 'activate_city_action',
  Cutscene: 'cutscene',
  Item: 'item',
  MissionAdvance: 'mission_advance',
} as const;

type RewardType = typeof RewardType[keyof typeof RewardType];

export type Reward = ActivateCityActionReward | CutsceneReward | ItemReward | MissionAdvanceReward;

export { RewardType };
