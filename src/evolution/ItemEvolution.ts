import { t } from '../i18n';
import type { EvolutionRule, OwnedZoidStats } from './EvolutionRule';

export class ItemEvolution implements EvolutionRule {
  itemId: string;
  targetId: string;

  constructor(targetId: string, itemId: string) {
    this.targetId = targetId;
    this.itemId = itemId;
  }

  hint(): string {
    return t('ui:evo_condition_item', { item: t(`items:${this.itemId}.name`) });
  }

  isFulfilled(_stats: OwnedZoidStats): boolean {
    return false;
  }

  isFulfilledWithItem(_stats: OwnedZoidStats, ownedItemId: string): boolean {
    return this.itemId === ownedItemId;
  }
}
