import { t } from '../i18n';
import { isCoreNurtured } from '../store/nurturingStore';
import type { Requirement } from './Requirement';

export class CoreNurturedRequirement implements Requirement {
  requiredValue = 1;
  zoidSpeciesId: string;

  constructor(zoidSpeciesId: string) {
    this.zoidSpeciesId = zoidSpeciesId;
  }

  hint(): string {
    return t('requirements:core_nurtured', {
      name: t(`items:${this.zoidSpeciesId}.name`),
    });
  }

  isCompleted(): boolean {
    return isCoreNurtured(this.zoidSpeciesId);
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
