import { describe, expect, it } from 'vitest';
import { probabilityRandom } from '../src/utils/probabilityRandom';

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
