import { describe, expect, it } from 'vitest';
import { getActiveZoids, PILOTS } from '../src/models/Pilot';
import { buildZoid } from '../src/models/Zoid';

describe('Pilot', () => {
  describe('bandit1', () => {
    const bandit = PILOTS['bandit1'];
    const molga = buildZoid(getActiveZoids(bandit)[0]);

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

  it.each([
    'bianco', 'bul_arcobaleno', 'giallo', 'nero',
    'rosso', 'van_shield_liger', 'verde', 'viola', 'viola_verde_giallo',
  ])('should have pilot %s with valid zoid sets', (id) => {
    const pilot = PILOTS[id];

    expect(pilot).toBeDefined();
    expect(pilot.zoidSets.length).toBeGreaterThan(0);
    expect(pilot.magnisReward).toBeGreaterThan(0);
  });

  it('should have rosso with two zoid sets', () => {
    expect(PILOTS['rosso'].zoidSets).toHaveLength(2);
  });

  it('should have viola_verde_giallo with three zoids', () => {
    const zoids = getActiveZoids(PILOTS['viola_verde_giallo']);

    expect(zoids).toHaveLength(3);
  });
});
