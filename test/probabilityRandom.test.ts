import { describe, expect, it } from 'vitest';
import { probabilityRandom, resolveProbabilities } from '../src/utils/probabilityRandom';

interface Item { name: string; probability?: number }

function distribution(items: Item[], runs: number): Map<string, number> {
  const counts = new Map<string, number>();
  for (let i = 0; i < runs; i++) {
    const picked = probabilityRandom(items, (it) => it.probability);
    counts.set(picked.name, (counts.get(picked.name) ?? 0) + 1);
  }
  return counts;
}

describe('probabilityRandom', () => {
  it('should throw for empty array', () => {
    expect(() => probabilityRandom([], () => undefined)).toThrow();
  });

  it('should return the only item for single-element array', () => {
    const item = { name: 'A' };
    expect(probabilityRandom([item], () => undefined)).toBe(item);
  });

  it('should distribute uniformly when no items have probability', () => {
    const items: Item[] = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }];
    const counts = distribution(items, 10_000);
    for (const item of items) {
      const ratio = (counts.get(item.name) ?? 0) / 10_000;
      expect(ratio).toBeGreaterThan(0.15);
      expect(ratio).toBeLessThan(0.35);
    }
  });

  it('should respect explicit probability and split remainder', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.5 },
      { name: 'B' },
      { name: 'C' },
    ];
    const counts = distribution(items, 10_000);
    const ratioA = (counts.get('A') ?? 0) / 10_000;
    const ratioB = (counts.get('B') ?? 0) / 10_000;
    const ratioC = (counts.get('C') ?? 0) / 10_000;
    expect(ratioA).toBeGreaterThan(0.4);
    expect(ratioA).toBeLessThan(0.6);
    expect(ratioB).toBeGreaterThan(0.15);
    expect(ratioB).toBeLessThan(0.35);
    expect(ratioC).toBeGreaterThan(0.15);
    expect(ratioC).toBeLessThan(0.35);
  });

  it('should handle all items with explicit probabilities summing to 1', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.7 },
      { name: 'B', probability: 0.3 },
    ];
    const counts = distribution(items, 10_000);
    const ratioA = (counts.get('A') ?? 0) / 10_000;
    expect(ratioA).toBeGreaterThan(0.6);
    expect(ratioA).toBeLessThan(0.8);
  });

  it('should normalize when sum exceeds 1 and give minimum to unset items', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.6 },
      { name: 'B', probability: 0.6 },
      { name: 'C' },
    ];
    const counts = distribution(items, 10_000);
    const ratioC = (counts.get('C') ?? 0) / 10_000;
    expect(ratioC).toBeGreaterThan(0);
    expect(ratioC).toBeLessThan(0.05);
    const ratioA = (counts.get('A') ?? 0) / 10_000;
    const ratioB = (counts.get('B') ?? 0) / 10_000;
    expect(Math.abs(ratioA - ratioB)).toBeLessThan(0.1);
  });

  it('should normalize when sum equals 1 and give minimum to unset items', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.5 },
      { name: 'B', probability: 0.5 },
      { name: 'C' },
      { name: 'D' },
    ];
    const counts = distribution(items, 10_000);
    const ratioC = (counts.get('C') ?? 0) / 10_000;
    const ratioD = (counts.get('D') ?? 0) / 10_000;
    expect(ratioC).toBeGreaterThan(0);
    expect(ratioC).toBeLessThan(0.05);
    expect(ratioD).toBeGreaterThan(0);
    expect(ratioD).toBeLessThan(0.05);
  });
});

describe('resolveProbabilities', () => {
  const getProbability = (item: Item) => item.probability;

  it('should return objects with item and probability', () => {
    const items: Item[] = [{ name: 'A' }, { name: 'B' }];
    const result = resolveProbabilities(items, getProbability);
    expect(result[0].item).toBe(items[0]);
    expect(result[0]).toHaveProperty('probability');
    expect(result[1].item).toBe(items[1]);
  });

  it('should return equal probabilities when none are set', () => {
    const items: Item[] = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    const result = resolveProbabilities(items, getProbability);
    expect(result.map((r) => r.probability)).toEqual([1 / 3, 1 / 3, 1 / 3]);
  });

  it('should split remainder among undefined items', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.5 },
      { name: 'B' },
      { name: 'C' },
    ];
    const result = resolveProbabilities(items, getProbability);
    expect(result[0].probability).toBeCloseTo(0.5);
    expect(result[1].probability).toBeCloseTo(0.25);
    expect(result[2].probability).toBeCloseTo(0.25);
  });

  it('should normalize when all probabilities are explicit', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.6 },
      { name: 'B', probability: 0.4 },
    ];
    const result = resolveProbabilities(items, getProbability);
    expect(result[0].probability).toBeCloseTo(0.6);
    expect(result[1].probability).toBeCloseTo(0.4);
  });

  it('should sum to 1', () => {
    const items: Item[] = [
      { name: 'A', probability: 0.01 },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
    ];
    const result = resolveProbabilities(items, getProbability);
    const sum = result.reduce((s, r) => s + r.probability, 0);
    expect(sum).toBeCloseTo(1);
  });
});
