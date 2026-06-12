import type { EvolutionRule } from './EvolutionRule';
import { ZOID_LIST } from '../models/Zoid';

export interface EvolutionSource {
  rule: EvolutionRule;
  sourceId: string;
}

export function getEvolutionSources(targetId: string): EvolutionSource[] {
  const sources: EvolutionSource[] = [];
  for (const [id, species] of Object.entries(ZOID_LIST)) {
    for (const evo of species.evolutions ?? []) {
      if (evo.targetId === targetId) {
        sources.push({ rule: evo, sourceId: id });
      }
    }
  }
  return sources;
}
