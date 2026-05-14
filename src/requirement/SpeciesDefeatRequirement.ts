import { t } from '../i18n';
import { getZoidById } from '../models/Zoid';
import { getSpeciesDefeats } from '../store/statisticsStore';
import type { Requirement } from './Requirement';

export class SpeciesDefeatRequirement implements Requirement {
  requiredValue: number;
  speciesId: string;

  constructor(speciesId: string, requiredDefeats: number) {
    this.requiredValue = requiredDefeats;
    this.speciesId = speciesId;
  }

  hint(): string {
    return t('requirements:defeat_species', {
      count: this.requiredValue,
      zoid: getZoidById(this.speciesId).name,
    });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getSpeciesDefeats(this.speciesId);
  }
}
