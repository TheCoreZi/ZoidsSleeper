import { ConsumableItem } from './ConsumableItem';

export class SyncDeviceItem extends ConsumableItem {
  successBonus: number;

  constructor(id: string, price: number, successBonus: number) {
    super(id, price);
    this.successBonus = successBonus;
  }
}
