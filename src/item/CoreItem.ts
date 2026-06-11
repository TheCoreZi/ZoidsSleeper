import type { Currency } from '../models/Currency';
import { ConsumableItem } from './ConsumableItem';
import type { CoreType } from './ZoidCore';

export class CoreItem extends ConsumableItem {
  coreType: CoreType;

  constructor(coreType: CoreType, price: number, currency: Currency) {
    super(`core_${coreType}`, price, currency);
    this.coreType = coreType;
  }

  override getImage(): string {
    return `images/cores/${this.coreType}.png`;
  }
}
