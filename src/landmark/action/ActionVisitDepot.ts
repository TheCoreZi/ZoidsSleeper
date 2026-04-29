import { t } from '../../i18n';
import type { ConsumableItem } from '../../item';
import type { Requirement } from '../../requirement';
import type { CityAction } from './CityAction';

export class ActionVisitDepot implements CityAction {
  id = 'depot';
  items: ConsumableItem[];
  labelKey: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];

  constructor(items: ConsumableItem[], requirements?: Requirement[], labelKey = 'ui:visit_depot') {
    this.items = items;
    this.labelKey = labelKey;
    this.requirements = requirements;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t(this.labelKey);
  }

  isCompleted(): boolean {
    return false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
