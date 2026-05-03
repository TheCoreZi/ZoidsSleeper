import { t } from '../i18n';
import { getZoidById } from '../models/Zoid';
import { ZoidResearchStatus } from '../models/ZoidResearchStatus';
import { getZoidResearch } from '../store/zoidResearchStore';
import type { Requirement } from './Requirement';

export class ZoidCreatedRequirement implements Requirement {
  requiredValue = 1;
  zoidId: string;

  constructor(zoidId: string) {
    this.zoidId = zoidId;
  }

  hint(): string {
    return t('requirements:zoid_created', { zoid: getZoidById(this.zoidId).name });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getZoidResearch(this.zoidId) === ZoidResearchStatus.Created ? 1 : 0;
  }
}
