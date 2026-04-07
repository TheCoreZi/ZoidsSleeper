import type { ItemDefinition } from './Item';
import { ItemType } from './Item';

export class ConsumableItem implements ItemDefinition {
  id: string;
  price: number;
  type: ItemType = ItemType.Consumable;

  constructor(id: string, price = 0) {
    this.id = id;
    this.price = price;
  }
}
