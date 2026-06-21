import { afterEach, describe, expect, it } from 'vitest';

import { DungeonEvent, DungeonEventChoice, HealOutcome } from './DungeonEventOutcome';
import { BossTier, PilotBossEntry } from './DungeonSortieConfig';
import { DungeonSortieEvent } from './DungeonSortieEvent';
import { ENTRY_NODE_ID } from './generateSortie';
import {
  advanceLayer,
  dungeonRun,
  endDungeon,
  isLayerAdvancing,
  markNodeCompleted,
  setIsLayerAdvancing,
  startSortie,
} from './dungeonStore';

const DUMMY_EVENT = new DungeonEvent('e1', 'test', [new DungeonEventChoice('ok', [new HealOutcome('heal', 10)])]);

const DUMMY_SORTIE = new DungeonSortieEvent({
  baseReward: { magnis: 100 },
  bossTiers: [new BossTier([new PilotBossEntry('bandit1')])],
  eliteEnemies: [],
  enemies: [{ zoidData: { id: 'gator', level: 1 } }],
  entryCost: 0,
  eventPool: [DUMMY_EVENT],
  fragmentYield: 2,
  id: 'test_sortie',
  layers: 3,
  nodesPerLayer: [2, 3],
  supplyOptions: [],
});

describe('Dungeon layer advance animation', () => {
  afterEach(() => {
    if (dungeonRun()) { endDungeon(); }
    setIsLayerAdvancing(false);
  });

  it('starts at depth 1 with entry node completed', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;
    expect(run.currentDepth).toBe(1);
    expect(run.nodeResults[ENTRY_NODE_ID]).toBe('completed');
    expect(run.graph[0].nodes[0].id).toBe(ENTRY_NODE_ID);
  });

  it('entry node connects to all first-layer nodes', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;
    const entryNode = run.graph[0].nodes[0];
    const firstLayerNodes = run.graph[1].nodes;
    for (const node of firstLayerNodes) {
      expect(entryNode.connectsTo).toContain(node.id);
    }
  });

  it('advanceLayer increments depth without setting isLayerAdvancing', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;
    markNodeCompleted(run.graph[1].nodes[0].id);
    advanceLayer();

    expect(isLayerAdvancing()).toBe(false);
    expect(dungeonRun()!.currentDepth).toBe(2);
  });

  it('visibleLayers includes previous layer', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;

    const visible = run.graph.slice(Math.max(0, run.currentDepth - 1));
    expect(visible[0].depth).toBe(0);
    expect(visible[1].depth).toBe(1);
  });

  it('only the completed node from previous layer should drive active connections', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;

    const completedNodeId = ENTRY_NODE_ID;
    const prevLayer = run.graph[run.currentDepth - 1];
    const completedNode = prevLayer.nodes.find((n) => run.nodeResults[n.id] === 'completed');

    expect(completedNode).toBeDefined();
    expect(completedNode!.id).toBe(completedNodeId);

    const otherNodes = prevLayer.nodes.filter((n) => n.id !== completedNodeId);
    for (const node of otherNodes) {
      expect(run.nodeResults[node.id]).toBeUndefined();
    }
  });

  it('after advancing, completed node from new previous layer drives active connections', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    const run = dungeonRun()!;

    const firstLayerNode = run.graph[1].nodes[0];
    markNodeCompleted(firstLayerNode.id);
    advanceLayer();

    const updated = dungeonRun()!;
    const prevLayer = updated.graph[updated.currentDepth - 1];
    const completedNode = prevLayer.nodes.find((n) => updated.nodeResults[n.id] === 'completed');

    expect(completedNode).toBeDefined();
    expect(completedNode!.id).toBe(firstLayerNode.id);
  });

  it('endDungeon clears isLayerAdvancing', () => {
    startSortie(DUMMY_SORTIE, 100, 100);
    setIsLayerAdvancing(true);
    expect(isLayerAdvancing()).toBe(true);

    endDungeon();
    expect(isLayerAdvancing()).toBe(false);
  });
});
