import { beforeEach, describe, expect, it } from 'vitest';
import { getActiveZoids, PILOTS } from '../src/models/Pilot';
import { PilotZoidSet } from '../src/models/PilotZoidSet';
import { PilotDefeatRequirement } from '../src/requirement';
import { incrementPilotDefeats, loadStatistics } from '../src/store/statisticsStore';

describe('PilotZoidSet', () => {
  it('should be active when no requirements', () => {
    const set = new PilotZoidSet([{ id: 'molga', level: 5 }]);

    expect(set.isActive()).toBe(true);
  });

  it('should be inactive when requirements are not met', () => {
    const set = new PilotZoidSet(
      [{ id: 'molga', level: 5 }],
      [new PilotDefeatRequirement('rosso')],
    );

    expect(set.isActive()).toBe(false);
  });
});

describe('getActiveZoids', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should return the only set for a single-set pilot', () => {
    const zoids = getActiveZoids(PILOTS['bandit1']);

    expect(zoids).toHaveLength(1);
    expect(zoids[0].id).toBe('molga');
  });

  it('should return default (impossible) set for rosso before any defeats', () => {
    const zoids = getActiveZoids(PILOTS['rosso']);

    expect(zoids[0].maxHealthOverride).toBe(80000);
  });

  it('should return debuffed set for rosso after defeat', () => {
    incrementPilotDefeats('rosso');

    const zoids = getActiveZoids(PILOTS['rosso']);

    expect(zoids[0].maxHealthOverride).toBe(6000);
  });
});
