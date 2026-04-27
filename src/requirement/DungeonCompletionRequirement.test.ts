import { describe, expect, it } from 'vitest';
import { loadStatistics } from '../store/statisticsStore';
import { DungeonCompletionRequirement } from './DungeonCompletionRequirement';

describe('DungeonCompletionRequirement', () => {
  it('is not completed when dungeon has not been cleared', () => {
    loadStatistics({}, {}, {});
    const req = new DungeonCompletionRequirement('sommerso_ruins_sortie', 1);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when dungeon has been cleared enough times', () => {
    loadStatistics({ sommerso_ruins_sortie: 3 }, {}, {});
    const req = new DungeonCompletionRequirement('sommerso_ruins_sortie', 1);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(3);
  });

  it('is not completed when clears are below required', () => {
    loadStatistics({ sommerso_ruins_sortie: 2 }, {}, {});
    const req = new DungeonCompletionRequirement('sommerso_ruins_sortie', 5);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(2);
  });
});
