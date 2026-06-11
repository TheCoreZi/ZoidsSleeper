export interface OwnedZoidStats {
  attack: number;
  health: number;
  level: number;
}

export interface EvolutionRule {
  targetId: string;
  isFulfilled(stats: OwnedZoidStats): boolean;
}

export class AttackEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.attack >= this.threshold;
  }
}

export class CompoundEvolution implements EvolutionRule {
  conditions: EvolutionRule[];
  targetId: string;

  constructor(targetId: string, conditions: EvolutionRule[]) {
    this.targetId = targetId;
    this.conditions = conditions;
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return this.conditions.every((c) => c.isFulfilled(stats));
  }
}

export class HealthEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.health >= this.threshold;
  }
}

export class LevelEvolution implements EvolutionRule {
  targetId: string;
  threshold: number;

  constructor(targetId: string, threshold: number) {
    this.targetId = targetId;
    this.threshold = threshold;
  }

  isFulfilled(stats: OwnedZoidStats): boolean {
    return stats.level >= this.threshold;
  }
}
