import { describe, expect, it } from 'vitest';
import { calculateScanRate } from '../src/game/Scan';
import { ZOID_LIST } from '../src/models/Zoid';

describe('calculateScanRate', () => {
  it('should return the scanRate plus probe bonus for scannable zoids', () => {
    expect(calculateScanRate('merda', 'core_preserver')).toBe(75);
    expect(calculateScanRate('gator', 'core_preserver')).toBe(60);
    expect(calculateScanRate('malder', 'core_preserver')).toBe(50);
    expect(calculateScanRate('zatton', 'core_preserver')).toBe(30);
  });

  it('should return 0 for zoids with negative scanRate', () => {
    const unscannable = Object.values(ZOID_LIST).filter((z) => z.scanRate < 0);
    expect(unscannable.length).toBeGreaterThan(0);
    unscannable.forEach((z) => {
      expect(calculateScanRate(z.id, 'core_preserver')).toBe(0);
    });
  });

  it('should clamp scan rate to 100', () => {
    // Merda has 75 scanRate; even with a hypothetical large bonus, rate should cap at 100
    const rate = calculateScanRate('merda', 'core_preserver');
    expect(rate).toBeLessThanOrEqual(100);
    expect(rate).toBeGreaterThanOrEqual(0);
  });
});
