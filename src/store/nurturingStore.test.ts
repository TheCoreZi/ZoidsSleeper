import { beforeEach, describe, expect, it } from 'vitest';
import { REBORN_ATTACK_BONUS_PERCENT } from '../constants';
import { LevelType, experienceForLevel } from '../models/LevelType';
import { DEFAULT_PLAYER } from '../models/Player';
import { setPlayerStats } from './gameStore';
import { addFragments, completeSlot, getAvailableSlotCount, isSpeciesInTank, loadTankSlots, placeCore, placeReborn, tankSlots } from './nurturingStore';
import { party, setParty } from './partyStore';
import { addCore, getCoreCount, loadZoidCores } from './zoidCoreStore';

const LEVEL_100_XP = experienceForLevel(100, LevelType.Fast);

beforeEach(() => {
  loadTankSlots([]);
  loadZoidCores({});
  setPlayerStats({ ...DEFAULT_PLAYER, nurturingSlots: 4 });
  setParty({ commanderZoidId: 'merda', zoids: [{ experience: 0, id: 'merda' }, { experience: 0, id: 'gator' }] });
});

describe('placeCore', () => {
  it('adds a nurturing slot and removes the core', () => {
    addCore('merda');
    placeCore('merda', 'merda');
    expect(tankSlots()).toHaveLength(1);
    expect(tankSlots()[0].source).toBe('core');
    expect(tankSlots()[0].zoidSpeciesId).toBe('merda');
    expect(getCoreCount('merda')).toBe(0);
  });

  it('rejects when tank is full', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, nurturingSlots: 1 });
    addCore('merda');
    addCore('gator');
    placeCore('merda', 'merda');
    placeCore('gator', 'gator');
    expect(tankSlots()).toHaveLength(1);
  });
});

describe('placeReborn', () => {
  it('moves a level-100 zoid to the tank', () => {
    setParty({ commanderZoidId: 'merda', zoids: [{ experience: LEVEL_100_XP, id: 'merda' }, { experience: 0, id: 'gator' }] });
    placeReborn('merda');
    expect(tankSlots()).toHaveLength(1);
    expect(tankSlots()[0].source).toBe('reborn');
  });

  it('rejects if zoid is not level 100', () => {
    placeReborn('merda');
    expect(tankSlots()).toHaveLength(0);
  });

  it('rejects if it would leave 0 zoids in party', () => {
    setParty({ commanderZoidId: 'merda', zoids: [{ experience: LEVEL_100_XP, id: 'merda' }] });
    placeReborn('merda');
    expect(tankSlots()).toHaveLength(0);
  });
});

describe('addFragments', () => {
  it('adds fragments to all slots', () => {
    addCore('merda');
    addCore('gator');
    placeCore('merda', 'merda');
    placeCore('gator', 'gator');
    addFragments(5);
    expect(tankSlots()[0].fragments).toBe(5);
    expect(tankSlots()[1].fragments).toBe(5);
  });

  it('caps fragments at fragmentsRequired', () => {
    addCore('merda');
    placeCore('merda', 'merda');
    addFragments(999999);
    expect(tankSlots()[0].fragments).toBe(tankSlots()[0].fragmentsRequired);
  });
});

describe('completeSlot', () => {
  it('removes a completed nurturing slot', () => {
    addCore('merda');
    placeCore('merda', 'merda');
    addFragments(999999);
    completeSlot(0);
    expect(tankSlots()).toHaveLength(0);
  });

  it('does not complete an unfinished slot', () => {
    addCore('merda');
    placeCore('merda', 'merda');
    addFragments(1);
    completeSlot(0);
    expect(tankSlots()).toHaveLength(1);
  });

  it('returns a reborn zoid with bonus and reset xp', () => {
    setParty({ commanderZoidId: 'merda', zoids: [{ experience: LEVEL_100_XP, id: 'merda' }, { experience: 0, id: 'gator' }] });
    placeReborn('merda');
    addFragments(999999);
    completeSlot(0);
    const reborn = party().zoids.find((z) => z.id === 'merda');
    expect(reborn).toBeDefined();
    expect(reborn!.experience).toBe(0);
    expect(reborn!.rebornBonusPercent).toBe(REBORN_ATTACK_BONUS_PERCENT);
  });
});

describe('isSpeciesInTank', () => {
  it('returns true when species is in tank', () => {
    addCore('merda');
    placeCore('merda', 'merda');
    expect(isSpeciesInTank('merda')).toBe(true);
  });

  it('returns false when species is not in tank', () => {
    expect(isSpeciesInTank('merda')).toBe(false);
  });
});

describe('getAvailableSlotCount', () => {
  it('returns remaining slots', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, nurturingSlots: 2 });
    addCore('merda');
    placeCore('merda', 'merda');
    expect(getAvailableSlotCount()).toBe(1);
  });
});

describe('loadTankSlots', () => {
  it('restores tank state from saved data', () => {
    loadTankSlots([{ coreId: 'merda', fragments: 10, fragmentsRequired: 400, source: 'core', zoidSpeciesId: 'merda' }]);
    expect(tankSlots()).toHaveLength(1);
    expect(tankSlots()[0].fragments).toBe(10);
  });
});
