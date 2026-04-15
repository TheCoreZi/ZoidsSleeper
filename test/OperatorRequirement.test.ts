import { describe, expect, it } from 'vitest';
import { AllOfRequirement, AtLeastOneRequirement, NotRequirement, OnlyOneRequirement } from '../src/requirement';
import type { Requirement } from '../src/requirement';

function fakeRequirement(completed: boolean): Requirement {
  return {
    hint: () => (completed ? 'done' : 'pending'),
    isCompleted: () => completed,
    progress: () => (completed ? 1 : 0),
    requiredValue: 1,
  };
}

describe('AllOfRequirement', () => {
  it('should be completed when all sub-requirements are completed', () => {
    const req = new AllOfRequirement([fakeRequirement(true), fakeRequirement(true)]);

    expect(req.isCompleted()).toBe(true);
  });

  it('should not be completed when any sub-requirement is incomplete', () => {
    const req = new AllOfRequirement([fakeRequirement(true), fakeRequirement(false)]);

    expect(req.isCompleted()).toBe(false);
  });

  it('should return count of completed sub-requirements as progress', () => {
    const req = new AllOfRequirement([fakeRequirement(true), fakeRequirement(false), fakeRequirement(true)]);

    expect(req.progress()).toBe(2);
    expect(req.requiredValue).toBe(3);
  });

  it('should join hints with and', () => {
    const req = new AllOfRequirement([fakeRequirement(true), fakeRequirement(false)]);

    expect(req.hint()).toBe('done and pending');
  });
});

describe('AtLeastOneRequirement', () => {
  it('should be completed when at least one sub-requirement is completed', () => {
    const req = new AtLeastOneRequirement([fakeRequirement(false), fakeRequirement(true)]);

    expect(req.isCompleted()).toBe(true);
  });

  it('should not be completed when no sub-requirements are completed', () => {
    const req = new AtLeastOneRequirement([fakeRequirement(false), fakeRequirement(false)]);

    expect(req.isCompleted()).toBe(false);
  });

  it('should return 1 as progress when any sub-requirement is completed', () => {
    const req = new AtLeastOneRequirement([fakeRequirement(false), fakeRequirement(true)]);

    expect(req.progress()).toBe(1);
    expect(req.requiredValue).toBe(1);
  });

  it('should return 0 as progress when none are completed', () => {
    const req = new AtLeastOneRequirement([fakeRequirement(false), fakeRequirement(false)]);

    expect(req.progress()).toBe(0);
  });

  it('should join hints with or', () => {
    const req = new AtLeastOneRequirement([fakeRequirement(true), fakeRequirement(false)]);

    expect(req.hint()).toBe('done or pending');
  });
});

describe('NotRequirement', () => {
  it('should be completed when inner requirement is not completed', () => {
    const req = new NotRequirement(fakeRequirement(false));

    expect(req.isCompleted()).toBe(true);
  });

  it('should not be completed when inner requirement is completed', () => {
    const req = new NotRequirement(fakeRequirement(true));

    expect(req.isCompleted()).toBe(false);
  });

  it('should delegate hint to inner requirement', () => {
    const req = new NotRequirement(fakeRequirement(false));

    expect(req.hint()).toBe('pending');
  });
});

describe('OnlyOneRequirement', () => {
  it('should be completed when exactly one sub-requirement is completed', () => {
    const req = new OnlyOneRequirement([fakeRequirement(false), fakeRequirement(true), fakeRequirement(false)]);

    expect(req.isCompleted()).toBe(true);
  });

  it('should not be completed when no sub-requirements are completed', () => {
    const req = new OnlyOneRequirement([fakeRequirement(false), fakeRequirement(false)]);

    expect(req.isCompleted()).toBe(false);
  });

  it('should not be completed when more than one sub-requirement is completed', () => {
    const req = new OnlyOneRequirement([fakeRequirement(true), fakeRequirement(true)]);

    expect(req.isCompleted()).toBe(false);
  });

  it('should return 1 as progress only when exactly one is completed', () => {
    const one = new OnlyOneRequirement([fakeRequirement(true), fakeRequirement(false)]);
    const two = new OnlyOneRequirement([fakeRequirement(true), fakeRequirement(true)]);

    expect(one.progress()).toBe(1);
    expect(two.progress()).toBe(0);
  });

  it('should show hint with only one prefix', () => {
    const req = new OnlyOneRequirement([fakeRequirement(true), fakeRequirement(false)]);

    expect(req.hint()).toBe('Only one of: done or pending');
  });
});
