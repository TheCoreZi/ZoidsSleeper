import { describe, expect, it } from 'vitest';
import { AllOfRule } from './AllOfRule';
import { AtLeastOneOfRule } from './AtLeastOneOfRule';
import { AttackRule } from './AttackRule';
import { FactionHint, SeparatorHint, StatHint, StatPrefix } from './EvolutionHint';
import { Evolution } from './EvolutionRule';
import { FactionRule } from './FactionRule';
import { HealthRule } from './HealthRule';
import { LevelRule } from './LevelRule';

describe('LevelRule', () => {
  const rule = new LevelRule(50);

  it('stores threshold', () => {
    expect(rule.threshold).toBe(50);
  });

  it('is fulfilled when level meets threshold', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 0, level: 50 })).toBe(true);
  });

  it('is fulfilled when level exceeds threshold', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 0, level: 75 })).toBe(true);
  });

  it('is not fulfilled when level is below threshold', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 0, level: 49 })).toBe(false);
  });

  it('returns structured hint', () => {
    expect(rule.hint()).toEqual([[new StatHint(StatPrefix.Level, 50)]]);
  });
});

describe('HealthRule', () => {
  const rule = new HealthRule(1000);

  it('is fulfilled when health meets threshold', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 1000, level: 0 })).toBe(true);
  });

  it('is not fulfilled when health is below threshold', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 999, level: 0 })).toBe(false);
  });

  it('returns structured hint', () => {
    expect(rule.hint()).toEqual([[new StatHint(StatPrefix.Hp, 1000)]]);
  });
});

describe('AttackRule', () => {
  const rule = new AttackRule(100);

  it('is fulfilled when attack meets threshold', () => {
    expect(rule.isFulfilled({ attack: 100, faction: '', health: 0, level: 0 })).toBe(true);
  });

  it('is not fulfilled when attack is below threshold', () => {
    expect(rule.isFulfilled({ attack: 99, faction: '', health: 0, level: 0 })).toBe(false);
  });

  it('returns structured hint', () => {
    expect(rule.hint()).toEqual([[new StatHint(StatPrefix.Atk, 100)]]);
  });
});

describe('FactionRule', () => {
  const rule = new FactionRule('guylos_empire');

  it('is fulfilled when faction matches', () => {
    expect(rule.isFulfilled({ attack: 0, faction: 'guylos_empire', health: 0, level: 0 })).toBe(true);
  });

  it('is not fulfilled when faction differs', () => {
    expect(rule.isFulfilled({ attack: 0, faction: 'helic_republic', health: 0, level: 0 })).toBe(false);
  });

  it('returns structured hint', () => {
    expect(rule.hint()).toEqual([[new FactionHint('guylos_empire')]]);
  });
});

describe('AllOfRule', () => {
  const rule = new AllOfRule([
    new LevelRule(50),
    new HealthRule(500),
  ]);

  it('is fulfilled when all conditions are met', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 500, level: 50 })).toBe(true);
  });

  it('is not fulfilled when any condition fails', () => {
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 500, level: 49 })).toBe(false);
    expect(rule.isFulfilled({ attack: 0, faction: '', health: 499, level: 50 })).toBe(false);
  });

  it('returns concatenated hint lines', () => {
    expect(rule.hint()).toEqual([
      [new StatHint(StatPrefix.Level, 50)],
      [new StatHint(StatPrefix.Hp, 500)],
    ]);
  });
});

describe('AtLeastOneOfRule', () => {
  const rule = new AtLeastOneOfRule([
    new FactionRule('guylos_empire'),
    new FactionRule('zenebas_empire'),
  ]);

  it('is fulfilled when first condition is met', () => {
    expect(rule.isFulfilled({ attack: 0, faction: 'guylos_empire', health: 0, level: 0 })).toBe(true);
  });

  it('is fulfilled when second condition is met', () => {
    expect(rule.isFulfilled({ attack: 0, faction: 'zenebas_empire', health: 0, level: 0 })).toBe(true);
  });

  it('is not fulfilled when no condition is met', () => {
    expect(rule.isFulfilled({ attack: 0, faction: 'helic_republic', health: 0, level: 0 })).toBe(false);
  });

  it('returns merged single line with separators', () => {
    expect(rule.hint()).toEqual([
      [
        new FactionHint('guylos_empire'),
        new SeparatorHint(' or '),
        new FactionHint('zenebas_empire'),
      ],
    ]);
  });
});

describe('Evolution', () => {
  it('stores targetId and delegates to rule', () => {
    const evo = new Evolution('godos', new LevelRule(50));
    expect(evo.targetId).toBe('godos');
    expect(evo.hint()).toEqual([[new StatHint(StatPrefix.Level, 50)]]);
    expect(evo.isFulfilled({ attack: 0, faction: '', health: 0, level: 50 })).toBe(true);
    expect(evo.isFulfilled({ attack: 0, faction: '', health: 0, level: 49 })).toBe(false);
  });
});
