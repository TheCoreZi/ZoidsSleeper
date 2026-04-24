import { afterEach, describe, expect, it } from 'vitest';

import { BossTier, PilotBossEntry } from '../dungeon/DungeonSortieConfig';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import { dungeonRun, endDungeon, startSortie } from '../dungeon/dungeonStore';
import { DungeonEvent, DungeonEventChoice, HealOutcome } from '../dungeon/DungeonEventOutcome';
import { BattleBackground, LandmarkType } from '../landmark/Landmark';
import type { City } from '../landmark/City';

const DUMMY_EVENT = new DungeonEvent('e1', 'test', [new DungeonEventChoice('ok', new HealOutcome('heal', 10))]);

const DUMMY_SORTIE = new DungeonSortieEvent({
  baseReward: { magnis: 100 },
  bossTiers: [new BossTier([new PilotBossEntry('bandit1')])],
  eliteEnemies: [],
  enemies: [{ zoidData: { id: 'gator', level: 1 } }],
  entryCost: 0,
  eventPool: [DUMMY_EVENT],
  id: 'test_sortie',
  layers: 2,
  nodesPerLayer: [2, 3],
  supplyOptions: [],
});

const DUMMY_CITY: City = {
  battleBackground: BattleBackground.Grass,
  id: 'test_city',
  mapPosition: { x: 0, y: 0 },
  name: 'Test City',
  type: LandmarkType.City,
};

describe('Game.changeLocation', () => {
  afterEach(() => {
    if (dungeonRun()) { endDungeon(); }
  });

  it('cancels active sortie when traveling to another landmark', async () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    expect(dungeonRun()).not.toBeNull();

    const { Game } = await import('./Game');
    const game = new Game();
    game.changeLocation(DUMMY_CITY);

    expect(dungeonRun()).toBeNull();
  });
});
