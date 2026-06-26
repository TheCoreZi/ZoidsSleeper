import { VersionFeatureFlag } from './VersionFeatureFlag';

export const FEATURE_FLAGS = {
  RED_RIVER: new VersionFeatureFlag('0.7.0'),
} as const;
