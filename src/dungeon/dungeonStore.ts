import { createMemo, createSignal } from 'solid-js';
import { emitRewardEvent, setPlayerStats } from '../store/gameStore';
import type { DungeonBoss } from './DungeonSortieConfig';
import { Currency } from '../models/Currency';
import { addCurrency } from '../store/walletStore';
import type { DungeonSortieEvent } from './DungeonSortieEvent';
import type { DungeonEventChoice } from './DungeonEventOutcome';
import { EventOutcomeType } from './DungeonEventOutcome';
import { SortieNodeType } from './DungeonGraph';
import type { SortieLayer, SortieNode } from './DungeonGraph';
import { SupplyCostType, SupplyType } from './DungeonSupply';
import type { SupplyOption } from './DungeonSupply';
import { ENTRY_NODE_ID, generateSortie } from './generateSortie';

export const DungeonPhase = {
  Boss: 'boss',
  Combat: 'combat',
  Event: 'event',
  Map: 'map',
  Supply: 'supply',
} as const;
export type DungeonPhase = (typeof DungeonPhase)[keyof typeof DungeonPhase];

export interface DungeonRunState {
  boss: DungeonBoss;
  config: DungeonSortieEvent;
  currentDepth: number;
  currentNodeId: string | null;
  graph: SortieLayer[];
  nodeResults: Record<string, 'completed' | 'skipped'>;
  playerHealth: number;
  playerMaxHealth: number;
}

const [dungeonPhase, setDungeonPhase] = createSignal<DungeonPhase>(DungeonPhase.Map);
const [dungeonRun, setDungeonRun] = createSignal<DungeonRunState | null>(null);
const [isLayerAdvancing, setIsLayerAdvancing] = createSignal(false);

const isDungeonActive = createMemo(() => dungeonRun() !== null);

const currentEvent = createMemo(() => {
  const run = dungeonRun();
  if (!run?.currentNodeId) {return null;}
  const node = findNode(run.graph, run.currentNodeId);
  if (!node || node.type !== SortieNodeType.Event) {return null;}
  const pool = run.config.eventPool;
  const index = node.eventSeed % pool.length;
  return pool[index];
});

function advanceLayer(): void {
  setDungeonRun((prev) => {
    if (!prev) {return prev;}
    return { ...prev, currentDepth: prev.currentDepth + 1, currentNodeId: null };
  });
  setDungeonPhase(DungeonPhase.Map);
}

function applyEventOutcome(choice: DungeonEventChoice): void {
  const { outcome } = choice;
  switch (outcome.type) {
    case EventOutcomeType.Damage:
      applyPlayerHealthChangePercent(-outcome.value);
      break;
    case EventOutcomeType.Heal:
      applyPlayerHealthChangePercent(outcome.value);
      break;
    case EventOutcomeType.Reward:
      addCurrency(Currency.Magnis, outcome.value);
      emitRewardEvent(outcome.value, 'magnis');
      break;
  }
}

function applyPlayerHealthChangePercent(percent: number, minHealth = 0): void {
  const run = dungeonRun();
  if (!run) {return;}
  const delta = Math.floor(run.playerMaxHealth * percent / 100);
  changePlayerHealth(delta, minHealth);
}

function applySupply(option: SupplyOption): void {
  // Apply benefit
  switch (option.type) {
    case SupplyType.AttackBuff:
      setPlayerStats((prev) => prev ? { ...prev, attackMult: prev.attackMult * (1 + option.value / 100) } : prev);
      break;
    case SupplyType.Heal:
      applyPlayerHealthChangePercent(option.value);
      break;
  }
  // Apply cost
  switch (option.costType) {
    case SupplyCostType.AttackDebuff:
      setPlayerStats((prev) => prev ? { ...prev, attackMult: Math.max(0.1, prev.attackMult * (1 - option.costValue / 100)) } : prev);
      break;
    case SupplyCostType.Damage:
      applyPlayerHealthChangePercent(-option.costValue, 1);
      break;
  }
}

function changePlayerHealth(delta: number, minHealth = 0): void {
  setDungeonRun((prev) => {
    if (!prev) {return prev;}
    const newHealth = Math.max(minHealth, Math.min(prev.playerMaxHealth, prev.playerHealth + delta));
    return { ...prev, playerHealth: newHealth };
  });
}

function endDungeon(): void {
  setIsLayerAdvancing(false);
  resetBuffs();
  setDungeonRun(null);
  setDungeonPhase(DungeonPhase.Map);
}

function findNode(graph: SortieLayer[], nodeId: string): SortieNode | undefined {
  for (const layer of graph) {
    const node = layer.nodes.find((n) => n.id === nodeId);
    if (node) {return node;}
  }
  return undefined;
}

function getPlayerHealth(): number {
  return dungeonRun()?.playerHealth ?? 0;
}

function isPlayerDead(): boolean {
  return (dungeonRun()?.playerHealth ?? 0) <= 0;
}

function markNodeCompleted(nodeId: string): void {
  setDungeonRun((prev) => {
    if (!prev) {return prev;}
    return { ...prev, nodeResults: { ...prev.nodeResults, [nodeId]: 'completed' } };
  });
}

function selectNode(nodeId: string): void {
  setDungeonRun((prev) => {
    if (!prev) {return prev;}
    return { ...prev, currentNodeId: nodeId };
  });
}

function resetBuffs(): void {
  setPlayerStats((prev) => prev ? { ...prev, attackMult: 1 } : prev);
}

function startSortie(config: DungeonSortieEvent, playerHealth: number, playerMaxHealth: number): void {
  resetBuffs();
  const graph = generateSortie({ layers: config.layers, nodesPerLayer: config.nodesPerLayer });
  setDungeonRun({
    boss: config.resolveBoss(),
    config,
    currentDepth: 1,
    currentNodeId: null,
    graph,
    nodeResults: { [ENTRY_NODE_ID]: 'completed' },
    playerHealth,
    playerMaxHealth,
  });
  setDungeonPhase(DungeonPhase.Map);
}

export {
  advanceLayer,
  applyEventOutcome,
  applySupply,
  currentEvent,
  changePlayerHealth,
  dungeonPhase,
  dungeonRun,
  endDungeon,
  findNode,
  getPlayerHealth,
  isDungeonActive,
  isLayerAdvancing,
  isPlayerDead,
  markNodeCompleted,
  selectNode,
  setDungeonPhase,
  setIsLayerAdvancing,
  startSortie,
};
