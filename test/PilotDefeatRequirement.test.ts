import { beforeEach, describe, expect, it } from 'vitest';
import { PilotDefeatRequirement } from '../src/requirement';
import { incrementPilotDefeats, loadStatistics } from '../src/store/statisticsStore';

describe('PilotDefeatRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should not be completed when defeats are insufficient', () => {
    const req = new PilotDefeatRequirement('bandit1');

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when defeats reach required value', () => {
    loadStatistics({}, { bandit1: 1 }, {});
    const req = new PilotDefeatRequirement('bandit1');

    expect(req.isCompleted()).toBe(true);
  });

  it('should return a descriptive hint', () => {
    const req = new PilotDefeatRequirement('bandit1');

    expect(req.hint()).toBe('Defeat Bandit');

  });

  it('should return current defeat count as progress', () => {
    incrementPilotDefeats('bandit1');
    incrementPilotDefeats('bandit1');
    const req = new PilotDefeatRequirement('bandit1');

    expect(req.progress()).toBe(2);
  });

  it('should support custom required defeats', () => {
    loadStatistics({}, { bandit1: 2 }, {});
    const req = new PilotDefeatRequirement('bandit1', 3);

    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(2);
  });
});
