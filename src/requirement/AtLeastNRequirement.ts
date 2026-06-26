import { t } from '../i18n';
import { isStatefulRequirement, type Requirement, type RequirementSaveData, type StatefulRequirement } from './Requirement';

export class AtLeastNRequirement implements StatefulRequirement {
  requiredValue: number;
  requirements: Requirement[];

  constructor(requirements: Requirement[], requiredValue: number) {
    this.requiredValue = requiredValue;
    this.requirements = requirements;
  }

  fromSaveData(data: RequirementSaveData): void {
    this.requirements.forEach((r, i) => {
      if (!isStatefulRequirement(r)) {return;}
      const saved = data.requirements?.[i];
      if (saved) {r.fromSaveData(saved);}
    });
  }

  hint(): string {
    const hints = this.requirements.map((r) => r.hint()).join(t('requirements:at_least_n_joiner'));
    return t('requirements:at_least_n', { count: this.requiredValue, hints });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return this.requirements.filter((r) => r.isCompleted()).length;
  }

  toSaveData(): RequirementSaveData {
    return { requirements: this.requirements.map((r) => isStatefulRequirement(r) ? r.toSaveData() : {}) };
  }
}
