import { isStatefulRequirement, type Requirement, type RequirementSaveData, type StatefulRequirement } from './Requirement';

export class NotRequirement implements StatefulRequirement {
  requirement: Requirement;
  requiredValue = 1;

  constructor(requirement: Requirement) {
    this.requirement = requirement;
  }

  fromSaveData(data: RequirementSaveData): void {
    const child = data.requirements?.[0];
    if (child && isStatefulRequirement(this.requirement)) {this.requirement.fromSaveData(child);}
  }

  hint(): string {
    return this.requirement.hint();
  }

  isCompleted(): boolean {
    return !this.requirement.isCompleted();
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }

  toSaveData(): RequirementSaveData {
    return { requirements: [isStatefulRequirement(this.requirement) ? this.requirement.toSaveData() : {}] };
  }
}
