import { describe, expect, it } from 'vitest';
import { ItemHint } from './EvolutionHint';
import { ItemRule } from './ItemRule';

describe('ItemRule', () => {
  const rule = new ItemRule('layered_armor');

  it('stores itemId', () => {
    expect(rule.itemId).toBe('layered_armor');
  });

  it('is never fulfilled automatically', () => {
    expect(rule.isFulfilled({ attack: 999, faction: '', health: 999, level: 100 })).toBe(false);
  });

  it('returns structured hint', () => {
    expect(rule.hint()).toEqual([[new ItemHint('layered_armor')]]);
  });

  it('isFulfilledWithItem returns true when item matches', () => {
    expect(rule.isFulfilledWithItem({ attack: 0, faction: '', health: 0, level: 1 }, 'layered_armor')).toBe(true);
  });

  it('isFulfilledWithItem returns false when item does not match', () => {
    expect(rule.isFulfilledWithItem({ attack: 0, faction: '', health: 0, level: 1 }, 'other_item')).toBe(false);
  });
});
