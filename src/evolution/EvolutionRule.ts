import { t } from '../i18n';

export interface OwnedZoidStats {
  attack: number;
  faction: string;
  health: number;
  level: number;
}

export interface EvolutionRule {
  targetId: string;
  hint(): string;
  isFulfilled(stats: OwnedZoidStats): boolean;
  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean;
}

export class AttackEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  hint(): string {
    return t('ui:evo_condition_atk', { atk: this.threshold });
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.attack >= this.threshold;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }
}

export class CompoundEvolution implements EvolutionRule {
  conditions: EvolutionRule[];
  targetId: string;

  constructor(targetId: string, conditions: EvolutionRule[]) {
    this.targetId = targetId;
    this.conditions = conditions;
  }

  hint(): string {
    return this.conditions.map((c) => c.hint()).join('\n');
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return this.conditions.every((c) => c.isFulfilled(stats));
  }

  isFulfilledWithItem(stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.conditions.every((c) => c.isFulfilledWithItem(stats, ownedItemId));
  }
}

export class FactionEvolution implements EvolutionRule {
  requiredFaction: string;
  targetId: string;

  constructor(targetId: string, requiredFaction: string) {
    this.targetId = targetId;
    this.requiredFaction = requiredFaction;
  }

  hint(): string {
    return t('ui:evo_condition_faction', { faction: t(`factions:${this.requiredFaction}`) });
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.faction === this.requiredFaction;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }
}

export class HealthEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  hint(): string {
    return t('ui:evo_condition_hp', { hp: this.threshold });
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.health >= this.threshold;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }
}

export class LevelEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  hint(): string {
    return t('ui:evo_condition_level', { level: this.threshold });
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.level >= this.threshold;
  }

  isFulfilledWithItem(stats: OwnedZoidStats, _ownedItemId: string): boolean {
    return this.isFulfilled(stats);
  }
}
