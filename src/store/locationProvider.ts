let _getCurrentLandmarkId: (() => string) | undefined;

export function registerLocationProvider(provider: () => string): void {
  _getCurrentLandmarkId = provider;
}

export function getCurrentLandmarkId(): string {
  return _getCurrentLandmarkId?.() ?? '';
}
