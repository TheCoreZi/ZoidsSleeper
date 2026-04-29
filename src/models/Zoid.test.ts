import { describe, expect, it } from 'vitest';
import { Faction } from './Faction';
import { TerrainType } from './Terrain';
import { calculatePartyAttack, type OwnedZoid } from './Zoid';

describe('calculatePartyAttack', () => {
  const landZoid: OwnedZoid = { id: 'shield_liger', experience: 1000 };
  const waterZoid: OwnedZoid = { id: 'aquadon', experience: 1000 };
  const airZoid: OwnedZoid = { id: 'redler', experience: 1000 };

  it('returns full attack on matching terrain', () => {
    const landAttack = calculatePartyAttack([landZoid], Faction.Neutral, TerrainType.Land);
    const waterAttack = calculatePartyAttack([waterZoid], Faction.Neutral, TerrainType.Water);
    expect(landAttack).toBeGreaterThan(0);
    expect(waterAttack).toBeGreaterThan(0);
  });

  it('returns 0 for land-only zoid in water terrain', () => {
    const attack = calculatePartyAttack([landZoid], Faction.Neutral, TerrainType.Water);
    expect(attack).toBe(0);
  });

  it('reduces attack for mismatched terrain', () => {
    const landAttack = calculatePartyAttack([airZoid], Faction.Neutral, TerrainType.Land);
    const airAttack = calculatePartyAttack([airZoid], Faction.Neutral, TerrainType.Air);
    expect(landAttack).toBeLessThan(airAttack);
  });

  it('defaults to land terrain when not specified', () => {
    const defaultAttack = calculatePartyAttack([landZoid], Faction.Neutral);
    const landAttack = calculatePartyAttack([landZoid], Faction.Neutral, TerrainType.Land);
    expect(defaultAttack).toBe(landAttack);
  });
});
