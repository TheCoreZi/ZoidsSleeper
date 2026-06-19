import { t } from '../i18n';
import { isStatefulRequirement, type Requirement, type RequirementSaveData, type StatefulRequirement } from './Requirement';

export class AtLeastOneRequirement implements StatefulRequirement {
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
    return this.requirements.map((r) => r.hint()).join(t('requirements:at_least_one_joiner'));
  }

  isCompleted(): boolean {
    return this.requirements.some((r) => r.isCompleted());
  }

  progress(): number {
    return this.requirements.some((r) => r.isCompleted()) ? 1 : 0;
  }

  toSaveData(): RequirementSaveData {
    return { requirements: this.requirements.map((r) => isStatefulRequirement(r) ? r.toSaveData() : {}) };
  }
}
