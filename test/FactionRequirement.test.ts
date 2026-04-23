import { describe, expect, it } from 'vitest';
import { Faction } from '../src/models/Faction';
import { FactionRequirement } from '../src/requirement/FactionRequirement';
import { setPlayerStats } from '../src/store/gameStore';
import { DEFAULT_PLAYER } from '../src/models/Player';

describe('FactionRequirement', () => {
  it('should be completed when player faction matches', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, faction: Faction.HelicRepublic });
    const req = new FactionRequirement(Faction.HelicRepublic);

    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(1);
  });

  it('should not be completed when player faction differs', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, faction: Faction.GuylosEmpire });
    const req = new FactionRequirement(Faction.HelicRepublic);

    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('should not be completed when player is Neutral', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, faction: Faction.Neutral });
    const req = new FactionRequirement(Faction.HelicRepublic);

    expect(req.isCompleted()).toBe(false);
  });

  it('should return a hint string', () => {
    const req = new FactionRequirement(Faction.GuylosEmpire);

    expect(req.hint()).toContain('Guylos');
  });
});
