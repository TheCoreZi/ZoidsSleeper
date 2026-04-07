import { beforeEach, describe, expect, it } from 'vitest';
import { addItem, getItemCount, loadInventory, removeItem } from '../src/store/inventoryStore';

describe('InventoryStore', () => {
  beforeEach(() => {
    loadInventory({});
  });

  it('should start with 0 items', () => {
    expect(getItemCount('sleeper_module')).toBe(0);
  });

  it('should add item', () => {
    addItem('sleeper_module', 1);

    expect(getItemCount('sleeper_module')).toBe(1);
  });

  it('should accumulate items', () => {
    addItem('sleeper_module', 1);
    addItem('sleeper_module', 2);

    expect(getItemCount('sleeper_module')).toBe(3);
  });

  it('should return 0 for unknown items', () => {
    expect(getItemCount('nonexistent')).toBe(0);
  });

  it('should load inventory from saved data', () => {
    loadInventory({ sleeper_module: 5 });

    expect(getItemCount('sleeper_module')).toBe(5);
  });

  it('should add to loaded values', () => {
    loadInventory({ sleeper_module: 3 });

    addItem('sleeper_module', 2);

    expect(getItemCount('sleeper_module')).toBe(5);
  });

  it('should not add a unique item if already owned', () => {
    addItem('sleeper_module', 1, true);

    addItem('sleeper_module', 1, true);

    expect(getItemCount('sleeper_module')).toBe(1);
  });

  it('should not remove an important item', () => {
    addItem('sleeper_module', 3);

    removeItem('sleeper_module', 1);

    expect(getItemCount('sleeper_module')).toBe(3);
  });

  it('should remove a consumable item', () => {
    addItem('core_probe', 3);

    removeItem('core_probe', 1);

    expect(getItemCount('core_probe')).toBe(2);
  });
});
