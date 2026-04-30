import { describe, expect, it } from 'vitest';
import { getTerrainBorderStyle, getTerrainBonus, TERRAIN_COLORS, TerrainType } from './Terrain';

describe('getTerrainBonus', () => {
  it('returns 1.0 for matching single terrain type', () => {
    expect(getTerrainBonus(TerrainType.Land, [TerrainType.Land])).toBe(1.0);
    expect(getTerrainBonus(TerrainType.Air, [TerrainType.Air])).toBe(1.0);
    expect(getTerrainBonus(TerrainType.Water, [TerrainType.Water])).toBe(1.0);
  });

  it('returns 0 for land-only zoid in water terrain', () => {
    expect(getTerrainBonus(TerrainType.Water, [TerrainType.Land])).toBe(0);
  });

  it('returns 0.25 for air zoid in land terrain', () => {
    expect(getTerrainBonus(TerrainType.Land, [TerrainType.Air])).toBe(0.25);
  });

  it('returns 0.10 for land zoid in air terrain', () => {
    expect(getTerrainBonus(TerrainType.Air, [TerrainType.Land])).toBe(0.10);
  });

  it('picks the highest multiplier for multi-terrain zoid', () => {
    expect(getTerrainBonus(TerrainType.Water, [TerrainType.Air, TerrainType.Water])).toBe(1.0);
    expect(getTerrainBonus(TerrainType.Land, [TerrainType.Air, TerrainType.Water])).toBe(0.25);
    expect(getTerrainBonus(TerrainType.Water, [TerrainType.Water, TerrainType.Land])).toBe(1.0);
  });

  it('returns penalty values for non-matching types', () => {
    expect(getTerrainBonus(TerrainType.Water, [TerrainType.Air])).toBe(0.25);
    expect(getTerrainBonus(TerrainType.Air, [TerrainType.Water])).toBe(0.10);
    expect(getTerrainBonus(TerrainType.Land, [TerrainType.Water])).toBe(0.25);
  });
});

describe('getTerrainBorderStyle', () => {
  it('returns solid color for single terrain', () => {
    expect(getTerrainBorderStyle([TerrainType.Land])).toBe(TERRAIN_COLORS[TerrainType.Land]);
    expect(getTerrainBorderStyle([TerrainType.Water])).toBe(TERRAIN_COLORS[TerrainType.Water]);
    expect(getTerrainBorderStyle([TerrainType.Air])).toBe(TERRAIN_COLORS[TerrainType.Air]);
  });

  it('returns gradient for multiple terrains', () => {
    const result = getTerrainBorderStyle([TerrainType.Water, TerrainType.Land]);
    expect(result).toContain('linear-gradient');
    expect(result).toContain(TERRAIN_COLORS[TerrainType.Land]);
    expect(result).toContain(TERRAIN_COLORS[TerrainType.Water]);
  });

  it('sorts terrain colors alphabetically for consistency', () => {
    const a = getTerrainBorderStyle([TerrainType.Water, TerrainType.Air]);
    const b = getTerrainBorderStyle([TerrainType.Air, TerrainType.Water]);
    expect(a).toBe(b);
  });
});
