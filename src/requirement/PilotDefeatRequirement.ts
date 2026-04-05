import { getPilotDefeats } from '../store/statisticsStore';
import type { Requirement } from './Requirement';

export class PilotDefeatRequirement implements Requirement {
  pilotId: string;
  pilotName: string;
  requiredValue: number;

  constructor(pilotId: string, pilotName: string, requiredDefeats = 1) {
    this.pilotId = pilotId;
    this.pilotName = pilotName;
    this.requiredValue = requiredDefeats;
  }

  hint(): string {
    return `Defeat ${this.pilotName}`;
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getPilotDefeats(this.pilotId);
  }
}
