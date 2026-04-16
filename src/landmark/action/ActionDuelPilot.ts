import { t } from '../../i18n';
import type { Pilot } from '../../models/Pilot';
import type { Requirement } from '../../requirement';
import type { CityAction } from './CityAction';

export class ActionDuelPilot implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  onExecute: (() => void) | null = null;
  pilot: Pilot;
  requirements?: Requirement[];

  constructor(pilot: Pilot, requirements?: Requirement[], completeRequirements?: Requirement[]) {
    this.completeRequirements = completeRequirements;
    this.id = `duel-${pilot.id}`;
    this.pilot = pilot;
    this.requirements = requirements;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t('ui:duel_pilot', { name: t(`pilots:${this.pilot.id}`) });
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
