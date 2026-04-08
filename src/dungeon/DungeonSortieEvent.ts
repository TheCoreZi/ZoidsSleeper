import { t } from '../i18n';
import type { Pilot } from '../models/Pilot';
import { PILOTS } from '../models/Pilot';
import type { Requirement } from '../requirement';
import type { CityAction } from '../landmark/action/CityAction';
import type { DungeonEvent } from './DungeonEventOutcome';
import type { BossTier, DungeonEnemy } from './DungeonSortieConfig';
import type { SupplyOption } from './DungeonSupply';

export interface DungeonSortieConfig {
  baseReward: number;
  bossTiers: BossTier[];
  completeRequirements?: Requirement[];
  eliteEnemies: DungeonEnemy[];
  enemies: DungeonEnemy[];
  entryCost: number;
  eventPool: DungeonEvent[];
  id: string;
  layers: number;
  nodesPerLayer: [number, number];
  requirements?: Requirement[];
  supplyOptions: SupplyOption[];
}

export class DungeonSortieEvent implements CityAction {
  baseReward: number;
  bossTiers: BossTier[];
  completeRequirements?: Requirement[];
  eliteEnemies: DungeonEnemy[];
  enemies: DungeonEnemy[];
  entryCost: number;
  eventPool: DungeonEvent[];
  id: string;
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

  getPossibleBosses(): string[] {
    let activeTier = this.bossTiers[0];
    for (const tier of this.bossTiers) {
      if (tier.requirements?.every((r) => r.isCompleted()) ?? true) {
        activeTier = tier;
      }
    }
    return activeTier.pilots;
  }

  resolveBoss(): Pilot {
    const pilots = this.getPossibleBosses();
    const pilotId = pilots[Math.floor(Math.random() * pilots.length)];
    return PILOTS[pilotId];
  }
}
