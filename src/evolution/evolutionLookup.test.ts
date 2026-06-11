import { describe, expect, it } from 'vitest';
import { getEvolutionSource } from './evolutionLookup';

describe('getEvolutionSource', () => {
  it('finds source species for a known evolution target', () => {
    const result = getEvolutionSource('furolesios');
    expect(result).not.toBeNull();
    expect(result!.sourceId).toBe('aquadon');
  });

  it('returns null for a species that is not an evolution target', () => {
    expect(getEvolutionSource('aquadon')).toBeNull();
  });

  it('returns the evolution rule from the source species', () => {
    const result = getEvolutionSource('godos');
    expect(result).not.toBeNull();
    expect(result!.sourceId).toBe('garius');
    expect(result!.rule.targetId).toBe('godos');
  });
});
