import { describe, expect, it } from 'vitest';
import { calculateMagnisReward } from '../src/models/Currency';

describe('calculateMagnisReward', () => {
  it('should return at least 1', () => {
    for (let i = 0; i < 100; i++) {
      expect(calculateMagnisReward(1)).toBeGreaterThanOrEqual(1);
    }
  });

  it('should return values within expected range', () => {
    for (let i = 0; i < 100; i++) {
      const reward = calculateMagnisReward(50);
      expect(reward).toBeGreaterThanOrEqual(25);
      expect(reward).toBeLessThanOrEqual(75);
    }
  });
});
