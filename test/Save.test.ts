import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Save } from '../src/game/Save';
import { Currency } from '../src/models/Currency';
import { DEFAULT_PARTY, ZoidResearchStatus } from '../src/models/Zoid';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';
import { addCurrency, loadWallet } from '../src/store/walletStore';
import { loadZoidResearch, updateZoidResearch } from '../src/store/zoidResearchStore';

describe('Save', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return null when no save exists', () => {
    const save = new Save();

    expect(save.load()).toBeNull();
  });

  it('should store and load save data', () => {
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.landmarkId).toBe('gleam_outskirts');
    expect(loaded?.party).toEqual(DEFAULT_PARTY);
  });

  it('should store version in save data', () => {
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.version).toBe(__APP_VERSION__);
  });

  it('should persist zoid research data', () => {
    loadZoidResearch({});
    updateZoidResearch('molga', ZoidResearchStatus.Scanned);
    updateZoidResearch('gator', ZoidResearchStatus.Created);
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.zoidResearch).toEqual({
      gator: ZoidResearchStatus.Created,
      molga: ZoidResearchStatus.Scanned,
    });
  });

  it('should persist zi metal in wallet', () => {
    loadWallet({});
    addCurrency(Currency.ZiMetal, 25);
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.wallet?.zi_metal).toBe(25);
  });

  it('should persist route kills', () => {
    loadStatistics({}, {});
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.routeKills).toEqual({ 'test-route': 2 });
  });

  describe('encode/decode', () => {
    it('should encode and decode a save string', () => {
      const json = '{"landmarkId":"test","party":[]}';

      const encoded = Save.encode(json);
      const decoded = Save.decode(encoded);

      expect(decoded).toBe(json);
    });

    it('should handle unicode characters', () => {
      const input = '{"name":"café ñ 日本語"}';

      const encoded = Save.encode(input);
      const decoded = Save.decode(encoded);

      expect(decoded).toBe(input);
    });

    it('should throw on invalid base64 input', () => {
      expect(() => Save.decode('!!!not-base64!!!')).toThrow();
    });
  });

  describe('importSave', () => {
    beforeEach(() => {
      vi.stubGlobal('location', { reload: vi.fn() });
    });

    it('should import a valid save file', async () => {
      const saveJson = '{"landmarkId":"test_city","party":[],"version":"0.1.0"}';
      const encoded = Save.encode(saveJson);
      const file = new File([encoded], 'save.txt', { type: 'text/plain' });

      const result = await Save.importSave(file);

      expect(result).toBe(true);
      expect(localStorage.getItem('zoids-sleeper-save')).toBe(saveJson);
      expect(location.reload).toHaveBeenCalledOnce();
    });

    it('should reject a file with invalid base64', async () => {
      const file = new File(['!!!invalid!!!'], 'save.txt', { type: 'text/plain' });

      const result = await Save.importSave(file);

      expect(result).toBe(false);
    });

    it('should reject a file with valid base64 but invalid JSON', async () => {
      const encoded = Save.encode('not json at all');
      const file = new File([encoded], 'save.txt', { type: 'text/plain' });

      const result = await Save.importSave(file);

      expect(result).toBe(false);
    });

    it('should reject a file with valid JSON but missing version', async () => {
      const encoded = Save.encode('{"landmarkId":"test","party":[]}');
      const file = new File([encoded], 'save.txt', { type: 'text/plain' });

      const result = await Save.importSave(file);

      expect(result).toBe(false);
    });
  });
});
