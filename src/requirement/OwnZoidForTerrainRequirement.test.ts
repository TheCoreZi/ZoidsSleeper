import { describe, expect, it } from 'vitest';
import { TerrainType } from '../models/Terrain';
import { setParty } from '../store/partyStore';
import { OwnZoidForTerrainRequirement } from './OwnZoidForTerrainRequirement';

describe('OwnZoidForTerrainRequirement', () => {
  it('is not completed with empty party', () => {
    setParty({ commanderZoidId: '', zoids: [] });
    const req = new OwnZoidForTerrainRequirement(TerrainType.Water);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is not completed when party has only land zoids', () => {
    setParty({ commanderZoidId: 'merda', zoids: [{ experience: 0, id: 'merda' }] });
    const req = new OwnZoidForTerrainRequirement(TerrainType.Water);
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when party has a water zoid', () => {
    setParty({ commanderZoidId: 'aquadon', zoids: [{ experience: 0, id: 'aquadon' }] });
    const req = new OwnZoidForTerrainRequirement(TerrainType.Water);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(1);
  });

  it('is completed when party has a multi-terrain zoid with water', () => {
    setParty({ commanderZoidId: 'barigator', zoids: [{ experience: 0, id: 'barigator' }] });
    const req = new OwnZoidForTerrainRequirement(TerrainType.Water);
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(1);
  });
});
