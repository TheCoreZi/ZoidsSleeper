import { describe, expect, it } from 'vitest';
import { DEFAULT_PLAYER } from '../src/models/Player';

describe('Player', () => {
  it('should have default baseHealth of 10', () => {
    expect(DEFAULT_PLAYER.baseHealth).toBe(10);
  });

  it('should have default clickAttack of 1', () => {
    expect(DEFAULT_PLAYER.clickAttack).toBe(1);
  });

  it('should have reinforcementsEnabled disabled by default', () => {
    expect(DEFAULT_PLAYER.reinforcementsEnabled).toBe(false);
  });
});
