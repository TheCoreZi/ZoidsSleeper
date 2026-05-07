import { describe, expect, it } from 'vitest';
import { calculateScanRate } from '../src/game/Scan';
import { ZOID_LIST } from '../src/models/Zoid';

describe('calculateScanRate', () => {
  it('should return the scanRate plus probe bonus for scannable zoids', () => {
    expect(calculateScanRate('merda', 'core_preserver')).toBe(80);
    expect(calculateScanRate('gator', 'core_preserver')).toBe(60);
    expect(calculateScanRate('malder', 'core_preserver')).toBe(50);
    expect(calculateScanRate('zatton', 'core_preserver')).toBe(40);
  });

  it('should return 0 for zoids with negative scanRate', () => {
    const unscannable = Object.values(ZOID_LIST).filter((z) => z.scanRate < 0);
    expect(unscannable.length).toBeGreaterThan(0);
    unscannable.forEach((z) => {
      expect(calculateScanRate(z.id, 'core_preserver')).toBe(0);
    });
  });

  it('should clamp scan rate to 100', () => {
    const rate = calculateScanRate('merda', 'core_preserver');
    expect(rate).toBeLessThanOrEqual(100);
    expect(rate).toBeGreaterThanOrEqual(0);
  });

  it('should add core_saver bonus to scan rate', () => {
    expect(calculateScanRate('merda', 'core_saver')).toBe(85);
    expect(calculateScanRate('gator', 'core_saver')).toBe(65);
    expect(calculateScanRate('malder', 'core_saver')).toBe(55);
    expect(calculateScanRate('zatton', 'core_saver')).toBe(45);
  });

  it('should clamp core_saver scan rate to 100', () => {
    const rate = calculateScanRate('merda', 'core_saver');
    expect(rate).toBeLessThanOrEqual(100);
    expect(rate).toBeGreaterThanOrEqual(0);
  });
});
