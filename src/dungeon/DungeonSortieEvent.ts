import { t } from '../i18n';
import type { Drop } from '../item/Drop';
import type { CurrencyReward } from '../models/Currency';
import type { Requirement } from '../requirement';
import type { CityAction } from '../landmark/action/CityAction';
import type { DungeonEvent } from './DungeonEventOutcome';
import type { BossPreview, BossTier, DungeonBoss, DungeonEnemy } from './DungeonSortieConfig';
import type { SupplyOption } from './DungeonSupply';

export class NodeProbability {
  base: number;
  depthDelta: number;

  constructor(base: number, depthDelta: number) {
    this.base = base;
    this.depthDelta = depthDelta;
  }

  at(progress: number): number {
    return this.base + this.depthDelta * progress;
  }
}

export interface NodeTypeChances {
  combat: NodeProbability;
  elite: NodeProbability;
  event: NodeProbability;
}

export const DEFAULT_NODE_TYPE_CHANCES: NodeTypeChances = {
  combat: new NodeProbability(0.45, -0.25),
  elite: new NodeProbability(0.10, 0.35),
  event: new NodeProbability(0.25, -0.05),
};

export interface DungeonSortieConfig {
  baseReward: CurrencyReward;
  bossTiers: BossTier[];
  completeRequirements?: Requirement[];
  eliteEnemies: DungeonEnemy[];
  enemies: DungeonEnemy[];
  entryCost: number;
  eventPool: DungeonEvent[];
  fragmentYield: number;
  id: string;
  itemDrops?: Drop[];
  layers: number;
  nodesPerLayer: [number, number];
  nodeTypeChances?: NodeTypeChances;
  requirements?: Requirement[];
  supplyOptions: SupplyOption[];
}

export class DungeonSortieEvent implements CityAction {
  baseReward: CurrencyReward;
  bossTiers: BossTier[];
  completeRequirements?: Requirement[];
  eliteEnemies: DungeonEnemy[];
  enemies: DungeonEnemy[];
  entryCost: number;
  eventPool: DungeonEvent[];
  fragmentYield: number;
  id: string;
  itemDrops?: Drop[];
  layers: number;
  nodesPerLayer: [number, number];
  nodeTypeChances?: NodeTypeChances;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  supplyOptions: SupplyOption[];

  constructor(config: DungeonSortieConfig) {
    this.baseReward = config.baseReward;
    this.bossTiers = config.bossTiers;
    this.completeRequirements = config.completeRequirements;
    this.eliteEnemies = config.eliteEnemies;
    this.enemies = config.enemies;
    this.entryCost = config.entryCost;
    this.eventPool = config.eventPool;
    this.fragmentYield = config.fragmentYield;
    this.id = config.id;
    this.itemDrops = config.itemDrops;
    this.layers = config.layers;
    this.nodesPerLayer = config.nodesPerLayer;
    this.nodeTypeChances = config.nodeTypeChances;
    this.requirements = config.requirements;
    this.supplyOptions = config.supplyOptions;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t('ui:begin_sortie');
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }

  getPossibleBosses(): BossPreview[] {
    return this.getActiveTier().getPreviews();
  }

  resolveBoss(): DungeonBoss {
    return this.getActiveTier().resolve();
  }

  private getActiveTier(): BossTier {
    let activeTier = this.bossTiers[0];
    for (const tier of this.bossTiers) {
      if (tier.requirements?.every((r) => r.isCompleted()) ?? true) {
        activeTier = tier;
      }
    }
    return activeTier;
  }
}
