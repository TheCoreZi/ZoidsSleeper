import {
  CLICK_COOLDOWN,
  DUEL_ATTACK_ANIMATION_DURATION,
  DUEL_AIM_DELAY,
  DUEL_GAUGE_GOOD_ZONE,
  DUEL_GAUGE_OK_ZONE,
  DUEL_GAUGE_PERFECT_ZONE,
  DUEL_GAUGE_PHASE_DURATION,
  DUEL_GAUGE_SPEED,
  DUEL_GAUGE_LOW_HEALTH_SPEED_BOOST,
  DUEL_POWER_MAX_TAPS,
  DUEL_TAPPING_PHASE_DURATION,
  TICK_TIME,
} from '../constants';
import type { Pilot } from '../models/Pilot';

export const GaugeDirection = {
  Left: -1,
  Right: 1,
} as const;
type GaugeDirection = (typeof GaugeDirection)[keyof typeof GaugeDirection];
import { getActiveZoids } from '../models/Pilot';
import type { PlayerStats } from '../models/Player';
import type { CustomizedZoid, ZoidBlueprint } from '../models/Zoid';
import { buildZoid, spawnZoid, ZoidResearchStatus } from '../models/Zoid';
import {
  DuelTurnPhase,
  setDuelState,
  setEnemyZoid,
  setPilotInfo,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
} from '../store/gameStore';
import { findStrongestZoid } from '../store/partyStore';
import { updateZoidResearch } from '../store/zoidResearchStore';
import { BaseBattle } from './BaseBattle';

export function calculateAimMultiplier(aimIndicatorPosition: number): number {
  const distance = Math.abs(aimIndicatorPosition - 0.5);
  if (distance <= DUEL_GAUGE_PERFECT_ZONE / 2) {return 2;}
  if (distance <= DUEL_GAUGE_GOOD_ZONE / 2) {return 1.5;}
  if (distance <= DUEL_GAUGE_OK_ZONE / 2) {return 1;}
  return 0.5;
}

export class DuelBattle extends BaseBattle {
  currentEnemyIndex = 0;
  gaugeDirection: GaugeDirection = GaugeDirection.Right;
  aimIndicatorPosition = 0;
  aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
  isPlayerTurn = true;
  onDefeat: (() => void) | null = null;
  onVictory: (() => void) | null = null;
  nextDamage = 0;
  currentPhaseTimer = DUEL_TAPPING_PHASE_DURATION;
  pilot: Pilot;
  playerHealth: number;
  playerMaxHealth: number;
  playerZoid: CustomizedZoid;
  powerCharged = 0;
  powerMax: number;
  turnPhase: DuelTurnPhase = DuelTurnPhase.PlayerTapping;
  enemyZoids: ZoidBlueprint[];

