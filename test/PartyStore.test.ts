import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PLAYER } from '../src/models/Player';
import { ZoidResearchStatus } from '../src/models/Zoid';
import { playerStats, setPlayerStats } from '../src/store/gameStore';
import { addZoidToArmy, party, setParty } from '../src/store/partyStore';
import { getZoidResearch, loadZoidResearch } from '../src/store/zoidResearchStore';

describe('PartyStore - addZoidToArmy', () => {
  beforeEach(() => {
    setParty([]);
    setPlayerStats(DEFAULT_PLAYER);
    loadZoidResearch({});
  });

  it('should add a zoid to the party', () => {
    addZoidToArmy('molga');

    expect(party().some((z) => z.id === 'molga')).toBe(true);
  });

  it('should add a zoid with 0 experience by default', () => {
    addZoidToArmy('molga');

    expect(party().find((z) => z.id === 'molga')?.experience).toBe(0);
  });

  it('should add a zoid with custom experience', () => {
    addZoidToArmy('molga', 500);

    expect(party().find((z) => z.id === 'molga')?.experience).toBe(500);
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

    expect(party().filter((z) => z.id === 'molga')).toHaveLength(1);
  });

  it('should increment copies when adding a duplicate zoid', () => {
    addZoidToArmy('molga');
    addZoidToArmy('molga');

    expect(party().find((z) => z.id === 'molga')?.copies).toBe(2);
  });

  it('should still increment click attack on duplicate purchase', () => {
    addZoidToArmy('molga');
    addZoidToArmy('molga');

    expect(playerStats()!.clickAttack).toBe(3);
  });

  it('should add different zoids as separate entries', () => {
    addZoidToArmy('molga');
    addZoidToArmy('gator');

    expect(party()).toHaveLength(2);
  });
});
