import { describe, expect, it } from 'vitest';
import { getEvolutionSources } from './evolutionLookup';

describe('getEvolutionSources', () => {
  it('finds source species for a known evolution target', () => {
    const results = getEvolutionSources('furolesios');
    expect(results).toHaveLength(1);
    expect(results[0].sourceId).toBe('aquadon');
  });

  it('returns empty array for a species that is not an evolution target', () => {
    expect(getEvolutionSources('aquadon')).toHaveLength(0);
  });

  it('returns the evolution rule from the source species', () => {
    const results = getEvolutionSources('godos');
    expect(results).toHaveLength(1);
    expect(results[0].sourceId).toBe('garius');
    expect(results[0].rule.targetId).toBe('godos');
  });

  it('finds multiple sources when a species has branching evolutions', () => {
    const iguan = getEvolutionSources('iguan');
    expect(iguan).toHaveLength(1);
    expect(iguan[0].sourceId).toBe('garius');
  });
});
