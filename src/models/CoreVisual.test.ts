import { describe, expect, it } from 'vitest';
import { getCoreVisual, hashString } from './CoreVisual';
import { ZOID_LIST } from './Zoid';

describe('hashString', () => {
  it('returns the same value for the same input', () => {
    expect(hashString('aquadon')).toBe(hashString('aquadon'));
  });

  it('returns different values for different inputs', () => {
    expect(hashString('aquadon')).not.toBe(hashString('barigator'));
  });

  it('returns a non-negative number', () => {
    expect(hashString('test')).toBeGreaterThanOrEqual(0);
  });
});

describe('getCoreVisual', () => {
  it('returns deterministic layers for a species', () => {
    const a = getCoreVisual(ZOID_LIST.aquadon);
    const b = getCoreVisual(ZOID_LIST.aquadon);
    expect(a).toEqual(b);
  });

  it('returns correct color for helic faction', () => {
    const layers = getCoreVisual(ZOID_LIST.aquadon);
    expect(layers.color).toBe('images/cores/color_helic.png');
  });

  it('returns correct color for guylos faction', () => {
    const layers = getCoreVisual(ZOID_LIST.red_horn);
    expect(layers.color).toBe('images/cores/color_guylos.png');
  });

  it('returns correct color for zenebas faction', () => {
    const layers = getCoreVisual(ZOID_LIST.crablaster);
    expect(layers.color).toBe('images/cores/color_zenebas.png');
  });

  it('returns correct color for neutral faction', () => {
    const layers = getCoreVisual(ZOID_LIST.dragon_horse);
    expect(layers.color).toBe('images/cores/color_neutral.png');
  });

  it('returns valid shape and pattern paths', () => {
    const layers = getCoreVisual(ZOID_LIST.shield_liger);
    expect(layers.shape).toMatch(/^images\/cores\/shape_\d+\.png$/);
    expect(layers.pattern).toMatch(/^images\/cores\/pattern_\d+\.png$/);
  });
});
