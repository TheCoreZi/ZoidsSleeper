import { t } from '../i18n';
import { isStatefulRequirement, type Requirement, type RequirementSaveData, type StatefulRequirement } from './Requirement';

export class AllOfRequirement implements StatefulRequirement {
  requirements: Requirement[];
  requiredValue: number;

  constructor(requirements: Requirement[]) {
    this.requirements = requirements;
    this.requiredValue = requirements.length;
  }

  fromSaveData(data: RequirementSaveData): void {
    this.requirements.forEach((r, i) => {
      if (!isStatefulRequirement(r)) {return;}
      const saved = data.requirements?.[i];
      if (saved) {r.fromSaveData(saved);}
    });
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

  toSaveData(): RequirementSaveData {
    return { requirements: this.requirements.map((r) => isStatefulRequirement(r) ? r.toSaveData() : {}) };
  }
}
