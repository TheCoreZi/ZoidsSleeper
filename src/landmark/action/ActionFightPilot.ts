import { t } from '../../i18n';
import type { Requirement } from '../../requirement';
import type { Pilot } from '../../models/Pilot';
import type { CityAction } from './CityAction';

export class ActionFightPilot implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  onExecute: (() => void) | null = null;
  pilot: Pilot;
  requirements?: Requirement[];

  constructor(pilot: Pilot, requirements?: Requirement[], completeRequirements?: Requirement[]) {
    this.completeRequirements = completeRequirements;
    this.id = `fight-${pilot.id}`;
    this.pilot = pilot;
    this.requirements = requirements;
  }

  getLabel(): string {
    return t('ui:fight_pilot', { name: t(`pilots:${this.pilot.id}`) });
  }

  execute(): void {
    this.onExecute?.();
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
