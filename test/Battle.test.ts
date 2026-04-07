import { beforeEach, describe, expect, it } from 'vitest';
import { BATTLE_TICK, TICK_TIME } from '../src/constants';
import { Battle } from '../src/game/Battle';
import { BattleBackground, LandmarkType, type Route, ROUTES } from '../src/landmark';
import { DEFAULT_PLAYER } from '../src/models/Player';
import { ZoidResearchStatus } from '../src/models/Zoid';
import { playerStats, setPlayerStats } from '../src/store/gameStore';
import { partyAttack } from '../src/store/partyStore';
import { getRouteKills, loadStatistics } from '../src/store/statisticsStore';
import { getZoidResearch, loadZoidResearch } from '../src/store/zoidResearchStore';

const toughRoute: Route = {
  battleBackground: BattleBackground.Grass,
  connects: ['test-a', 'test-b'],
  enemies: [{ id: 'molga', level: 50 }],
  id: 'test-route',
  name: 'Test',
  type: LandmarkType.Route,
};

describe('Battle', () => {
  beforeEach(() => {
    setPlayerStats(DEFAULT_PLAYER);
    loadStatistics({}, {});
    loadZoidResearch({});
  });

  it('should auto-attack after accumulating BATTLE_TICK', () => {
    const battle = new Battle(DEFAULT_PLAYER, toughRoute);
    const initialHealth = battle.enemy.health;
    const ticksNeeded = BATTLE_TICK / TICK_TIME;

    for (let i = 0; i < ticksNeeded; i++) {
      battle.gameTick();
    }

    expect(battle.enemy.health).toBe(initialHealth - partyAttack());
  });

  it('should not auto-attack before BATTLE_TICK', () => {
    const battle = new Battle(DEFAULT_PLAYER, toughRoute);
    const initialHealth = battle.enemy.health;
    const ticksNeeded = BATTLE_TICK / TICK_TIME;

    for (let i = 0; i < ticksNeeded - 1; i++) {
      battle.gameTick();
    }

    expect(battle.enemy.health).toBe(initialHealth);
  });

  it('should deal click damage using player click attack', () => {
    const battle = new Battle(DEFAULT_PLAYER, toughRoute);
    const initialHealth = battle.enemy.health;

    battle.clickAttack();

    expect(battle.enemy.health).toBe(initialHealth - playerStats()!.clickAttack);
  });

  it('should rate-limit click attacks', () => {
    const battle = new Battle(DEFAULT_PLAYER, toughRoute);
    const initialHealth = battle.enemy.health;

    battle.clickAttack();
    battle.clickAttack(); // should be ignored (within CLICK_COOLDOWN)

    expect(battle.enemy.health).toBe(initialHealth - playerStats()!.clickAttack);
  });

  it('should calculate click and auto damage independently', () => {
    const battle = new Battle(DEFAULT_PLAYER, toughRoute);
    const initialHealth = battle.enemy.health;

    battle.clickAttack();
    expect(battle.enemy.health).toBe(initialHealth - playerStats()!.clickAttack);

    const healthAfterClick = battle.enemy.health;
    const ticksNeeded = BATTLE_TICK / TICK_TIME;
    for (let i = 0; i < ticksNeeded; i++) {
      battle.gameTick();
    }
    expect(battle.enemy.health).toBe(healthAfterClick - partyAttack());
  });

  it('should auto-spawn new enemy when enemy health reaches 0', () => {
    const battle = new Battle(DEFAULT_PLAYER, ROUTES[0]);
    battle.enemy.health = 1;

    battle.clickAttack();

    expect(battle.enemy.health).toBe(battle.enemy.maxHealth);
  });

  it('should spawn enemy with full health', () => {
    const battle = new Battle(DEFAULT_PLAYER, ROUTES[0]);

    battle.spawnEnemy();

    expect(battle.enemy.health).toBe(battle.enemy.maxHealth);
    expect(battle.counter).toBe(0);
  });

  it('should mark enemy zoid as seen on construction', () => {
    const battle = new Battle(DEFAULT_PLAYER, ROUTES[0]);

    expect(getZoidResearch(battle.enemy.id)).toBe(ZoidResearchStatus.Seen);
  });

  it('should mark enemy zoid as seen on spawn', () => {
    const battle = new Battle(DEFAULT_PLAYER, ROUTES[0]);
    loadZoidResearch({});

    battle.spawnEnemy();

    expect(getZoidResearch(battle.enemy.id)).toBe(ZoidResearchStatus.Seen);
  });

  it('should increment route kills when enemy is defeated', () => {
    const battle = new Battle(DEFAULT_PLAYER, ROUTES[0]);
    battle.enemy.health = 1;

    battle.clickAttack();

    expect(getRouteKills(ROUTES[0].id)).toBe(1);
  });
});
