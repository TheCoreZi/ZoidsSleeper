import { describe, expect, it } from 'vitest';

import { VersionFeatureFlag } from './VersionFeatureFlag';

describe('VersionFeatureFlag', () => {
  it('is enabled in dev mode', () => {
    const flag = new VersionFeatureFlag('99.0.0');
    expect(flag.isEnabled()).toBe(true);
  });

  it('is enabled when app version equals minVersion', () => {
    const flag = new VersionFeatureFlag(__APP_VERSION__);
    expect(flag.isEnabled()).toBe(true);
  });

  it('is enabled when app version is greater than minVersion', () => {
    const flag = new VersionFeatureFlag('0.1.0');
    expect(flag.isEnabled()).toBe(true);
  });
});
