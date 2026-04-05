import { beforeEach, describe, expect, it } from 'vitest';
import { Save } from '../src/game/Save';
import { DEFAULT_PARTY } from '../src/models/Zoid';

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

    expect(loaded?.landmarkId).toBe('gleam-outskirts');
    expect(loaded?.party).toEqual(DEFAULT_PARTY);
  });
});
