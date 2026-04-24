import { t } from '../i18n';
import type { Drop } from '../item/Drop';
import type { CurrencyReward } from '../models/Currency';
import type { Requirement } from '../requirement';
import type { CityAction } from '../landmark/action/CityAction';
import type { DungeonEvent } from './DungeonEventOutcome';
import type { BossPreview, BossTier, DungeonBoss, DungeonEnemy } from './DungeonSortieConfig';
import type { SupplyOption } from './DungeonSupply';

export interface DungeonSortieConfig {
  baseReward: CurrencyReward;
  bossTiers: BossTier[];
  completeRequirements?: Requirement[];
  eliteEnemies: DungeonEnemy[];
  enemies: DungeonEnemy[];
  entryCost: number;
  eventPool: DungeonEvent[];
  id: string;
  itemDrops?: Drop[];
  layers: number;
  nodesPerLayer: [number, number];
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
  id: string;
  itemDrops?: Drop[];
  layers: number;
  nodesPerLayer: [number, number];
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
    this.id = config.id;
    this.itemDrops = config.itemDrops;
    this.layers = config.layers;
    this.nodesPerLayer = config.nodesPerLayer;
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
