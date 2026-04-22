import { describe, expect, it, vi } from 'vitest';

import type { CityAction } from '../landmark/action/CityAction';
import { activateCityActionReward } from './ActivateCityActionReward';
import { grantReward } from './grantReward';

function mockCityAction(): CityAction {
  return {
    id: 'test-action',
    execute: vi.fn(),
    getLabel: () => 'Test',
    isCompleted: () => false,
    isUnlocked: () => true,
  };
}

describe('grantReward', () => {
  it('executes the CityAction for ActivateCityAction reward', () => {
    const action = mockCityAction();
    const reward = activateCityActionReward(action);

    grantReward(reward);

    expect(action.execute).toHaveBeenCalledOnce();
  });
});
