import { t } from '../../i18n';
import type { Requirement } from '../../requirement';
import type { CityAction } from './CityAction';

export class ActionVisitLab implements CityAction {
  id = 'lab';
  labId: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];

  constructor(labId: string, requirements?: Requirement[]) {
    this.labId = labId;
    this.requirements = requirements;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t('ui:visit_lab', { name: t(`locations:${this.labId}`) });
  }

  isCompleted(): boolean {
    return false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
