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
    const mockGame = {
      battle: {
        enemy: { health: 250 },
        route: { number: 1 },
      },
      hasSeenPilotBattle: false,
    } as any;

    save.store(mockGame);
    const loaded = save.load();

    expect(loaded?.enemyHealth).toBe(250);
    expect(loaded?.routeNumber).toBe(1);
    expect(loaded?.party).toEqual(DEFAULT_PARTY);
  });
});
