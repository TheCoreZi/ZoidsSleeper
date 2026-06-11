import { describe, expect, it } from 'vitest';

import { DevFeatureFlag } from './DevFeatureFlag';

describe('DevFeatureFlag', () => {
  it('is enabled in dev mode', () => {
    const flag = new DevFeatureFlag();
    expect(flag.isEnabled()).toBe(true);
  });
});
