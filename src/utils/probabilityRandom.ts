const MIN_PROBABILITY = 0.01;

export interface ResolvedProbability<T> {
  item: T;
  probability: number;
}

export function probabilityRandom<T>(items: T[], getProbability: (item: T) => number | undefined): T {
  if (items.length === 0) { throw new Error('items must not be empty'); }
  if (items.length === 1) { return items[0]; }

  const resolved = resolveProbabilities(items, getProbability);
  const roll = Math.random();
  let cumulative = 0;
  for (const entry of resolved) {
    cumulative += entry.probability;
    if (roll < cumulative) { return entry.item; }
  }
  return items[items.length - 1];
}

export function resolveProbabilities<T>(items: T[], getProbability: (item: T) => number | undefined): ResolvedProbability<T>[] {
  const explicit: (number | undefined)[] = items.map(getProbability);
  const withoutCount = explicit.filter((p) => p === undefined).length;
  const explicitSum = explicit.reduce<number>((sum, p) => sum + (p ?? 0), 0);

  if (withoutCount === 0) {
    const total = explicitSum || 1;
    return items.map((item, i) => ({ item, probability: (explicit[i] ?? 0) / total }));
  } else if (explicitSum >= 1) {
    const reserved = withoutCount * MIN_PROBABILITY;
    const scale = (1 - reserved) / explicitSum;
    return items.map((item, i) => ({ item, probability: explicit[i] !== undefined ? explicit[i] * scale : MIN_PROBABILITY }));
  } else {
    const remainder = (1 - explicitSum) / withoutCount;
    return items.map((item, i) => ({ item, probability: explicit[i] ?? remainder }));
  }
}
