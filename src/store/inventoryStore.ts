import { createSignal } from 'solid-js';
import { t } from '../i18n';
import { type ConsumableItem, ItemType } from '../item';
import { ITEMS } from '../item';
import { Currency } from '../models/Currency';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { showPopup } from './gameStore';
import { addCurrency, getCurrency } from './walletStore';

const [inventory, setInventory] = createSignal<Record<string, number>>({});

function buyItem(itemId: string, amount: number): boolean {
  const item = ITEMS[itemId];
  if (!item || item.type !== ItemType.Consumable) {
    return false;
  }
  const total = (item as ConsumableItem).price * amount;
  if (getCurrency(Currency.Magnis) < total) {
    return false;
  }
  addCurrency(Currency.Magnis, -total);
  addItem(itemId, amount);
  return true;
}

function addItem(itemId: string, amount: number, unique = false): void {
  if (unique && getItemCount(itemId) > 0) {
    return;
  }
  if (getItemCount(itemId) === 0) {
    showPopup(new PopupMessage(
      t(`items:${itemId}.name`),
      t('ui:new_item'),
      PopupType.Item,
      `images/items/${itemId}.png`
    ));
  }
  setInventory((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + amount }));
}

function getItemCount(itemId: string): number {
  return inventory()[itemId] ?? 0;
}

function loadInventory(data: Record<string, number>): void {
  setInventory(data);
}

function removeItem(itemId: string, amount: number): void {
  const item = ITEMS[itemId];
  if (!item || item.type !== ItemType.Consumable) {
    return;
  }
  setInventory((prev) => {
    const current = prev[itemId] ?? 0;
    const next = Math.max(0, current - amount);
    return { ...prev, [itemId]: next };
  });
}

export { addItem, buyItem, getItemCount, inventory, loadInventory, removeItem };
