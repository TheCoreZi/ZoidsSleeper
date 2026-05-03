import { describe, expect, it } from 'vitest';
import { addZoidToArmy, party, removeZoidFromArmy, setParty } from './partyStore';
import type { PartyData } from '../models/Zoid';

const EMPTY_PARTY: PartyData = { commanderZoidId: '', zoids: [] };

describe('removeZoidFromArmy', () => {
  it('removes a zoid from the party', () => {
    setParty(EMPTY_PARTY);
    addZoidToArmy('garius');
    addZoidToArmy('sea_panther');

    removeZoidFromArmy('sea_panther');

    expect(party().zoids).toHaveLength(1);
    expect(party().zoids[0].id).toBe('garius');
  });

  it('decrements copies when zoid has multiple copies', () => {
    setParty(EMPTY_PARTY);
    addZoidToArmy('barigator');
    addZoidToArmy('barigator');

    removeZoidFromArmy('barigator');

    expect(party().zoids).toHaveLength(1);
    expect(party().zoids[0].copies).toBe(1);
  });

  it('reassigns commander when removed zoid was commander', () => {
    setParty(EMPTY_PARTY);
    addZoidToArmy('sea_panther');
    addZoidToArmy('garius');

    expect(party().commanderZoidId).toBe('sea_panther');

    removeZoidFromArmy('sea_panther');

    expect(party().commanderZoidId).toBe('garius');
    expect(party().zoids).toHaveLength(1);
  });

  it('does nothing when zoid is not in party', () => {
    setParty(EMPTY_PARTY);
    addZoidToArmy('garius');

    removeZoidFromArmy('sea_panther');

    expect(party().zoids).toHaveLength(1);
  });

  it('keeps commander when non-commander zoid is removed', () => {
    setParty(EMPTY_PARTY);
    addZoidToArmy('garius');
    addZoidToArmy('sea_panther');

    removeZoidFromArmy('sea_panther');

    expect(party().commanderZoidId).toBe('garius');
  });
});
