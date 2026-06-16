import type { EvolutionHintLine } from './EvolutionHint';
import { FactionHint } from './EvolutionHint';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class FactionRule implements EvolutionRule {
  requiredFaction: string;

  constructor(requiredFaction: string) {
    this.requiredFaction = requiredFaction;
  }

  hint(): EvolutionHintLine[] {
    return [[new FactionHint(this.requiredFaction)]];
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.faction === this.requiredFaction;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }

  requiresItem(_itemId: string): boolean {
    return false;
  }
}
