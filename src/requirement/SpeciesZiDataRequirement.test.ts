import { describe, expect, it } from 'vitest';
import { loadZoidData } from '../store/zoidDataStore';
import { SpeciesZiDataRequirement } from './SpeciesZiDataRequirement';

describe('SpeciesZiDataRequirement', () => {
  it('is not completed when no zi-data exists', () => {
    loadZoidData({});
    const req = new SpeciesZiDataRequirement('barigator', 10);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is not completed when zi-data count is below required', () => {
    loadZoidData({ barigator: 5 });
    const req = new SpeciesZiDataRequirement('barigator', 10);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(5);
  });

  it('is completed when zi-data count meets required', () => {
    loadZoidData({ barigator: 10 });
    const req = new SpeciesZiDataRequirement('barigator', 10);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(10);
  });

  it('is completed when zi-data count exceeds required', () => {
    loadZoidData({ barigator: 15 });
    const req = new SpeciesZiDataRequirement('barigator', 10);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(15);
  });

  it('does not count zi-data from other species', () => {
    loadZoidData({ sea_panther: 20 });
    const req = new SpeciesZiDataRequirement('barigator', 10);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });
});
