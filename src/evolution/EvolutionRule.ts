import type { EvolutionHintLine } from './EvolutionHint';

export interface OwnedZoidStats {
  attack: number;
  faction: string;
  health: number;
  level: number;
}

export interface EvolutionRule {
  hint(): EvolutionHintLine[];
  isFulfilled(stats: OwnedZoidStats): boolean;
  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean;
  requiresItem(itemId: string): boolean;
}

export class Evolution {
  rule: EvolutionRule;
  targetId: string;

  constructor(targetId: string, rule: EvolutionRule) {
    this.targetId = targetId;
    this.rule = rule;
  }

  hint(): EvolutionHintLine[] {
    return this.rule.hint();
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return this.rule.isFulfilled(stats);
  }

  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.rule.isFulfilledWithItem(stats, ownedItemId);
  }

  requiresItem(itemId: string): boolean {
    return this.rule.requiresItem(itemId);
  }
}
