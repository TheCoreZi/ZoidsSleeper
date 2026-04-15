import { t } from '../../i18n';
import type { Cutscene } from '../../cutscene/Cutscene';
import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';
import type { CityAction } from './CityAction';

export class ActionPlayCutscene implements CityAction {
  completeRequirements?: Requirement[];
  cutscene: Cutscene;
  id: string;
  labelKey: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  reward?: Reward;

  constructor(cutscene: Cutscene, labelKey: string, requirements?: Requirement[], completeRequirements?: Requirement[], reward?: Reward) {
    this.completeRequirements = completeRequirements;
    this.cutscene = cutscene;
    this.id = `cutscene-${cutscene.id}`;
    this.labelKey = labelKey;
    this.requirements = requirements;
    this.reward = reward;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t(this.labelKey);
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
