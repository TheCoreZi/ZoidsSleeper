import { beforeEach, describe, expect, it } from 'vitest';
import { Save } from '../src/game/Save';
import { DEFAULT_PARTY, ZoidResearchStatus } from '../src/models/Zoid';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';
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

  it('should persist route kills', () => {
    loadStatistics({}, {});
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');
    const save = new Save();

    save.store();
    const loaded = save.load();

    expect(loaded?.routeKills).toEqual({ 'test-route': 2 });
  });
});
