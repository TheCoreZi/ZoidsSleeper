import type { Requirement } from './Requirement';

export class NotRequirement implements Requirement {
  requirement: Requirement;
  requiredValue = 1;

  constructor(requirement: Requirement) {
    this.requirement = requirement;
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
}
