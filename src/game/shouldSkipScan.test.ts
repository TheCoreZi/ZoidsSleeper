import { afterEach, describe, expect, it } from 'vitest';

import { ZoidResearchStatus } from '../models/Zoid';
import { loadScanSetup, ScanMode, toggleScanNewOnly, scanNewOnly } from '../store/scanStore';
import { incrementZoidData } from '../store/zoidDataStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import { shouldSkipScan } from './BaseBattle';

describe('shouldSkipScan', () => {
  afterEach(() => {
    if (scanNewOnly()) {toggleScanNewOnly();}
  });

  it('returns false when scanNewOnly is off', () => {
    expect(shouldSkipScan('merda')).toBe(false);
  });

  it('returns false when scanNewOnly is on and zoid is only Sighted with no Zi Data', () => {
    loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
    toggleScanNewOnly();
    updateZoidResearch('merda', ZoidResearchStatus.Seen);
    expect(shouldSkipScan('merda')).toBe(false);
  });

  it('returns true when scanNewOnly is on and zoid has Zi Data', () => {
    loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
    toggleScanNewOnly();
    incrementZoidData('gator');
    expect(shouldSkipScan('gator')).toBe(true);
  });

  it('returns true when scanNewOnly is on and zoid status is Created', () => {
    loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
    toggleScanNewOnly();
    updateZoidResearch('molga', ZoidResearchStatus.Created);
    expect(shouldSkipScan('molga')).toBe(true);
  });
});
