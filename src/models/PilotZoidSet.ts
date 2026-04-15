import type { Requirement } from '../requirement';
import type { ZoidBlueprint } from './Zoid';

export class PilotZoidSet {
  requirements?: Requirement[];
  zoids: ZoidBlueprint[];

  constructor(zoids: ZoidBlueprint[], requirements?: Requirement[]) {
    this.requirements = requirements;
    this.zoids = zoids;
  }

  isActive(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
