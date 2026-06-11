import type { FeatureFlag } from '../featureFlag';
import type { Requirement } from './Requirement';

export class FeatureFlagRequirement implements Requirement {
  featureFlag: FeatureFlag;
  requiredValue = 0;

  constructor(featureFlag: FeatureFlag) {
    this.featureFlag = featureFlag;
  }

  hint(): string {
    return '';
  }

  isCompleted(): boolean {
    return this.featureFlag.isEnabled();
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
