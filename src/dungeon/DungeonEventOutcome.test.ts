import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AmbushOutcome,
  DamageOutcome,
  DungeonEventChoice,
  HealOutcome,
  RewardOutcome,
} from './DungeonEventOutcome';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DungeonEventChoice.resolveOutcome', () => {
  it('returns the only outcome when there is one', () => {
    const outcome = new HealOutcome('heal', 10);
    const choice = new DungeonEventChoice('label', [outcome]);
    expect(choice.resolveOutcome()).toBe(outcome);
  });

  it('returns first outcome when roll is low', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const damage = new DamageOutcome('damage', 15, 5);
    const reward = new RewardOutcome('reward', 200, 'magnis', 5);
    const choice = new DungeonEventChoice('label', [damage, reward]);
    expect(choice.resolveOutcome()).toBe(damage);
  });

  it('returns second outcome when roll is high', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const damage = new DamageOutcome('damage', 15, 5);
    const reward = new RewardOutcome('reward', 200, 'magnis', 5);
    const choice = new DungeonEventChoice('label', [damage, reward]);
    expect(choice.resolveOutcome()).toBe(reward);
  });

  it('respects weight distribution', () => {
    const heavy = new HealOutcome('heal', 10, 9);
    const light = new AmbushOutcome('ambush', 1);
    const choice = new DungeonEventChoice('label', [heavy, light]);

    // roll=0.85 → cumulative for heavy is 0.9, so 0.85 < 0.9 → heavy
    vi.spyOn(Math, 'random').mockReturnValue(0.85);
    expect(choice.resolveOutcome()).toBe(heavy);

    // roll=0.95 → 0.95 > 0.9 → light
    vi.mocked(Math.random).mockReturnValue(0.95);
    expect(choice.resolveOutcome()).toBe(light);
  });

  it('stores weight on outcome subclasses', () => {
    expect(new AmbushOutcome('a', 3).weight).toBe(3);
    expect(new DamageOutcome('d', 10, 4).weight).toBe(4);
    expect(new HealOutcome('h', 20, 5).weight).toBe(5);
    expect(new RewardOutcome('r', 100, 'magnis', 6).weight).toBe(6);
  });

  it('defaults weight to 1 when not provided', () => {
    expect(new AmbushOutcome('a').weight).toBe(1);
    expect(new DamageOutcome('d', 10).weight).toBe(1);
    expect(new HealOutcome('h', 20).weight).toBe(1);
    expect(new RewardOutcome('r', 100, 'magnis').weight).toBe(1);
  });
});
