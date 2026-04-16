import { BATTLE_TICK, CLICK_COOLDOWN, TICK_TIME } from '../constants';
import { awardExperience, calculateExperienceGain } from '../models/Experience';
import type { PlayerStats } from '../models/Player';
import { getOwnedZoidLevel, getZoidById, type SpawnedZoid, ZoidResearchStatus } from '../models/Zoid';
import {
  damageEvents,
  type DamageSource,
  incrementClickAttack,
  playerDamageEvents,
  playerStats,
  setDamageEvents,
  setPlayerDamageEvents,
} from '../store/gameStore';
import { party, partyAttack, setParty } from '../store/partyStore';
import { getActiveDeviceId, getActiveScanMode, scanNewOnly, ScanMode } from '../store/scanStore';
import { getZoidDataCount } from '../store/zoidDataStore';
import { getZoidResearch } from '../store/zoidResearchStore';
import { attemptScan } from './Scan';

export function shouldSkipScan(zoidId: string): boolean {
  return scanNewOnly() && (getZoidDataCount(zoidId) > 0 || getZoidResearch(zoidId) === ZoidResearchStatus.Created);
}

let damageIdCounter = 0;

export abstract class BaseBattle {
  counter = 0;
  enemy!: SpawnedZoid;
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
    const stats = playerStats();
    const damage = Math.max(1, Math.floor((stats?.clickAttack ?? 1) * (stats?.attackMult ?? 1)));
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

  protected tryScan(): boolean {
    const deviceId = getActiveDeviceId();
    if (!deviceId || getActiveScanMode() === ScanMode.Off) {return false;}
    if (shouldSkipScan(this.enemy.id)) {return false;}
    return attemptScan(this.enemy.id, deviceId);
  }

  private autoAttack(): void {
    if (this.enemy.health <= 0) {return;}
    const damage = Math.max(0, Math.floor(partyAttack() * (playerStats()?.attackMult ?? 1)));
    if (damage <= 0) {return;}
    this.dealDamage(damage, 'auto');
  }

  protected awardExperience(): void {
    const enemyData = getZoidById(this.enemy.id);
    const xpGain = calculateExperienceGain(enemyData.baseExp, this.enemy.level, this.isPilotBattle);
    const previousLevels = party().zoids.map((z) => getOwnedZoidLevel(z));
    setParty((prev) => ({ ...prev, zoids: awardExperience(prev.zoids, xpGain) }));
    const totalGained = party().zoids.reduce((sum, z, i) =>
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

  protected emitPlayerDamageNumber(amount: number): void {
    if (amount <= 0) {return;}
    const event = { amount, id: damageIdCounter++, source: 'auto' as DamageSource, timestamp: Date.now() };
    setPlayerDamageEvents([...playerDamageEvents().slice(-9), event]);
  }

  protected emitDamageNumber(amount: number, source: DamageSource): void {
    if (amount <= 0) {return;}
    const event = { amount, id: damageIdCounter++, source, timestamp: Date.now() };
    setDamageEvents([...damageEvents().slice(-9), event]);
  }
}
