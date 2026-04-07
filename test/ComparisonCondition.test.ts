import { describe, expect, it } from 'vitest';
import { ComparisonCondition, evaluateCondition } from '../src/requirement';

describe('evaluateCondition', () => {
  it('AtLeast returns true when actual >= expected', () => {
    expect(evaluateCondition(ComparisonCondition.AtLeast, 5, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.AtLeast, 6, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.AtLeast, 4, 5)).toBe(false);
  });

  it('AtMost returns true when actual <= expected', () => {
    expect(evaluateCondition(ComparisonCondition.AtMost, 5, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.AtMost, 4, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.AtMost, 6, 5)).toBe(false);
  });

  it('Equals returns true when actual === expected', () => {
    expect(evaluateCondition(ComparisonCondition.Equals, 5, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.Equals, 4, 5)).toBe(false);
    expect(evaluateCondition(ComparisonCondition.Equals, 6, 5)).toBe(false);
  });

  it('LessThan returns true when actual < expected', () => {
    expect(evaluateCondition(ComparisonCondition.LessThan, 4, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.LessThan, 5, 5)).toBe(false);
    expect(evaluateCondition(ComparisonCondition.LessThan, 6, 5)).toBe(false);
  });

  it('MoreThan returns true when actual > expected', () => {
    expect(evaluateCondition(ComparisonCondition.MoreThan, 6, 5)).toBe(true);
    expect(evaluateCondition(ComparisonCondition.MoreThan, 5, 5)).toBe(false);
    expect(evaluateCondition(ComparisonCondition.MoreThan, 4, 5)).toBe(false);
  });
});
