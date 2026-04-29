import { describe, expect, it, vi } from 'vitest';
import type { PlayerStats } from '../models/Player';
import type { ZoidBlueprint } from '../models/Zoid';
import { WildBossBattle } from './WildBossBattle';

const PLAYER_STATS: PlayerStats = { attackMult: 1, baseHealth: 100, clickAttack: 10, faction: 'neutral' };
const ZOIDS: ZoidBlueprint[] = [
  { attackOverride: 5, id: 'gator', level: 10, maxHealthOverride: 50 },
  { attackOverride: 8, id: 'molga', level: 12, maxHealthOverride: 80 },
];

describe('WildBossBattle', () => {
  it('has isPilotBattle false', () => {
    const battle = new WildBossBattle(PLAYER_STATS, ZOIDS);
    expect(battle['isPilotBattle']).toBe(false);
  });

  it('initializes with first zoid and full player health', () => {
    const battle = new WildBossBattle(PLAYER_STATS, ZOIDS);
    expect(battle.enemy.id).toBe('gator');
    expect(battle.playerHealth).toBe(battle.playerMaxHealth);
  });

  it('advances to next zoid on enemy defeat', () => {
    const battle = new WildBossBattle(PLAYER_STATS, ZOIDS);
    battle.enemy.health = 0;
    battle['onEnemyDefeated']();
    expect(battle.currentEnemyIndex).toBe(1);
    expect(battle.enemy.id).toBe('molga');
  });

  it('calls onVictory when all enemies defeated', () => {
    const battle = new WildBossBattle(PLAYER_STATS, ZOIDS);
    const spy = vi.fn();
    battle.onVictory = spy;
    battle.currentEnemyIndex = 1;
    battle['onEnemyDefeated']();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('calls onDefeat when player health reaches zero', () => {
    const battle = new WildBossBattle(PLAYER_STATS, [{ attackOverride: 9999, id: 'gator', level: 99, maxHealthOverride: 50 }]);
    const spy = vi.fn();
    battle.onDefeat = spy;
    battle['onBattleTick']();
    expect(battle.playerHealth).toBe(0);
    expect(spy).toHaveBeenCalledOnce();
  });
});
