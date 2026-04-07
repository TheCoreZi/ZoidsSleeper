import { describe, expect, it } from 'vitest';
import { DEFAULT_PLAYER } from '../src/models/Player';

describe('Player', () => {
  it('should have default clickAttack of 1', () => {
    expect(DEFAULT_PLAYER.clickAttack).toBe(1);
  });
});
