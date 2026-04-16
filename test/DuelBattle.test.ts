import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DUEL_ATTACK_ANIMATION_DURATION,
  DUEL_AIM_DELAY,
  DUEL_GAUGE_PHASE_DURATION,
  DUEL_POWER_MAX_TAPS,
  DUEL_TAPPING_PHASE_DURATION,
  TICK_TIME,
} from '../src/constants';
import { calculateAimMultiplier, DuelBattle, GaugeDirection } from '../src/game/DuelBattle';
import { PILOTS } from '../src/models/Pilot';
import { DEFAULT_PLAYER } from '../src/models/Player';
import { DuelTurnPhase, setPlayerStats } from '../src/store/gameStore';
import { setParty } from '../src/store/partyStore';
import { loadStatistics } from '../src/store/statisticsStore';
import { loadZoidResearch } from '../src/store/zoidResearchStore';

function ticksFor(ms: number): number {
  return Math.ceil(ms / TICK_TIME);
}

function advanceTicks(battle: DuelBattle, count: number): void {
  for (let i = 0; i < count; i++) {
    battle.gameTick();
  }
}

describe('DuelBattle', () => {
  beforeEach(() => {
    setPlayerStats(DEFAULT_PLAYER);
    setParty([{ experience: 1000, id: 'shield_liger' }, { experience: 500, id: 'molga' }]);
    loadStatistics({}, {});
    loadZoidResearch({});
  });

  it('should select the party zoid with most experience', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);

    expect(battle.playerZoid.id).toBe('shield_liger');
  });

  it('should start in PlayerTapping phase', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);

    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerTapping);
    expect(battle.currentPhaseTimer).toBe(DUEL_TAPPING_PHASE_DURATION);
  });

  it('should increase power fill by zoid attack on clickAttack during PlayerTapping', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.lastClickAttack = 0;

    battle.clickAttack();

    expect(battle.powerCharged).toBe(battle.playerZoid.attack);
  });

  it('should cap power fill at max', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);

    for (let i = 0; i < 50; i++) {
      battle.lastClickAttack = 0;
      battle.clickAttack();
    }

    expect(battle.powerCharged).toBe(battle.playerZoid.attack * DUEL_POWER_MAX_TAPS);
  });

  it('should transition from PlayerTapping to AimDelay when timer expires', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    const ticks = ticksFor(DUEL_TAPPING_PHASE_DURATION);

    advanceTicks(battle, ticks);

    expect(battle.turnPhase).toBe(DuelTurnPhase.AimDelay);
    expect(battle.aimIndicatorPosition).toBe(0);
  });

  it('should transition from AimDelay to PlayerAiming', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    advanceTicks(battle, ticksFor(DUEL_TAPPING_PHASE_DURATION));

    advanceTicks(battle, ticksFor(DUEL_AIM_DELAY));

    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerAiming);
    expect(battle.aimTimeRemaining).toBe(DUEL_GAUGE_PHASE_DURATION);
  });

  it('should move gauge during PlayerAiming phase', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    advanceTicks(battle, ticksFor(DUEL_TAPPING_PHASE_DURATION));
    advanceTicks(battle, ticksFor(DUEL_AIM_DELAY));

    battle.gameTick();

    expect(battle.aimIndicatorPosition).toBeGreaterThan(0);
  });

  it('should bounce gauge at boundaries', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = 99999;
    battle.aimIndicatorPosition = 0;
    battle.gaugeDirection = GaugeDirection.Right;

    advanceTicks(battle, 51);

    expect(battle.gaugeDirection).toBe(GaugeDirection.Left);
    expect(battle.aimIndicatorPosition).toBeLessThan(1);
  });

  it('should auto-resolve player attack when gauge timer expires', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.powerCharged = 0.5;
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    const initialHealth = battle.enemy.health;

    advanceTicks(battle, ticksFor(DUEL_GAUGE_PHASE_DURATION));
    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerAttack);

    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.enemy.health).toBeLessThan(initialHealth);
  });

  it('should transition to PlayerAttack on PlayerAiming click then to EnemyAttack', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.powerCharged = 0.5;
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle.aimIndicatorPosition = 0.5;
    battle.lastClickAttack = 0;

    const initialHealth = battle.enemy.health;
    battle.clickAttack();
    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerAttack);

    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.enemy.health).toBeLessThan(initialHealth);
    expect(battle.turnPhase).toBe(DuelTurnPhase.EnemyAttack);
    expect(battle.isPlayerTurn).toBe(false);
  });

  it('should calculate perfect accuracy at gauge center', () => {
    expect(calculateAimMultiplier(0.5)).toBe(2);
  });

  it('should calculate good accuracy near center', () => {
    expect(calculateAimMultiplier(0.4)).toBe(1.5);
  });

  it('should calculate ok accuracy in outer zone', () => {
    expect(calculateAimMultiplier(0.25)).toBe(1);
  });

  it('should calculate miss accuracy far from center', () => {
    expect(calculateAimMultiplier(0)).toBe(0.5);
    expect(calculateAimMultiplier(1)).toBe(0.5);
  });

  it('should deal damage to player on enemy attack', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle.aimIndicatorPosition = 0.5;
    battle.powerCharged = 0.5;
    battle.lastClickAttack = 0;
    battle.enemy.health = 99999;

    const initialHealth = battle.playerHealth;
    battle.clickAttack();
    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.turnPhase).toBe(DuelTurnPhase.EnemyAttack);

    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.playerHealth).toBeLessThan(initialHealth);
  });

  it('should call onVictory when enemy health reaches 0', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    const onVictory = vi.fn();
    battle.onVictory = onVictory;
    battle.enemy.health = 1;
    battle.powerCharged = 1;
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle.aimIndicatorPosition = 0.5;
    battle.lastClickAttack = 0;

    battle.clickAttack();
    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));

    expect(onVictory).toHaveBeenCalled();
  });

  it('should call onDefeat when player health reaches 0', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    const onDefeat = vi.fn();
    battle.onDefeat = onDefeat;
    battle.enemy.health = 99999;
    battle.playerHealth = 1;
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle.aimIndicatorPosition = 0.5;
    battle.powerCharged = 0.5;
    battle.lastClickAttack = 0;

    battle.clickAttack();
    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));

    expect(onDefeat).toHaveBeenCalled();
  });

  it('should ignore clicks during enemy phases', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.turnPhase = DuelTurnPhase.EnemyAttack;
    battle.lastClickAttack = 0;
    const initialFill = battle.powerCharged;

    battle.clickAttack();

    expect(battle.powerCharged).toBe(initialFill);
  });

  it('should increase gauge speed as player health decreases', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.turnPhase = DuelTurnPhase.PlayerAiming;
    battle.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle.gameTick();
    const normalPosition = battle.aimIndicatorPosition;

    const battle2 = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle2.turnPhase = DuelTurnPhase.PlayerAiming;
    battle2.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    battle2.playerHealth = 1;
    battle2.gameTick();

    expect(battle2.aimIndicatorPosition).toBeGreaterThan(normalPosition);
  });

  it('should transition through full turn cycle', () => {
    const battle = new DuelBattle(DEFAULT_PLAYER, PILOTS['van_shield_liger']);
    battle.enemy.health = 99999;

    expect(battle.isPlayerTurn).toBe(true);

    advanceTicks(battle, ticksFor(DUEL_TAPPING_PHASE_DURATION));
    expect(battle.turnPhase).toBe(DuelTurnPhase.AimDelay);

    advanceTicks(battle, ticksFor(DUEL_AIM_DELAY));
    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerAiming);

    battle.aimIndicatorPosition = 0.5;
    battle.lastClickAttack = 0;
    battle.clickAttack();
    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerAttack);

    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.turnPhase).toBe(DuelTurnPhase.EnemyAttack);
    expect(battle.isPlayerTurn).toBe(false);

    advanceTicks(battle, ticksFor(DUEL_ATTACK_ANIMATION_DURATION));
    expect(battle.turnPhase).toBe(DuelTurnPhase.PlayerTapping);
    expect(battle.isPlayerTurn).toBe(true);
  });
});
