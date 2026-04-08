import { type SortieLayer, type SortieNode, SortieNodeType } from './DungeonGraph';

interface GenerateOptions {
  layers: number;
  nodesPerLayer: [number, number];
}

export function generateSortie({ layers, nodesPerLayer }: GenerateOptions): SortieLayer[] {
  const result: SortieLayer[] = [];

  for (let depth = 0; depth < layers; depth++) {
    const count = randomBetween(nodesPerLayer[0], nodesPerLayer[1]);
    const nodes: SortieNode[] = Array.from({ length: count }, (_, i) => ({
      connectsTo: [],
      eventSeed: randomBetween(1, 100),
      id: `node_${depth}_${i}`,
      type: pickNodeType(depth, layers),
    }));
    result.push({ depth, nodes });
  }

  result.push({
    depth: layers,
    nodes: [{ connectsTo: [], eventSeed: 0, id: 'boss', type: SortieNodeType.Boss }],
  });

  wireConnections(result);
  return result;
}

function pickNodeType(depth: number, totalLayers: number): SortieNodeType {
  const progress = depth / totalLayers;
  const roll = Math.random();

  const combat = 0.45 - 0.25 * progress;
  const elite = 0.10 + 0.35 * progress;
  const event = 0.25 - 0.05 * progress;

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
