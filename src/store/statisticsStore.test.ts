import { describe, expect, it } from 'vitest';

import {
  dungeonCompletions,
  getDungeonCompletions,
  incrementDungeonCompletions,
  loadStatistics,
} from './statisticsStore';

describe('dungeonCompletions', () => {
  it('starts at zero for unknown dungeons', () => {
    loadStatistics({}, {}, {});
    expect(getDungeonCompletions('elmia_ruins_sortie')).toBe(0);
  });

  it('increments completion count', () => {
    loadStatistics({}, {}, {});
    incrementDungeonCompletions('elmia_ruins_sortie');
    incrementDungeonCompletions('elmia_ruins_sortie');
    expect(getDungeonCompletions('elmia_ruins_sortie')).toBe(2);
  });

  it('loads saved completions', () => {
    loadStatistics({ elmia_ruins_sortie: 5 }, {}, {});
    expect(getDungeonCompletions('elmia_ruins_sortie')).toBe(5);
    expect(dungeonCompletions()).toEqual({ elmia_ruins_sortie: 5 });
  });

  it('tracks multiple dungeons independently', () => {
    loadStatistics({}, {}, {});
    incrementDungeonCompletions('elmia_ruins_sortie');
    incrementDungeonCompletions('tauros_grotto_sortie');
    incrementDungeonCompletions('tauros_grotto_sortie');
    expect(getDungeonCompletions('elmia_ruins_sortie')).toBe(1);
    expect(getDungeonCompletions('tauros_grotto_sortie')).toBe(2);
  });
});
