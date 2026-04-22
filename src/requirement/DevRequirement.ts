import type { Requirement } from './Requirement';

export class DevRequirement implements Requirement {
  requiredValue = 0;

  hint(): string {
    return '';
  }

  isCompleted(): boolean {
    return import.meta.env.DEV;
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
