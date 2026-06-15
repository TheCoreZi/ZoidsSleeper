import { CompoundEvolution } from './EvolutionRule';
import type { EvolutionRule } from './EvolutionRule';
import { ItemEvolution } from './ItemEvolution';
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

export class EvolvableSpeciesByItem {
  rule: EvolutionRule;
  sourceId: string;

  constructor(rule: EvolutionRule, sourceId: string) {
    this.rule = rule;
    this.sourceId = sourceId;
  }
}

function containsItemEvolution(rule: EvolutionRule, itemId: string): boolean {
  if (rule instanceof ItemEvolution) { return rule.itemId === itemId; }
  if (rule instanceof CompoundEvolution) { return rule.conditions.some((c) => containsItemEvolution(c, itemId)); }
  return false;
}

export function getSpeciesEvolvableByItem(itemId: string): EvolvableSpeciesByItem[] {
  const results: EvolvableSpeciesByItem[] = [];
  for (const [id, species] of Object.entries(ZOID_LIST)) {
    for (const evo of species.evolutions ?? []) {
      if (containsItemEvolution(evo, itemId)) {
        results.push(new EvolvableSpeciesByItem(evo, id));
      }
    }
  }
  return results;
}
