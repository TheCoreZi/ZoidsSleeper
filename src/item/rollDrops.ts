import type { Drop } from './Drop';

export function buildDropPool(...sources: (Drop[] | undefined)[]): Drop[] {
  return sources.flatMap((s) => s ?? []);
}

export function rollDrops(
  drops: Drop[],
  rng: () => number = Math.random
): Drop | null {
  for (const drop of drops) {
    if (!drop.canDrop()) {continue;}
    if (rng() * 100 < drop.chance) {return drop;}
  }
  return null;
}
