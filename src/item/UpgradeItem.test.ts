import { describe, expect, it } from 'vitest';
import { Currency } from '../models/Currency';
import { ItemType } from './Item';
import { UpgradeItem } from './UpgradeItem';

describe('UpgradeItem', () => {
  const item = new UpgradeItem('layered_armor', 1000000);

  it('has consumable type', () => {
    expect(item.type).toBe(ItemType.Consumable);
  });

  it('stores id and price', () => {
    expect(item.id).toBe('layered_armor');
    expect(item.price).toBe(1000000);
  });

  it('defaults to Magnis currency', () => {
    expect(item.currency).toBe(Currency.Magnis);
  });

  it('returns correct image path', () => {
    expect(item.getImage()).toBe('images/items/layered_armor.png');
  });
});
