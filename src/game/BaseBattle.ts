import { BATTLE_TICK, CLICK_COOLDOWN, TICK_TIME } from '../constants';
import { awardExperience, calculateExperienceGain } from '../models/Experience';
import type { PlayerStats } from '../models/Player';
import { getOwnedZoidLevel, getZoidById, type ZoidInstance } from '../models/Zoid';
import {
  damageEvents,
  type DamageSource,
  incrementClickAttack,
  playerStats,
  setDamageEvents,
} from '../store/gameStore';
import { party, partyAttack, setParty } from '../store/partyStore';

let damageIdCounter = 0;

export abstract class BaseBattle {
  counter = 0;
  enemy!: ZoidInstance;
  lastClickAttack = 0;
  playerStats: PlayerStats;

  constructor(playerStats: PlayerStats) {
    this.playerStats = playerStats;
  }

  clickAttack(): void {
    const now = Date.now();
    if (now - this.lastClickAttack < CLICK_COOLDOWN) {return;}
    if (this.enemy.health <= 0) {return;}
    this.lastClickAttack = now;
    const damage = playerStats()?.clickAttack ?? 1;
    this.dealDamage(damage, 'click');
  }

  gameTick(): void {
    this.counter += TICK_TIME;
    if (this.counter >= BATTLE_TICK) {
      this.counter = 0;
      this.autoAttack();
      this.onBattleTick();
    }
  }

  protected abstract get isPilotBattle(): boolean;

  protected abstract onEnemyDefeated(): void;

  protected abstract syncToStore(): void;

  protected onBattleTick(): void {}

  private autoAttack(): void {
    if (this.enemy.health <= 0) {return;}
    this.dealDamage(partyAttack(), 'auto');
  }

  private awardExperience(): void {
    const enemyData = getZoidById(this.enemy.id);
    const xpGain = calculateExperienceGain(enemyData.baseExp, this.enemy.level, this.isPilotBattle);
    const previousLevels = party().map((z) => getOwnedZoidLevel(z));
    setParty(awardExperience(party(), xpGain));
    const totalGained = party().reduce((sum, z, i) =>
      sum + Math.floor(getOwnedZoidLevel(z) / 10) - Math.floor(previousLevels[i] / 10), 0);
    if (totalGained > 0) {
      incrementClickAttack(totalGained);
    }
  }

  private dealDamage(amount: number, source: DamageSource): void {
    this.enemy.health = Math.max(0, this.enemy.health - amount);
    this.emitDamageNumber(amount, source);
    this.syncToStore();
    if (this.enemy.health <= 0) {
      this.awardExperience();
      this.onEnemyDefeated();
    }
  }

  private emitDamageNumber(amount: number, source: DamageSource): void {
    if (amount <= 0) {return;}
    const event = { amount, id: damageIdCounter++, source, timestamp: Date.now() };
    setDamageEvents([...damageEvents().slice(-9), event]);
  }
}
