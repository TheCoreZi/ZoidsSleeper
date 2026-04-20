import { createSignal } from 'solid-js';

export const ScanMode = { Off: 'off', Permanent: 'permanent', Single: 'single' } as const;
export type ScanMode = (typeof ScanMode)[keyof typeof ScanMode];

export interface ActiveScan {
  deviceId: string;
  mode: ScanMode;
}

const [activeScan, setActiveScan] = createSignal<ActiveScan | null>(null);
const [scanNewOnly, setScanNewOnly] = createSignal(false);

function getActiveDeviceId(): string | null {
  return activeScan()?.deviceId ?? null;
}

function getActiveScanMode(): ScanMode {
  return activeScan()?.mode ?? ScanMode.Off;
}

function loadScanSetup(data: ActiveScan): void {
  setActiveScan(data);
}

function resetScanAfterBattle(): void {
  const current = activeScan();
  if (!current) {return;}
  if (current.mode === ScanMode.Single) {
    setActiveScan(null);
  }
}

function toggleScanNewOnly(): void {
  setScanNewOnly((prev) => !prev);
}

function toggleScan(deviceId: string): void {
  const current = activeScan();
  if (!current || current.deviceId !== deviceId) {
    setActiveScan({ deviceId, mode: ScanMode.Single });
    return;
  }
  switch (current.mode) {
    case ScanMode.Single:
      setActiveScan({ deviceId, mode: ScanMode.Permanent });
      break;
    case ScanMode.Permanent:
      setActiveScan(null);
      break;
  }
}

export { activeScan, getActiveDeviceId, getActiveScanMode, loadScanSetup, resetScanAfterBattle, scanNewOnly, toggleScan, toggleScanNewOnly };
