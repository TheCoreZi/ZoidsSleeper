import { describe, expect, it, vi } from 'vitest';
import { ItemEvolution } from './ItemEvolution';

vi.mock('../i18n', () => ({
  t: (key: string, opts?: Record<string, number | string>) => {
    const params = opts ? Object.entries(opts).map(([k, v]) => `${k}=${v}`).join(',') : '';
    return params ? `${key}(${params})` : key;
  },
}));

describe('ItemEvolution', () => {
  const rule = new ItemEvolution('gustav', 'layered_armor');

  it('stores targetId and itemId', () => {
    expect(rule.targetId).toBe('gustav');
    expect(rule.itemId).toBe('layered_armor');
  });

  it('is never fulfilled automatically', () => {
    expect(rule.isFulfilled({ attack: 999, faction: '', health: 999, level: 100 })).toBe(false);
  });

  it('returns hint with item name', () => {
    expect(rule.hint()).toBe('ui:evo_condition_item(item=items:layered_armor.name)');
  });

  it('isFulfilledWithItem returns true when item matches', () => {
    expect(rule.isFulfilledWithItem({ attack: 0, faction: '', health: 0, level: 1 }, 'layered_armor')).toBe(true);
  });

  it('isFulfilledWithItem returns false when item does not match', () => {
    expect(rule.isFulfilledWithItem({ attack: 0, faction: '', health: 0, level: 1 }, 'other_item')).toBe(false);
  });
});
