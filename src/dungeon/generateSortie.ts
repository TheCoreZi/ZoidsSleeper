import { type SortieLayer, type SortieNode, SortieNodeType } from './DungeonGraph';
import { DEFAULT_NODE_TYPE_CHANCES } from './DungeonSortieEvent';
import type { NodeTypeChances } from './DungeonSortieEvent';

interface GenerateOptions {
  layers: number;
  nodesPerLayer: [number, number];
  nodeTypeChances?: NodeTypeChances;
}

export const ENTRY_NODE_ID = 'entry';

export function generateSortie({ layers, nodesPerLayer, nodeTypeChances }: GenerateOptions): SortieLayer[] {
  const result: SortieLayer[] = [];

  result.push({
    depth: 0,
    nodes: [{ connectsTo: [], eventSeed: 0, id: ENTRY_NODE_ID, type: SortieNodeType.Entry }],
  });

  const chances = nodeTypeChances ?? DEFAULT_NODE_TYPE_CHANCES;

  for (let i = 0; i < layers; i++) {
    const depth = i + 1;
    const count = randomBetween(nodesPerLayer[0], nodesPerLayer[1]);
    const nodes: SortieNode[] = Array.from({ length: count }, (_, j) => ({
      connectsTo: [],
      eventSeed: randomBetween(1, 100),
      id: `node_${depth}_${j}`,
      type: pickNodeType(i, layers, chances),
    }));
    result.push({ depth, nodes });
  }

  result.push({
    depth: layers + 1,
    nodes: [{ connectsTo: [], eventSeed: 0, id: 'boss', type: SortieNodeType.Boss }],
  });

  wireConnections(result);
  return result;
}

function pickNodeType(depth: number, totalLayers: number, chances: NodeTypeChances): SortieNodeType {
  const progress = depth / totalLayers;
  const roll = Math.random();

  const combat = chances.combat.at(progress);
  const elite = chances.elite.at(progress);
  const event = chances.event.at(progress);

  if (roll < combat) {return SortieNodeType.Combat;}
  if (roll < combat + elite) {return SortieNodeType.Elite;}
  if (roll < combat + elite + event) {return SortieNodeType.Event;}
  return SortieNodeType.Supply;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wireConnections(layers: SortieLayer[]): void {
  for (let i = 0; i < layers.length - 1; i++) {
    const current = layers[i].nodes;
    const next = layers[i + 1].nodes;

    for (const node of current) {
      const targetIndex = Math.floor(Math.random() * next.length);
      node.connectsTo.push(next[targetIndex].id);
      if (next.length > 1 && Math.random() < 0.5) {
        const second = (targetIndex + 1) % next.length;
        node.connectsTo.push(next[second].id);
      }
    }

    for (const nextNode of next) {
      const isReachable = current.some((n) => n.connectsTo.includes(nextNode.id));
      if (!isReachable) {
        const source = current[Math.floor(Math.random() * current.length)];
        source.connectsTo.push(nextNode.id);
      }
    }
  }
}
