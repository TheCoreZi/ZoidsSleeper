import { describe, expect, it } from 'vitest';

import { FeatureFlagRequirement } from './FeatureFlagRequirement';

describe('FeatureFlagRequirement', () => {
  it('is completed when feature flag is enabled', () => {
    const requirement = new FeatureFlagRequirement({ isEnabled: () => true });
    expect(requirement.isCompleted()).toBe(true);
  });

  it('is not completed when feature flag is disabled', () => {
    const requirement = new FeatureFlagRequirement({ isEnabled: () => false });
    expect(requirement.isCompleted()).toBe(false);
  });

  it('reports progress based on feature flag state', () => {
    const enabled = new FeatureFlagRequirement({ isEnabled: () => true });
    const disabled = new FeatureFlagRequirement({ isEnabled: () => false });
    expect(enabled.progress()).toBe(1);
    expect(disabled.progress()).toBe(0);
  });
});
