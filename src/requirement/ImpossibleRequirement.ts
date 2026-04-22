import type { Requirement } from './Requirement';

export class ImpossibleRequirement implements Requirement {
  requiredValue = 0;

  hint(): string {
    return '';
  }

  isCompleted(): boolean {
    return false;
  }

  progress(): number {
    return 0;
  }
}
