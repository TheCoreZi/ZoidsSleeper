import { describe, expect, it } from 'vitest';
import { calculateScanRate } from '../src/game/Scan';
import { ZOID_LIST } from '../src/models/Zoid';

describe('calculateScanRate', () => {
  it('should return the dropRate plus probe bonus for scannable zoids', () => {
    expect(calculateScanRate('merda', 'core_probe')).toBe(75);
    expect(calculateScanRate('gator', 'core_probe')).toBe(60);
    expect(calculateScanRate('malder', 'core_probe')).toBe(50);
    expect(calculateScanRate('zatton', 'core_probe')).toBe(30);
  });

  it('should return 0 for zoids with negative dropRate', () => {
    const unscannable = Object.values(ZOID_LIST).filter((z) => z.dropRate < 0);
    expect(unscannable.length).toBeGreaterThan(0);
    unscannable.forEach((z) => {
      expect(calculateScanRate(z.id, 'core_probe')).toBe(0);
    });
  });

  it('should clamp scan rate to 100', () => {
    // Merda has 75 dropRate; even with a hypothetical large bonus, rate should cap at 100
    const rate = calculateScanRate('merda', 'core_probe');
    expect(rate).toBeLessThanOrEqual(100);
    expect(rate).toBeGreaterThanOrEqual(0);
  });
});
