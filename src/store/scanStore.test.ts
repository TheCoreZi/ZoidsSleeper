import { describe, expect, it } from 'vitest';

import { scanNewOnly, toggleScanNewOnly } from './scanStore';

describe('scanStore', () => {
  describe('scanNewOnly', () => {
    it('defaults to false', () => {
      expect(scanNewOnly()).toBe(false);
    });

    it('toggles to true and back', () => {
      toggleScanNewOnly();
      expect(scanNewOnly()).toBe(true);
      toggleScanNewOnly();
      expect(scanNewOnly()).toBe(false);
    });
  });
});
