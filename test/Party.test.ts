import { describe, expect, it } from 'vitest';
import { LevelType, experienceForLevel } from '../src/models/LevelType';
import { calculatePartyAttack, calculatePartyMaxHealth, buildZoid } from '../src/models/Zoid';

describe('Party', () => {
  it('should calculate total party attack', () => {
    const party = [
      { experience: 0, id: 'command_wolf' },
      { experience: 0, id: 'molga' },
    ];

    const expected =
      buildZoid({ id: 'command_wolf', level: 1 }).attack +
      buildZoid({ id: 'molga', level: 1 }).attack;

    expect(calculatePartyAttack(party)).toBe(expected);
  });

  it('should calculate total party max health', () => {
    const party = [
      { experience: 0, id: 'command_wolf' },
      { experience: 0, id: 'molga' },
    ];

    const expected =
      buildZoid({ id: 'command_wolf', level: 1 }).maxHealth +
      buildZoid({ id: 'molga', level: 1 }).maxHealth;

    expect(calculatePartyMaxHealth(party)).toBe(expected);
  });

  it('should return 0 for empty party', () => {
    expect(calculatePartyAttack([])).toBe(0);
    expect(calculatePartyMaxHealth([])).toBe(0);
  });

  it('should scale with level', () => {
    const xpLevel50 = experienceForLevel(50, LevelType.MediumFast);
    const lowLevel = calculatePartyAttack([{ experience: 0, id: 'command_wolf' }]);
    const highLevel = calculatePartyAttack([{ experience: xpLevel50, id: 'command_wolf' }]);

    expect(highLevel).toBeGreaterThan(lowLevel);
  });
});
