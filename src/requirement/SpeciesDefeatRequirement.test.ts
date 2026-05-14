import { describe, expect, it } from 'vitest';
import { loadStatistics } from '../store/statisticsStore';
import { SpeciesDefeatRequirement } from './SpeciesDefeatRequirement';

describe('SpeciesDefeatRequirement', () => {
  it('is not completed when species has not been defeated', () => {
    loadStatistics({}, {}, {}, {});
    const req = new SpeciesDefeatRequirement('cannon_tortoise', 20);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when defeats meet required value', () => {
    loadStatistics({}, {}, {}, { cannon_tortoise: 20 });
    const req = new SpeciesDefeatRequirement('cannon_tortoise', 20);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(20);
  });

  it('is not completed when defeats are below required', () => {
    loadStatistics({}, {}, {}, { cannon_tortoise: 15 });
    const req = new SpeciesDefeatRequirement('cannon_tortoise', 20);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(15);
  });
});
