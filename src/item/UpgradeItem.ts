import type { Currency } from '../models/Currency';
import { ConsumableItem } from './ConsumableItem';

export class UpgradeItem extends ConsumableItem {
  constructor(id: string, price: number, currency?: Currency) {
    super(id, price, currency);
  }
}
