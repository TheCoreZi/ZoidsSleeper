import { describe, expect, it } from 'vitest';
import { PILOTS } from '../src/models/Pilot';
import { buildZoid } from '../src/models/Zoid';

describe('Pilot', () => {
  describe('bandit1', () => {
    const bandit = PILOTS['bandit1'];
    const molga = buildZoid(bandit.zoids[0]);

    it('should have Molga with attack of 2', () => {
      expect(molga.attack).toBe(1);
    });

    it('should have Molga with maxHealth of 72', () => {
      expect(molga.maxHealth).toBe(250);
    });

    it('should reward 3000 magnis', () => {
      expect(bandit.magnisReward).toBe(3000);
    });
  });
});
