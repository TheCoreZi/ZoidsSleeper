import type { EvolutionRule } from './EvolutionRule';
import { ZOID_LIST } from '../models/Zoid';

interface EvolutionSource {
  rule: EvolutionRule;
  sourceId: string;
}

export function getEvolutionSource(targetId: string): EvolutionSource | null {
  for (const [id, species] of Object.entries(ZOID_LIST)) {
    if (species.evolution?.targetId === targetId) {
      return { rule: species.evolution, sourceId: id };
    }
  }
  return null;
}
