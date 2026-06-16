import type { Evolution } from './EvolutionRule';
import { ZOID_LIST } from '../models/Zoid';

export interface EvolutionSource {
  evolution: Evolution;
  sourceId: string;
}

export function getEvolutionSources(targetId: string): EvolutionSource[] {
  const sources: EvolutionSource[] = [];
  for (const [id, species] of Object.entries(ZOID_LIST)) {
    for (const evo of species.evolutions ?? []) {
      if (evo.targetId === targetId) {
        sources.push({ evolution: evo, sourceId: id });
      }
    }
  }
  return sources;
}

export class EvolvableSpeciesByItem {
  evolution: Evolution;
  sourceId: string;

  constructor(evolution: Evolution, sourceId: string) {
    this.evolution = evolution;
    this.sourceId = sourceId;
  }
}

export function getSpeciesEvolvableByItem(itemId: string): EvolvableSpeciesByItem[] {
  const results: EvolvableSpeciesByItem[] = [];
  for (const [id, species] of Object.entries(ZOID_LIST)) {
    for (const evo of species.evolutions ?? []) {
      if (evo.requiresItem(itemId)) {
        results.push(new EvolvableSpeciesByItem(evo, id));
      }
    }
  }
  return results;
}
