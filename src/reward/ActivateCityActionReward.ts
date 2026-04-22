import type { CityAction } from '../landmark/action/CityAction';
import { RewardType } from './Reward';

export interface ActivateCityActionReward {
  action: CityAction;
  type: typeof RewardType.ActivateCityAction;
}

export function activateCityActionReward(action: CityAction): ActivateCityActionReward {
  return { action, type: RewardType.ActivateCityAction };
}
