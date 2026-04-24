import { describe, expect, it } from 'vitest';

import { activeScan, loadScanSetup, resetScanAfterBattle, ScanMode, scanNewOnly, toggleScanNewOnly } from './scanStore';

describe('scanStore', () => {
  describe('scanNewOnly', () => {
    it('defaults to false', () => {
      expect(scanNewOnly()).toBe(false);
    });

    it('toggles to true and back', () => {
      loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
      toggleScanNewOnly();
      expect(scanNewOnly()).toBe(true);
      toggleScanNewOnly();
      expect(scanNewOnly()).toBe(false);
    });
  });

  describe('loadScanSetup', () => {
    it('restores active scan from saved data', () => {
      loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });

      expect(activeScan()).toEqual({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
    });
  });

  describe('resetScanAfterBattle', () => {
    it('clears single mode after battle', () => {
      loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Single, newOnly: false });

      resetScanAfterBattle();

      expect(activeScan()).toBeNull();
    });

    it('keeps permanent mode after battle even without stock', () => {
      loadScanSetup({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });

      resetScanAfterBattle();

      expect(activeScan()).toEqual({ deviceId: 'core_preserver', mode: ScanMode.Permanent, newOnly: false });
    });
  });
});
