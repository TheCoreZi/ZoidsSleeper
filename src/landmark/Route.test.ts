import { describe, expect, it } from 'vitest';
import type { Requirement } from '../requirement';
import { BattleBackground, LandmarkType } from './Landmark';
import { getUnlockedEnemies, type Route } from './Route';

const completedRequirement: Requirement = {
  hint: () => '',
  isCompleted: () => true,
  progress: () => 1,
  requiredValue: 1,
};

const incompleteRequirement: Requirement = {
  hint: () => 'Not yet',
  isCompleted: () => false,
  progress: () => 0,
  requiredValue: 1,
};

function makeRoute(enemies: Route['enemies']): Route {
  return {
    baseReward: { magnis: 10, zi_metal: 1 },
    battleBackground: BattleBackground.Grass,
    connects: ['a', 'b'],
    enemies,
    id: 'test_route',
    name: 'Test Route',
    routeHealth: 50,
    type: LandmarkType.Route,
  };
}

describe('getUnlockedEnemies', () => {
  it('returns all enemies when none have unlock requirements', () => {
    const route = makeRoute([
      { blueprint: { id: 'merda', level: 5 } },
      { blueprint: { id: 'gator', level: 5 } },
    ]);
    expect(getUnlockedEnemies(route)).toHaveLength(2);
  });

  it('filters out enemies with incomplete unlock requirements', () => {
    const route = makeRoute([
      { blueprint: { id: 'merda', level: 5 } },
      { blueprint: { id: 'garius', level: 10 }, unlockRequirement: incompleteRequirement },
    ]);
    const unlocked = getUnlockedEnemies(route);
    expect(unlocked).toHaveLength(1);
    expect(unlocked[0].blueprint.id).toBe('merda');
  });

  it('includes enemies with completed unlock requirements', () => {
    const route = makeRoute([
      { blueprint: { id: 'merda', level: 5 } },
      { blueprint: { id: 'garius', level: 10 }, unlockRequirement: completedRequirement },
    ]);
    expect(getUnlockedEnemies(route)).toHaveLength(2);
  });

  it('returns empty when all enemies are locked', () => {
    const route = makeRoute([
      { blueprint: { id: 'garius', level: 10 }, unlockRequirement: incompleteRequirement },
    ]);
    expect(getUnlockedEnemies(route)).toHaveLength(0);
  });
});
