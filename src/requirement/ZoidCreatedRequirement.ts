import { t } from '../i18n';
import { getZoidResearch } from '../store/zoidResearchStore';
import { ZoidResearchStatus } from '../models/ZoidResearchStatus';
import type { Requirement } from './Requirement';

export class ZoidCreatedRequirement implements Requirement {
  requiredValue = 1;
  zoidId: string;

  constructor(zoidId: string) {
    this.zoidId = zoidId;
  }

  hint(): string {
    return t('requirements:zoid_created', { zoid: t(`zoids:${this.zoidId}.name`) });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getZoidResearch(this.zoidId) === ZoidResearchStatus.Created ? 1 : 0;
  }
}
