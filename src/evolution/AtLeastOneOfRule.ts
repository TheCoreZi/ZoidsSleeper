import type { EvolutionHintLine } from './EvolutionHint';
import { SeparatorHint } from './EvolutionHint';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class AtLeastOneOfRule implements EvolutionRule {
  conditions: EvolutionRule[];

  constructor(conditions: EvolutionRule[]) {
    this.conditions = conditions;
  }

  hint(): EvolutionHintLine[] {
    const merged: EvolutionHintLine = [];
    for (let i = 0; i < this.conditions.length; i++) {
      if (i > 0) { merged.push(new SeparatorHint(' or ')); }
      merged.push(...this.conditions[i].hint().flat());
    }
    return [merged];
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return this.conditions.some((c) => c.isFulfilled(stats));
  }

  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.conditions.some((c) => c.isFulfilledWithItem(stats, ownedItemId));
  }

  requiresItem(itemId: string): boolean {
    return this.conditions.some((c) => c.requiresItem(itemId));
  }
}
