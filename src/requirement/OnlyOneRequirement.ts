import { t } from '../i18n';
import type { Requirement } from './Requirement';

export class OnlyOneRequirement implements Requirement {
  requirements: Requirement[];
  requiredValue = 1;

  constructor(requirements: Requirement[]) {
    this.requirements = requirements;
  }

  hint(): string {
    const hints = this.requirements.map((r) => r.hint()).join(t('requirements:at_least_one_joiner'));
    return t('requirements:only_one', { hints });
  }

  isCompleted(): boolean {
    return this.requirements.filter((r) => r.isCompleted()).length === 1;
  }

  progress(): number {
    return this.requirements.filter((r) => r.isCompleted()).length === 1 ? 1 : 0;
  }
}
