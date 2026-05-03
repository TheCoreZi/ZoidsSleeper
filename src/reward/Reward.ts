import type { ActivateCityActionReward } from './ActivateCityActionReward';
import type { CompositeReward } from './CompositeReward';
import type { CutsceneReward } from './CutsceneReward';
import type { ItemReward } from './ItemReward';
import type { MissionAdvanceReward } from './MissionAdvanceReward';
import type { RemoveItemReward } from './RemoveItemReward';
import type { RemoveZiDataReward } from './RemoveZiDataReward';
import type { RemoveZoidReward } from './RemoveZoidReward';

const RewardType = {
  ActivateCityAction: 'activate_city_action',
  Composite: 'composite',
  Cutscene: 'cutscene',
  Item: 'item',
  MissionAdvance: 'mission_advance',
  RemoveItem: 'remove_item',
  RemoveZiData: 'remove_zi_data',
  RemoveZoid: 'remove_zoid',
} as const;

type RewardType = typeof RewardType[keyof typeof RewardType];

export type Reward = ActivateCityActionReward | CompositeReward | CutsceneReward | ItemReward | MissionAdvanceReward | RemoveItemReward | RemoveZiDataReward | RemoveZoidReward;

export { RewardType };
