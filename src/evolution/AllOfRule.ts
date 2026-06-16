import type { EvolutionHintLine } from './EvolutionHint';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class AllOfRule implements EvolutionRule {
  conditions: EvolutionRule[];

  constructor(conditions: EvolutionRule[]) {
    this.conditions = conditions;
  }

  hint(): EvolutionHintLine[] {
    return this.conditions.flatMap((c) => c.hint());
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return this.conditions.every((c) => c.isFulfilled(stats));
  }

  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.conditions.every((c) => c.isFulfilledWithItem(stats, ownedItemId));
  }

  requiresItem(itemId: string): boolean {
    return this.conditions.some((c) => c.requiresItem(itemId));
  }
}
