import { describe, expect, it } from 'vitest';
import { calculateClickAttack, DEFAULT_PLAYER } from '../src/models/Player';

describe('Player', () => {
  it('should have default clickBonus of 1', () => {
    expect(DEFAULT_PLAYER.clickBonus).toBe(1);
  });

  it('should calculate click attack as floor(clickBonus ^ 1.4)', () => {
    expect(calculateClickAttack({ clickBonus: 1 })).toBe(1);
    expect(calculateClickAttack({ clickBonus: 10 })).toBe(25);
    expect(calculateClickAttack({ clickBonus: 50 })).toBe(239);
  });

  it('should return minimum 1 damage', () => {
    expect(calculateClickAttack({ clickBonus: 0 })).toBe(1);
  });
});
