export const ComparisonCondition = {
  AtLeast: 'at_least',
  AtMost: 'at_most',
  Equals: 'equals',
  LessThan: 'less_than',
  MoreThan: 'more_than',
} as const;
export type ComparisonCondition = (typeof ComparisonCondition)[keyof typeof ComparisonCondition];

export function evaluateCondition(condition: ComparisonCondition, actual: number, expected: number): boolean {
  switch (condition) {
    case ComparisonCondition.AtLeast: return actual >= expected;
    case ComparisonCondition.AtMost: return actual <= expected;
    case ComparisonCondition.Equals: return actual === expected;
    case ComparisonCondition.LessThan: return actual < expected;
    case ComparisonCondition.MoreThan: return actual > expected;
  }
}
