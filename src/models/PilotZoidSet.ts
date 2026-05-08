import type { Organoid } from './Organoid';
import type { Requirement } from '../requirement';
import type { ZoidBlueprint } from './Zoid';

export class PilotZoidSet {
  organoid?: Organoid;
  requirements?: Requirement[];
  zoids: ZoidBlueprint[];

  constructor(zoids: ZoidBlueprint[], requirements?: Requirement[], organoid?: Organoid) {
    this.organoid = organoid;
    this.requirements = requirements;
    this.zoids = zoids;
  }

  isActive(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
