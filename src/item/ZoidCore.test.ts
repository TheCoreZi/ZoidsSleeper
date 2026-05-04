import { afterEach, describe, expect, it } from 'vitest';
import type { Requirement } from '../requirement/Requirement';
import type { CorePoolEntry, ZoidCoreState } from './ZoidCore';
import { CORE_EMERGE_POOLS, CoreProgress, CoreType, getCoreProgress, resolveTypedCore } from './ZoidCore';

describe('getCoreProgress', () => {
  it('returns Dormant when fragments is 0', () => {
    const core: ZoidCoreState = { fragments: 0, fragmentsRequired: 50, id: 'core_1', zoidSpeciesId: 'molga' };
    expect(getCoreProgress(core)).toBe(CoreProgress.Dormant);
  });

  it('returns Growing when fragments is between 0 and required', () => {
    const core: ZoidCoreState = { fragments: 25, fragmentsRequired: 50, id: 'core_1', zoidSpeciesId: 'molga' };
    expect(getCoreProgress(core)).toBe(CoreProgress.Growing);
  });

  it('returns Ready when fragments equals required', () => {
    const core: ZoidCoreState = { fragments: 50, fragmentsRequired: 50, id: 'core_1', zoidSpeciesId: 'molga' };
    expect(getCoreProgress(core)).toBe(CoreProgress.Ready);
  });

  it('returns Ready when fragments exceeds required', () => {
    const core: ZoidCoreState = { fragments: 60, fragmentsRequired: 50, id: 'core_1', zoidSpeciesId: 'molga' };
    expect(getCoreProgress(core)).toBe(CoreProgress.Ready);
  });
});

describe('resolveTypedCore', () => {
  it('returns a species from the pool', () => {
    const result = resolveTypedCore(CoreType.MiniCore, () => 0);
    expect(result).toBe('dragon_horse');
  });

  let originalPool: CorePoolEntry[];

  afterEach(() => {
    if (originalPool) {
      CORE_EMERGE_POOLS[CoreType.MiniCore].pool = originalPool;
    }
  });

  it('filters out entries with unmet requirements', () => {
    const unmetRequirement: Requirement = {
      hint: () => '',
      isCompleted: () => false,
      progress: () => 0,
      requiredValue: 1,
    };
    originalPool = CORE_EMERGE_POOLS[CoreType.MiniCore].pool;
    CORE_EMERGE_POOLS[CoreType.MiniCore].pool = [
      { requirement: unmetRequirement, zoidSpeciesId: 'glidoler' },
      { zoidSpeciesId: 'redler' },
    ];

    const result = resolveTypedCore(CoreType.MiniCore, () => 0);
    expect(result).toBe('redler');
  });

  it('returns null when all requirements are unmet', () => {
    const unmetRequirement: Requirement = {
      hint: () => '',
      isCompleted: () => false,
      progress: () => 0,
      requiredValue: 1,
    };
    originalPool = CORE_EMERGE_POOLS[CoreType.MiniCore].pool;
    CORE_EMERGE_POOLS[CoreType.MiniCore].pool = [
      { requirement: unmetRequirement, zoidSpeciesId: 'glidoler' },
      { requirement: unmetRequirement, zoidSpeciesId: 'redler' },
    ];

    const result = resolveTypedCore(CoreType.MiniCore, () => 0);
    expect(result).toBeNull();
  });
});
