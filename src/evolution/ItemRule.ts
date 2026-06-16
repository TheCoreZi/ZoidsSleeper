import type { EvolutionHintLine } from './EvolutionHint';
import { ItemHint } from './EvolutionHint';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class ItemRule implements EvolutionRule {
  itemId: string;

  constructor(itemId: string) {
    this.itemId = itemId;
  }

  hint(): EvolutionHintLine[] {
    return [[new ItemHint(this.itemId)]];
  }

  isFulfilled(_stats: OwnedZoidStats): boolean {
    return false;
  }

  isFulfilledWithItem(_stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.itemId === ownedItemId;
  }

  requiresItem(itemId: string): boolean {
    return this.itemId === itemId;
  }
}
