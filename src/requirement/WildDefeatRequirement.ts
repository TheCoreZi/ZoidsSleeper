import { t } from '../i18n';
import { getZoidName } from '../models/Zoid';
import { getPilotDefeats } from '../store/statisticsStore';
import type { Requirement } from './Requirement';

export class WildDefeatRequirement implements Requirement {
  requiredValue: number;
  wildId: string;
  zoidId: string;

  constructor(wildId: string, zoidId: string, requiredDefeats = 1) {
    this.requiredValue = requiredDefeats;
    this.wildId = wildId;
    this.zoidId = zoidId;
  }

  hint(): string {
    return t('requirements:defeat_wild', { name: getZoidName(this.zoidId) });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getPilotDefeats(this.wildId);
  }
}
