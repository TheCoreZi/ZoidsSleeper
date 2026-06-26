import { describe, expect, it } from 'vitest';
import { AtLeastNRequirement } from './AtLeastNRequirement';
import type { Requirement } from './Requirement';

function completed(): Requirement {
  return { hint: () => 'done', isCompleted: () => true, progress: () => 1, requiredValue: 1 };
}

function incomplete(): Requirement {
  return { hint: () => 'pending', isCompleted: () => false, progress: () => 0, requiredValue: 1 };
}

describe('AtLeastNRequirement', () => {
  it('is completed when enough requirements are met', () => {
    const req = new AtLeastNRequirement([completed(), completed(), incomplete()], 2);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(2);
  });

  it('is not completed when not enough requirements are met', () => {
    const req = new AtLeastNRequirement([completed(), incomplete(), incomplete()], 2);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(1);
  });

  it('is completed when all requirements are met and required is less', () => {
    const req = new AtLeastNRequirement([completed(), completed(), completed()], 2);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(3);
  });

  it('is not completed when no requirements are met', () => {
    const req = new AtLeastNRequirement([incomplete(), incomplete(), incomplete()], 1);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when exactly the required number is met', () => {
    const req = new AtLeastNRequirement([completed(), incomplete(), incomplete(), incomplete()], 1);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(1);
  });

  it('has correct requiredValue', () => {
    const req = new AtLeastNRequirement([incomplete(), incomplete(), incomplete()], 2);
    expect(req.requiredValue).toBe(2);
  });

  it('generates a hint with all sub-requirement hints', () => {
    const req = new AtLeastNRequirement([completed(), incomplete()], 1);
    expect(req.hint()).toContain('1');
    expect(req.hint()).toContain('done');
    expect(req.hint()).toContain('pending');
  });
});
