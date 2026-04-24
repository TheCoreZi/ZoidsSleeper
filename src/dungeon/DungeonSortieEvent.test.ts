import { describe, expect, it } from 'vitest';

import {
  BossTier,
  PilotBossEntry,
  PilotDungeonBoss,
  WildBossEntry,
  WildDungeonBoss,
} from './DungeonSortieConfig';
import { DungeonEvent, DungeonEventChoice, HealOutcome } from './DungeonEventOutcome';
import { DungeonSortieEvent } from './DungeonSortieEvent';

const DUMMY_EVENT = new DungeonEvent('e1', 'test', [new DungeonEventChoice('ok', new HealOutcome('heal', 10))]);

function makeSortie(bossTiers: BossTier[]): DungeonSortieEvent {
  return new DungeonSortieEvent({
    baseReward: { magnis: 100 },
    bossTiers,
    eliteEnemies: [],
    enemies: [{ zoidData: { id: 'gator', level: 1 } }],
    entryCost: 0,
    eventPool: [DUMMY_EVENT],
    id: 'test_sortie',
    layers: 2,
    nodesPerLayer: [2, 3],
    supplyOptions: [],
  });
}

describe('DungeonSortieEvent', () => {
  it('resolveBoss returns PilotDungeonBoss for pilot entry', () => {
    const sortie = makeSortie([new BossTier([new PilotBossEntry('bandit1')])]);
    expect(sortie.resolveBoss()).toBeInstanceOf(PilotDungeonBoss);
  });

  it('resolveBoss returns WildDungeonBoss for wild entry', () => {
    const sortie = makeSortie([new BossTier([new WildBossEntry({ id: 'gator', level: 20 })])]);
    expect(sortie.resolveBoss()).toBeInstanceOf(WildDungeonBoss);
  });

  it('getPossibleBosses returns previews from active tier', () => {
    const sortie = makeSortie([new BossTier([new WildBossEntry({ id: 'gator', level: 20 })])]);
    const previews = sortie.getPossibleBosses();
    expect(previews).toHaveLength(1);
    expect(previews[0].id).toBe('gator');
    expect(previews[0].label).toBe('Gator');
  });
});
