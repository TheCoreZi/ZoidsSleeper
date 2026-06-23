import { describe, expect, it } from 'vitest';

import { Rank, getRankIndex, isPromotion } from './Rank';

describe('getRankIndex', () => {
  it('returns 0 for Civilian', () => {
    expect(getRankIndex(Rank.Civilian)).toBe(0);
  });

  it('returns ascending indices for each rank', () => {
    expect(getRankIndex(Rank.Recruit)).toBeLessThan(getRankIndex(Rank.Cadet));
    expect(getRankIndex(Rank.Cadet)).toBeLessThan(getRankIndex(Rank.Corporal));
    expect(getRankIndex(Rank.Colonel)).toBe(8);
  });
});

describe('isPromotion', () => {
  it('returns true when next rank is higher', () => {
    expect(isPromotion(Rank.Civilian, Rank.Recruit)).toBe(true);
    expect(isPromotion(Rank.Recruit, Rank.Cadet)).toBe(true);
  });

  it('returns false for same rank', () => {
    expect(isPromotion(Rank.Recruit, Rank.Recruit)).toBe(false);
  });

  it('returns false when next rank is lower', () => {
    expect(isPromotion(Rank.Cadet, Rank.Recruit)).toBe(false);
  });
});
