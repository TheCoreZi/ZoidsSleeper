import { describe, expect, it } from 'vitest';
import { loadStatistics } from '../store/statisticsStore';
import { WildDefeatRequirement } from './WildDefeatRequirement';

describe('WildDefeatRequirement', () => {
  it('is not completed when wild has not been defeated', () => {
    loadStatistics({}, {}, {});
    const req = new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray');
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when defeats meet required value', () => {
    loadStatistics({}, { stray_helcat_wild: 2 }, {});
    const req = new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray', 2);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(2);
  });

  it('is not completed when defeats are below required', () => {
    loadStatistics({}, { stray_helcat_wild: 1 }, {});
    const req = new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray', 2);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(1);
  });

  it('defaults to 1 required defeat', () => {
    loadStatistics({}, { stray_helcat_wild: 1 }, {});
    const req = new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray');
    expect(req.isCompleted()).toBe(true);
  });
});
