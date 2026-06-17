import { afterEach, describe, expect, it, vi } from 'vitest';

import { SortieNodeType } from './DungeonGraph';
import { NodeProbability } from './DungeonSortieEvent';
import type { NodeTypeChances } from './DungeonSortieEvent';
import { generateSortie } from './generateSortie';

function getIntermediateNodes(layers: number, nodesPerLayer: [number, number], nodeTypeChances?: NodeTypeChances) {
  const graph = generateSortie({ layers, nodesPerLayer, nodeTypeChances });
  return graph.slice(1, -1).flatMap((l) => l.nodes);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('generateSortie', () => {
  it('first layer is Entry and last layer is Boss', () => {
    const graph = generateSortie({ layers: 3, nodesPerLayer: [2, 2] });
    expect(graph[0].nodes).toHaveLength(1);
    expect(graph[0].nodes[0].type).toBe(SortieNodeType.Entry);
    expect(graph[graph.length - 1].nodes).toHaveLength(1);
    expect(graph[graph.length - 1].nodes[0].type).toBe(SortieNodeType.Boss);
  });

  it('intermediate nodes have valid types with default chances', () => {
    const validTypes: SortieNodeType[] = [SortieNodeType.Combat, SortieNodeType.Elite, SortieNodeType.Event, SortieNodeType.Supply];
    const nodes = getIntermediateNodes(4, [3, 3]);
    for (const node of nodes) {
      expect(validTypes).toContain(node.type);
    }
  });

  it('all combat when combat chance is 1', () => {
    const chances = { combat: new NodeProbability(1, 0), elite: new NodeProbability(0, 0), event: new NodeProbability(0, 0) };
    const nodes = getIntermediateNodes(4, [3, 3], chances);
    for (const node of nodes) {
      expect(node.type).toBe(SortieNodeType.Combat);
    }
  });

  it('all elite when elite chance is 1', () => {
    const chances = { combat: new NodeProbability(0, 0), elite: new NodeProbability(1, 0), event: new NodeProbability(0, 0) };
    const nodes = getIntermediateNodes(4, [3, 3], chances);
    for (const node of nodes) {
      expect(node.type).toBe(SortieNodeType.Elite);
    }
  });

  it('all event when event chance is 1', () => {
    const chances = { combat: new NodeProbability(0, 0), elite: new NodeProbability(0, 0), event: new NodeProbability(1, 0) };
    const nodes = getIntermediateNodes(4, [3, 3], chances);
    for (const node of nodes) {
      expect(node.type).toBe(SortieNodeType.Event);
    }
  });

  it('all supply when all chances are 0', () => {
    const chances = { combat: new NodeProbability(0, 0), elite: new NodeProbability(0, 0), event: new NodeProbability(0, 0) };
    const nodes = getIntermediateNodes(4, [3, 3], chances);
    for (const node of nodes) {
      expect(node.type).toBe(SortieNodeType.Supply);
    }
  });

  it('depth scaling changes node type for the same roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    const graph = generateSortie({
      layers: 4,
      nodesPerLayer: [1, 1],
      nodeTypeChances: { combat: new NodeProbability(0.45, -0.25), elite: new NodeProbability(0.10, 0.35), event: new NodeProbability(0.25, -0.05) },
    });
    // depth 0 (i=0): progress=0, combat=0.45 → 0.35 < 0.45 → Combat
    expect(graph[1].nodes[0].type).toBe(SortieNodeType.Combat);
    // depth 3 (i=3): progress=0.75, combat=0.2625 → 0.35 > 0.2625, elite=0.3625 → 0.35 < 0.2625+0.3625=0.625 → Elite
    expect(graph[4].nodes[0].type).toBe(SortieNodeType.Elite);
  });

  it('Entry and Boss layers are unaffected by custom chances', () => {
    const graph = generateSortie({
      layers: 2,
      nodesPerLayer: [2, 2],
      nodeTypeChances: { combat: new NodeProbability(1, 0), elite: new NodeProbability(0, 0), event: new NodeProbability(0, 0) },
    });
    expect(graph[0].nodes[0].type).toBe(SortieNodeType.Entry);
    expect(graph[graph.length - 1].nodes[0].type).toBe(SortieNodeType.Boss);
  });
});
