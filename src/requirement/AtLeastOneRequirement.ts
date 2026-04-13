import { t } from '../i18n';
import type { Requirement } from './Requirement';

export class AtLeastOneRequirement implements Requirement {
  requirements: Requirement[];
  requiredValue = 1;

  constructor(requirements: Requirement[]) {
    this.requirements = requirements;
  }

  hint(): string {
    return this.requirements.map((r) => r.hint()).join(t('requirements:at_least_one_joiner'));
  }

  isCompleted(): boolean {
    return this.requirements.some((r) => r.isCompleted());
  }

  progress(): number {
    return this.requirements.some((r) => r.isCompleted()) ? 1 : 0;
  }
}
