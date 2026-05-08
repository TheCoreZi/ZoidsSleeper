import { t } from '../../i18n';
import type { Pilot } from '../../models/Pilot';
import type { ZoidBlueprint } from '../../models/Zoid';
import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';
import type { CityAction } from './CityAction';

export class ActionDuelPilot implements CityAction {
  completeRequirements?: Requirement[];
  forcedZoid?: ZoidBlueprint;
  id: string;
  onExecute: (() => void) | null = null;
  pilot: Pilot;
  requirements?: Requirement[];
  reward?: Reward;
  unwinnable: boolean;

  constructor(pilot: Pilot, requirements?: Requirement[], completeRequirements?: Requirement[], unwinnable = false, reward?: Reward, forcedZoid?: ZoidBlueprint) {
    this.completeRequirements = completeRequirements;
    this.forcedZoid = forcedZoid;
    this.id = `duel-${pilot.id}`;
    this.pilot = pilot;
    this.requirements = requirements;
    this.reward = reward;
    this.unwinnable = unwinnable;
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
