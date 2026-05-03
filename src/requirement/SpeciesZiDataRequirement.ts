import { t } from '../i18n';
import { getZoidById } from '../models/Zoid';
import { getZoidDataCount } from '../store/zoidDataStore';
import type { Requirement } from './Requirement';

export class SpeciesZiDataRequirement implements Requirement {
  requiredValue: number;
  zoidId: string;

  constructor(zoidId: string, requiredValue: number) {
    this.requiredValue = requiredValue;
    this.zoidId = zoidId;
  }

  hint(): string {
    return t('requirements:zi_data_species_required', {
      count: this.requiredValue,
      zoid: getZoidById(this.zoidId).name,
    });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getZoidDataCount(this.zoidId);
  }
}
