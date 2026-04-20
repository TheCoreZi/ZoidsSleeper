import { addItem, getItemCount } from '../store/inventoryStore';
import { Drop, DropType } from './Drop';

export class ItemDrop extends Drop {
  amount: number;
  itemId: string;
  type: typeof DropType.Item = DropType.Item;
  unique: boolean;

  constructor(itemId: string, chance: number, amount = 1, unique = false) {
    super(chance);
    this.amount = amount;
    this.itemId = itemId;
    this.unique = unique;
  }

  canDrop(): boolean {
    return !(this.unique && getItemCount(this.itemId) > 0);
  }

  grant(): void {
    addItem(this.itemId, this.amount, this.unique, true);
  }
}
