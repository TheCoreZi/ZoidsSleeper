import { t } from '../i18n';
import { isStatefulRequirement, type Requirement, type RequirementSaveData, type StatefulRequirement } from './Requirement';

export class OnlyOneRequirement implements StatefulRequirement {
  requirements: Requirement[];
  requiredValue = 1;

  constructor(requirements: Requirement[]) {
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
    const hints = this.requirements.map((r) => r.hint()).join(t('requirements:at_least_one_joiner'));
    return t('requirements:only_one', { hints });
  }

  isCompleted(): boolean {
    return this.requirements.filter((r) => r.isCompleted()).length === 1;
  }

  progress(): number {
    return this.requirements.filter((r) => r.isCompleted()).length === 1 ? 1 : 0;
  }

  toSaveData(): RequirementSaveData {
    return { requirements: this.requirements.map((r) => isStatefulRequirement(r) ? r.toSaveData() : {}) };
  }
}
