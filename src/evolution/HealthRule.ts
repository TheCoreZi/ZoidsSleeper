import type { EvolutionHintLine } from './EvolutionHint';
import { StatHint, StatPrefix } from './EvolutionHint';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class HealthRule implements EvolutionRule {
  threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  hint(): EvolutionHintLine[] {
    return [[new StatHint(StatPrefix.Hp, this.threshold)]];
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.health >= this.threshold;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }

  requiresItem(_itemId: string): boolean {
    return false;
  }
}