  constructor(playerStats: PlayerStats, pilot: Pilot) {
    super();
    this.pilot = pilot;
    this.enemyZoids = getActiveZoids(pilot);
    this.playerZoid = findStrongestZoid();
    this.powerMax = this.playerZoid.attack * DUEL_POWER_MAX_TAPS;
    this.playerMaxHealth = playerStats.baseHealth + this.playerZoid.maxHealth;
    this.playerHealth = this.playerMaxHealth;
    this.enemy = spawnZoid(buildZoid(this.enemyZoids[0]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  override clickAttack(): void {
    const now = Date.now();
    if (now - this.lastClickAttack < CLICK_COOLDOWN) {return;}
    this.lastClickAttack = now;

    switch (this.turnPhase) {
      case DuelTurnPhase.PlayerTapping:
        this.powerCharged = Math.min(this.powerMax, this.powerCharged + this.playerZoid.attack);
        this.syncToStore();
        break;
      case DuelTurnPhase.PlayerAiming:
        this.resolvePlayerAttack();
        break;
    }
  }

  override gameTick(): void {
    switch (this.turnPhase) {
      case DuelTurnPhase.EnemyAttack:
        this.tickEnemyAttack();
        break;
      case DuelTurnPhase.AimDelay:
        this.tickAimDelay();
        break;
      case DuelTurnPhase.PlayerAttack:
        this.tickPlayerAttack();
        break;
      case DuelTurnPhase.PlayerAiming:
        this.tickPlayerAiming();
        break;
      case DuelTurnPhase.PlayerTapping:
        this.tickPlayerTapping();
        break;
    }
  }

  protected get isPilotBattle(): boolean {
    return true;
  }

  protected onBattleTick(): void {}

  protected onEnemyDefeated(): void {
    if (this.currentEnemyIndex < this.enemyZoids.length - 1) {
      this.nextEnemy();
    } else {
      this.onVictory?.();
    }
  }

  protected syncToStore(): void {
    setEnemyZoid({ ...this.enemy });
    setPilotInfo({ id: this.pilot.id, name: this.pilot.name });
    setPilotPlayerHealth(this.playerHealth);
    setPilotPlayerMaxHealth(this.playerMaxHealth);
    setDuelState({
      aimIndicatorPosition: this.aimIndicatorPosition,
      aimTimeRemaining: this.aimTimeRemaining,
      isPlayerTurn: this.isPlayerTurn,
      currentPhaseTimer: this.currentPhaseTimer,
      playerZoid: this.playerZoid,
      powerCharged: this.powerCharged,
      powerMax: this.powerMax,
      turnPhase: this.turnPhase,
    });
  }

  private advanceGauge(): void {
    const healthRatio = this.playerMaxHealth > 0 ? this.playerHealth / this.playerMaxHealth : 1;
    const speedBoost = DUEL_GAUGE_LOW_HEALTH_SPEED_BOOST * (1 - healthRatio);
    const speed = DUEL_GAUGE_SPEED + speedBoost;
    this.aimIndicatorPosition += speed * this.gaugeDirection;
    if (this.aimIndicatorPosition >= 1) {
      this.aimIndicatorPosition = 1;
      this.gaugeDirection = GaugeDirection.Left;
    } else if (this.aimIndicatorPosition <= 0) {
      this.aimIndicatorPosition = 0;
      this.gaugeDirection = GaugeDirection.Right;
    }
  }

  private nextEnemy(): void {
    this.currentEnemyIndex++;
    this.enemy = spawnZoid(buildZoid(this.enemyZoids[this.currentEnemyIndex]));
    updateZoidResearch(this.enemy.id, ZoidResearchStatus.Seen);
    this.syncToStore();
  }

  private resetTurn(): void {
    this.gaugeDirection = GaugeDirection.Right;
    this.aimIndicatorPosition = 0;
    this.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
    this.isPlayerTurn = true;
    this.currentPhaseTimer = DUEL_TAPPING_PHASE_DURATION;
    this.powerCharged = 0;
    this.turnPhase = DuelTurnPhase.PlayerTapping;
  }

  private resolvePlayerAttack(): void {
    const accuracy = calculateAimMultiplier(this.aimIndicatorPosition);
    this.nextDamage = Math.max(1, Math.floor(this.powerCharged * accuracy));
    this.currentPhaseTimer = DUEL_ATTACK_ANIMATION_DURATION;
    this.turnPhase = DuelTurnPhase.PlayerAttack;
    this.syncToStore();
  }

  private startEnemyTurn(): void {
    this.isPlayerTurn = false;
    this.powerCharged = 0.4 + Math.random() * 0.6;
    const accuracy = 0.3 + Math.random() * 0.7;
    this.nextDamage = Math.max(1, Math.floor(this.enemy.attack * this.powerCharged * accuracy));
    this.currentPhaseTimer = DUEL_ATTACK_ANIMATION_DURATION;
    this.turnPhase = DuelTurnPhase.EnemyAttack;
    this.syncToStore();
  }

  private startAimDelay(): void {
    this.gaugeDirection = GaugeDirection.Right;
    this.aimIndicatorPosition = 0;
    this.currentPhaseTimer = DUEL_AIM_DELAY;
    this.turnPhase = DuelTurnPhase.AimDelay;
  }

  private tickEnemyAttack(): void {
    this.currentPhaseTimer -= TICK_TIME;
    if (this.currentPhaseTimer <= 0) {
      this.playerHealth = Math.max(0, this.playerHealth - this.nextDamage);
      this.emitPlayerDamageNumber(this.nextDamage);
      if (this.playerHealth <= 0) {
        this.syncToStore();
        this.onDefeat?.();
        return;
      }
      this.resetTurn();
    }
    this.syncToStore();
  }

  private tickAimDelay(): void {
    this.currentPhaseTimer -= TICK_TIME;
    if (this.currentPhaseTimer <= 0) {
      this.aimTimeRemaining = DUEL_GAUGE_PHASE_DURATION;
      this.turnPhase = DuelTurnPhase.PlayerAiming;
    }
    this.syncToStore();
  }

  private tickPlayerAttack(): void {
    this.currentPhaseTimer -= TICK_TIME;
    if (this.currentPhaseTimer <= 0) {
      this.enemy.health = Math.max(0, this.enemy.health - this.nextDamage);
      this.emitDamageNumber(this.nextDamage, 'click');

      if (this.enemy.health <= 0) {
        this.awardExperience();
        this.onEnemyDefeated();
        return;
      }

      this.startEnemyTurn();
    }
    this.syncToStore();
  }

  private tickPlayerAiming(): void {
    this.advanceGauge();
    this.aimTimeRemaining -= TICK_TIME;
    if (this.aimTimeRemaining <= 0) {
      this.resolvePlayerAttack();
      return;
    }
    this.syncToStore();
  }

  private tickPlayerTapping(): void {
    this.currentPhaseTimer -= TICK_TIME;
    if (this.currentPhaseTimer <= 0) {
      this.startAimDelay();
    }
    this.syncToStore();
  }
}
