import { t } from '../i18n';
import { getOwnedZoidLevel } from '../models/Zoid';
import { party } from '../store/partyStore';
import type { Requirement } from './Requirement';

export class ZoidAtLevelRequirement implements Requirement {
  requiredValue: number;

  constructor(requiredLevel: number) {
    this.requiredValue = requiredLevel;
  }

  hint(): string {
    return t('requirements:zoid_at_level', { level: this.requiredValue });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    const zoids = party().zoids;
    if (zoids.length === 0) {return 0;}
    return Math.max(...zoids.map((z) => getOwnedZoidLevel(z)));
  }
}
