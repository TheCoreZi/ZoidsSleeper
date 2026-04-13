import { t } from '../i18n';
import type { Requirement } from './Requirement';

export class AllOfRequirement implements Requirement {
  requirements: Requirement[];
  requiredValue: number;

  constructor(requirements: Requirement[]) {
    this.requirements = requirements;
    this.requiredValue = requirements.length;
  }

  hint(): string {
    return this.requirements.map((r) => r.hint()).join(t('requirements:all_of_joiner'));
  }

  isCompleted(): boolean {
    return this.requirements.every((r) => r.isCompleted());
  }

  progress(): number {
    return this.requirements.filter((r) => r.isCompleted()).length;
  }
}
