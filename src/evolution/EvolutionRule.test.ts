import { describe, expect, it } from 'vitest';
import { AttackEvolution, CompoundEvolution, HealthEvolution, LevelEvolution } from './EvolutionRule';

describe('LevelEvolution', () => {
  const rule = new LevelEvolution('godos', 50);

  it('stores targetId and threshold', () => {
    expect(rule.targetId).toBe('godos');
    expect(rule.threshold).toBe(50);
  });

  it('is fulfilled when level meets threshold', () => {
    expect(rule.isFulfilled({ attack: 0, health: 0, level: 50 })).toBe(true);
  });

  it('is fulfilled when level exceeds threshold', () => {
    expect(rule.isFulfilled({ attack: 0, health: 0, level: 75 })).toBe(true);
  });

  it('is not fulfilled when level is below threshold', () => {
    expect(rule.isFulfilled({ attack: 0, health: 0, level: 49 })).toBe(false);
  });
});

describe('HealthEvolution', () => {
  const rule = new HealthEvolution('mammoth', 1000);

  it('stores targetId and threshold', () => {
    expect(rule.targetId).toBe('mammoth');
    expect(rule.threshold).toBe(1000);
  });

  it('is fulfilled when health meets threshold', () => {
    expect(rule.isFulfilled({ attack: 0, health: 1000, level: 0 })).toBe(true);
  });

  it('is not fulfilled when health is below threshold', () => {
    expect(rule.isFulfilled({ attack: 0, health: 999, level: 0 })).toBe(false);
  });
});

describe('AttackEvolution', () => {
  const rule = new AttackEvolution('guysack', 100);

  it('stores targetId and threshold', () => {
    expect(rule.targetId).toBe('guysack');
    expect(rule.threshold).toBe(100);
  });

  it('is fulfilled when attack meets threshold', () => {
    expect(rule.isFulfilled({ attack: 100, health: 0, level: 0 })).toBe(true);
  });

  it('is not fulfilled when attack is below threshold', () => {
    expect(rule.isFulfilled({ attack: 99, health: 0, level: 0 })).toBe(false);
  });
});

describe('CompoundEvolution', () => {
  const rule = new CompoundEvolution('mammoth', [
    new LevelEvolution('mammoth', 50),
    new HealthEvolution('mammoth', 500),
  ]);

  it('stores targetId', () => {
    expect(rule.targetId).toBe('mammoth');
  });

  it('is fulfilled when all conditions are met', () => {
    expect(rule.isFulfilled({ attack: 0, health: 500, level: 50 })).toBe(true);
  });

  it('is not fulfilled when level condition fails', () => {
    expect(rule.isFulfilled({ attack: 0, health: 500, level: 49 })).toBe(false);
  });

  it('is not fulfilled when health condition fails', () => {
    expect(rule.isFulfilled({ attack: 0, health: 499, level: 50 })).toBe(false);
  });
});
