import { Currency } from '../models/Currency';
import type { ItemDefinition } from './Item';
import { ItemType } from './Item';

export class ConsumableItem implements ItemDefinition {
  currency: Currency;
  id: string;
  price: number;
  type: ItemType = ItemType.Consumable;

  constructor(id: string, price = 0, currency: Currency = Currency.Magnis) {
    this.currency = currency;
    this.id = id;
    this.price = price;
  }

  getImage(): string {
    return `images/items/${this.id}.png`;
  }
}
