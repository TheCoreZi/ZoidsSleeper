import { afterEach, describe, expect, it } from 'vitest';

import { addItem, removeItem } from '../store/inventoryStore';
import { ScanMode } from '../store/scanStore';
import { getActiveScanRate } from './Scan';

describe('getActiveScanRate', () => {
  afterEach(() => {
    removeItem('core_preserver', 99);
  });

  it('returns 0 when scan mode is off', () => {
    expect(getActiveScanRate(ScanMode.Off, 'core_preserver', 'merda')).toBe(0);
  });

  it('returns 0 when device id is null', () => {
    expect(getActiveScanRate(ScanMode.Permanent, null, 'merda')).toBe(0);
  });

  it('returns 0 when enemy id is null', () => {
    addItem('core_preserver', 1);

    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', null)).toBe(0);
  });

  it('returns 0 when device has no stock', () => {
    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', 'merda')).toBe(0);
  });

  it('returns scan rate when all conditions are met', () => {
    addItem('core_preserver', 1);

    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', 'merda')).toBe(75);
  });

  it('returns 0 for unscannable zoid', () => {
    addItem('core_preserver', 1);

    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', 'gurantula')).toBe(0);
  });

  it('returns 0 when scannable is false', () => {
    addItem('core_preserver', 1);

    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', 'merda', false)).toBe(0);
  });

  it('returns normal rate when scannable is not provided', () => {
    addItem('core_preserver', 1);

    expect(getActiveScanRate(ScanMode.Permanent, 'core_preserver', 'merda')).toBe(75);
  });
});
