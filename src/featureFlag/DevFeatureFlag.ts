import type { FeatureFlag } from './FeatureFlag';

export class DevFeatureFlag implements FeatureFlag {
  isEnabled(): boolean {
    return import.meta.env.DEV;
  }
}
