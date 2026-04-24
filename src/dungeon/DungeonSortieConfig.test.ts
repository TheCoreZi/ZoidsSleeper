import { describe, expect, it } from 'vitest';

import {
  BossTier,
  PilotBossEntry,
  PilotDungeonBoss,
  WildBossEntry,
  WildDungeonBoss,
} from './DungeonSortieConfig';

describe('BossTier with PilotBossEntry', () => {
  it('resolve returns a PilotDungeonBoss', () => {
    const tier = new BossTier([new PilotBossEntry('bandit1')]);
    const boss = tier.resolve();
    expect(boss).toBeInstanceOf(PilotDungeonBoss);
  });

  it('getPreviews returns a preview per pilot', () => {
    const tier = new BossTier([new PilotBossEntry('bandit1'), new PilotBossEntry('bul')]);
    const previews = tier.getPreviews();
    expect(previews).toHaveLength(2);
    expect(previews[0].id).toBe('bandit1');
    expect(previews[1].id).toBe('bul');
  });
});

describe('BossTier with WildBossEntry', () => {
  it('resolve returns a WildDungeonBoss', () => {
    const tier = new BossTier([new WildBossEntry({ id: 'gator', level: 10 })]);
    const boss = tier.resolve();
    expect(boss).toBeInstanceOf(WildDungeonBoss);
    expect((boss as WildDungeonBoss).zoidData.id).toBe('gator');
  });

  it('getPreviews returns a preview per zoid', () => {
    const tier = new BossTier([new WildBossEntry({ id: 'gator', level: 10 })]);
    const previews = tier.getPreviews();
    expect(previews).toHaveLength(1);
    expect(previews[0].id).toBe('gator');
    expect(previews[0].label).toBe('Gator');
  });
});

describe('BossTier with mixed entries', () => {
  it('getPreviews returns previews for both pilots and zoids', () => {
    const tier = new BossTier([
      new PilotBossEntry('bandit1'),
      new WildBossEntry({ id: 'gator', level: 10 }),
    ]);
    const previews = tier.getPreviews();
    expect(previews).toHaveLength(2);
    expect(previews[0].isZoid).toBe(false);
    expect(previews[1].isZoid).toBe(true);
  });

  it('resolve returns either PilotDungeonBoss or WildDungeonBoss', () => {
    const tier = new BossTier([
      new PilotBossEntry('bandit1'),
      new WildBossEntry({ id: 'gator', level: 10 }),
    ]);
    const boss = tier.resolve();
    expect(boss instanceof PilotDungeonBoss || boss instanceof WildDungeonBoss).toBe(true);
  });
});
