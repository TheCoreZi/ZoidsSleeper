import { t } from '../../i18n';
import type { ConsumableItem } from '../../item';
import type { Requirement } from '../../requirement';
import type { CityAction } from './CityAction';

export class ActionVisitDepot implements CityAction {
  id = 'depot';
  items: ConsumableItem[];
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];

  constructor(items: ConsumableItem[], requirements?: Requirement[]) {
    this.items = items;
    this.requirements = requirements;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t('ui:visit_depot');
  }

  isCompleted(): boolean {
    return false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
