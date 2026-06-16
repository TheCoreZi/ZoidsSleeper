import { describe, expect, it } from 'vitest';
import { DEFAULT_PARTY } from '../models/Zoid';
import { setParty } from '../store/partyStore';
import { ZoidAtLevelRequirement } from './ZoidAtLevelRequirement';

describe('ZoidAtLevelRequirement', () => {
  it('is not completed when party is empty', () => {
    setParty(DEFAULT_PARTY);
    const req = new ZoidAtLevelRequirement(50);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is not completed when max zoid level is below required', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }] });
    const req = new ZoidAtLevelRequirement(50);
    expect(req.isCompleted()).toBe(false);
  });

  it('is completed when a zoid meets the required level', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 500000, id: 'molga' }] });
    const req = new ZoidAtLevelRequirement(50);
    expect(req.isCompleted()).toBe(true);
  });

  it('is completed when any zoid in party meets the level', () => {
    setParty({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }, { experience: 500000, id: 'gator' }] });
    const req = new ZoidAtLevelRequirement(50);
    expect(req.isCompleted()).toBe(true);
  });
});
