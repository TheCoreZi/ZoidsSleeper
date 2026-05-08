import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BATTLE_TICK, TICK_TIME } from '../src/constants';
import { PilotBattle } from '../src/game/PilotBattle';
import { Organoid } from '../src/models/Organoid';
import type { Pilot } from '../src/models/Pilot';
import { DEFAULT_PLAYER } from '../src/models/Player';
import { PilotZoidSet } from '../src/models/PilotZoidSet';
import { setPlayerStats } from '../src/store/gameStore';
import { setParty } from '../src/store/partyStore';
import { loadStatistics } from '../src/store/statisticsStore';
import { loadZoidResearch } from '../src/store/zoidResearchStore';

function createPilot(zoidSets: PilotZoidSet[]): Pilot {
  return { fragmentYield: 1, id: 'test_pilot', magnisReward: 100, name: 'Test', zoidSets };
}

function tickBattle(battle: PilotBattle): void {
  const ticks = BATTLE_TICK / TICK_TIME;
  for (let i = 0; i < ticks; i++) {
    battle.gameTick();
  }
}

describe('PilotBattle organoid', () => {
  beforeEach(() => {
    setPlayerStats(DEFAULT_PLAYER);
    setParty({ commanderZoidId: 'shield_liger', zoids: [{ experience: 1000, id: 'shield_liger' }] });
    loadStatistics({}, {}, {});
    loadZoidResearch({});
  });

  it('should activate organoid when last zoid drops below 25% HP', () => {
    const organoid = new Organoid(2);
    const pilot = createPilot([new PilotZoidSet([{ attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 }], undefined, organoid)]);
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    const initialMaxHealth = battle.enemy.maxHealth;
    const initialAttack = battle.enemy.attack;

    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();

    expect(battle.organoidActivated).toBe(true);
    expect(battle.enemy.maxHealth).toBe(Math.floor(initialMaxHealth * organoid.multiplier));
    expect(battle.enemy.attack).toBe(Math.floor(initialAttack * organoid.multiplier));
    expect(battle.enemy.health).toBe(battle.enemy.maxHealth);
  });

  it('should not activate organoid if not on last zoid', () => {
    const organoid = new Organoid(2);
    const pilot = createPilot([new PilotZoidSet([
      { attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 },
      { attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 },
    ], undefined, organoid)]);
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);

    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();

    expect(battle.organoidActivated).toBe(false);
  });

  it('should only activate organoid once', () => {
    const organoid = new Organoid(2);
    const pilot = createPilot([new PilotZoidSet([{ attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 }], undefined, organoid)]);
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);

    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();

    const healthAfterFirst = battle.enemy.maxHealth;
    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();

    expect(battle.enemy.maxHealth).toBe(healthAfterFirst);
  });

  it('should not activate organoid when pilot has no organoid', () => {
    const pilot = createPilot([new PilotZoidSet([{ attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 }])]);
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);

    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();

    expect(battle.organoidActivated).toBe(false);
  });

  it('should call onVictory after organoid zoid is defeated', () => {
    const organoid = new Organoid(2);
    const pilot = createPilot([new PilotZoidSet([{ attackOverride: 10, id: 'molga', level: 5, maxHealthOverride: 100 }], undefined, organoid)]);
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    const onVictory = vi.fn();
    battle.onVictory = onVictory;

    // First: trigger organoid
    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();
    expect(battle.organoidActivated).toBe(true);

    // Second: defeat the boosted zoid
    battle.enemy.health = 1;
    battle.lastClickAttack = 0;
    battle.clickAttack();
    expect(onVictory).toHaveBeenCalled();
  });
});
