import { beforeEach, describe, expect, it } from 'vitest';
import { ComparisonCondition, ZiDataRequirement } from '../src/requirement';
import { incrementZoidData, loadZoidData } from '../src/store/zoidDataStore';

describe('ZiDataRequirement', () => {
  beforeEach(() => {
    loadZoidData({});
  });

  it('should not be completed when no zi-data exists', () => {
    const req = new ZiDataRequirement(ComparisonCondition.AtLeast, 1);

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when total zi-data meets condition', () => {
    incrementZoidData('molga');
    const req = new ZiDataRequirement(ComparisonCondition.AtLeast, 1);

    expect(req.isCompleted()).toBe(true);
  });

  it('should sum zi-data across multiple zoids', () => {
    incrementZoidData('molga');
    incrementZoidData('molga');
    incrementZoidData('gator');
    const req = new ZiDataRequirement(ComparisonCondition.AtLeast, 3);

    expect(req.progress()).toBe(3);
    expect(req.isCompleted()).toBe(true);
  });

  it('should return a descriptive hint', () => {
    const req = new ZiDataRequirement(ComparisonCondition.AtLeast, 2);

    expect(req.hint()).toContain('2');
  });

  it('should return total zi-data count as progress', () => {
    incrementZoidData('molga');
    incrementZoidData('gator');
    const req = new ZiDataRequirement(ComparisonCondition.AtLeast, 5);

    expect(req.progress()).toBe(2);
  });
});
