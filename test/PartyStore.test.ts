import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PARTY } from '../src/models/Zoid';
import { DEFAULT_PLAYER } from '../src/models/Player';
import { ZoidResearchStatus } from '../src/models/Zoid';
import { playerStats, setPlayerStats } from '../src/store/gameStore';
import { addZoidToArmy, findStrongestZoid, party, selectCommanderZoid, setParty } from '../src/store/partyStore';
import { getZoidResearch, loadZoidResearch } from '../src/store/zoidResearchStore';

describe('PartyStore - addZoidToArmy', () => {
  beforeEach(() => {
    setParty(DEFAULT_PARTY);
    setPlayerStats(DEFAULT_PLAYER);
    loadZoidResearch({});
  });

  it('should add a zoid to the party', () => {
    addZoidToArmy('molga');

    expect(party().zoids.some((z) => z.id === 'molga')).toBe(true);
  });

  it('should add a zoid with 0 experience by default', () => {
    addZoidToArmy('molga');

    expect(party().zoids.find((z) => z.id === 'molga')?.experience).toBe(0);
  });

  it('should add a zoid with custom experience', () => {
    addZoidToArmy('molga', 500);

    expect(party().zoids.find((z) => z.id === 'molga')?.experience).toBe(500);
  });

  it('should update research to created', () => {
    addZoidToArmy('molga');

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Created);
  });

  it('should increment click attack when adding a zoid', () => {
    addZoidToArmy('molga');

    expect(playerStats()!.clickAttack).toBe(2);
  });

  it('should not add duplicate entry for the same zoid', () => {
    addZoidToArmy('molga');
    addZoidToArmy('molga');

    expect(party().zoids.filter((z) => z.id === 'molga')).toHaveLength(1);
  });

  it('should increment copies when adding a duplicate zoid', () => {
    addZoidToArmy('molga');
    addZoidToArmy('molga');

    expect(party().zoids.find((z) => z.id === 'molga')?.copies).toBe(2);
  });

  it('should still increment click attack on duplicate purchase', () => {
    addZoidToArmy('molga');
    addZoidToArmy('molga');

    expect(playerStats()!.clickAttack).toBe(3);
  });

  it('should add different zoids as separate entries', () => {
    addZoidToArmy('molga');
    addZoidToArmy('gator');

    expect(party().zoids).toHaveLength(2);
  });

  it('should set commanderZoidId when adding first zoid', () => {
    addZoidToArmy('molga');

    expect(party().commanderZoidId).toBe('molga');
  });

  it('should not change commanderZoidId when adding subsequent zoids', () => {
    addZoidToArmy('molga');
    addZoidToArmy('gator');

    expect(party().commanderZoidId).toBe('molga');
  });
});

describe('PartyStore - selectCommanderZoid', () => {
  beforeEach(() => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }, { experience: 0, id: 'gator' }] });
    setPlayerStats(DEFAULT_PLAYER);
    loadZoidResearch({});
  });

  it('should update commanderZoidId', () => {
    selectCommanderZoid('gator');

    expect(party().commanderZoidId).toBe('gator');
  });
});

describe('PartyStore - findStrongestZoid', () => {
  beforeEach(() => {
    setPlayerStats(DEFAULT_PLAYER);
    loadZoidResearch({});
  });

  it('should return commanderZoidId zoid', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 1000, id: 'shield_liger' }, { experience: 500, id: 'molga' }] });

    const result = findStrongestZoid();

    expect(result.id).toBe('molga');
  });

  it('should fall back to highest XP when commanderZoidId not in zoids', () => {
    setParty({ commanderZoidId: 'nonexistent', zoids: [{ experience: 1000, id: 'shield_liger' }, { experience: 500, id: 'molga' }] });

    const result = findStrongestZoid();

    expect(result.id).toBe('shield_liger');
  });

  it('should throw when party is empty', () => {
    setParty(DEFAULT_PARTY);

    expect(() => findStrongestZoid()).toThrow('Party is empty');
  });
});
