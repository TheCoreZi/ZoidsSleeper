import { describe, expect, it } from 'vitest';
import { ItemType } from '../src/item/Item';
import { ITEMS } from '../src/item/items';
import { SyncDeviceItem } from '../src/item/SyncDeviceItem';

describe('SyncDeviceItem', () => {
  it('should have consumable type', () => {
    const item = new SyncDeviceItem('test', 100, 0.5);

    expect(item.type).toBe(ItemType.Consumable);
  });

  it('should store price and successBonus', () => {
    const item = new SyncDeviceItem('test', 200, 0.3);

    expect(item.price).toBe(200);
    expect(item.successBonus).toBe(0.3);
  });
});

describe('core_probe in ITEMS', () => {
  it('should exist with correct values', () => {
    const probe = ITEMS.core_probe as SyncDeviceItem;

    expect(probe).toBeDefined();
    expect(probe.id).toBe('core_probe');
    expect(probe.type).toBe(ItemType.Consumable);
    expect(probe.price).toBe(500);
    expect(probe.successBonus).toBe(0.1);
  });
});
