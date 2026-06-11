import type { FeatureFlag } from './FeatureFlag';

export class VersionFeatureFlag implements FeatureFlag {
  minVersion: string;

  constructor(minVersion: string) {
    this.minVersion = minVersion;
  }

  isEnabled(): boolean {
    return import.meta.env.DEV || __APP_VERSION__.localeCompare(this.minVersion, undefined, { numeric: true }) >= 0;
  }
}
