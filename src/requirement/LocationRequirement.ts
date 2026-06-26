import { t } from '../i18n';
import { getCurrentLandmarkId } from '../store/locationProvider';
import type { Requirement } from './Requirement';

export class LocationRequirement implements Requirement {
  landmarkId: string;
  requiredValue = 1;

  constructor(landmarkId: string) {
    this.landmarkId = landmarkId;
  }

  hint(): string {
    return t('requirements:go_to_location', { name: t(`locations:${this.landmarkId}`) });
  }

  isCompleted(): boolean {
    return getCurrentLandmarkId() === this.landmarkId;
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
