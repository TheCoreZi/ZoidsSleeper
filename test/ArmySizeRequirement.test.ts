import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PARTY } from '../src/models/Zoid';
import { ArmySizeRequirement, ComparisonCondition } from '../src/requirement';
import { setParty } from '../src/store/partyStore';

describe('ArmySizeRequirement', () => {
  beforeEach(() => {
    setParty(DEFAULT_PARTY);
  });

  it('should not be completed when army is too small', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }] });
    const req = new ArmySizeRequirement(ComparisonCondition.AtLeast, 2);

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when army size meets condition', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }, { experience: 0, id: 'gator' }] });
    const req = new ArmySizeRequirement(ComparisonCondition.AtLeast, 2);

    expect(req.isCompleted()).toBe(true);
  });

  it('should return a descriptive hint', () => {
    const req = new ArmySizeRequirement(ComparisonCondition.AtLeast, 3);

    expect(req.hint()).toContain('3');
  });

  it('should return current army size as progress', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }, { experience: 0, id: 'gator' }, { experience: 0, id: 'merda' }] });
    const req = new ArmySizeRequirement(ComparisonCondition.AtLeast, 5);

    expect(req.progress()).toBe(3);
  });
});
