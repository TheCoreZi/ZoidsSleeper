import { t } from '../i18n';
import { ITEMS, SyncDeviceItem } from '../item';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { getZoidById, getZoidImage, ZoidResearchStatus } from '../models/Zoid';
import { showPopup } from '../store/gameStore';
import { getItemCount, inventory, removeItem } from '../store/inventoryStore';
import { party } from '../store/partyStore';
import { ScanMode } from '../store/scanStore';
import { getZoidDataCount, incrementZoidData } from '../store/zoidDataStore';
import { updateZoidResearch } from '../store/zoidResearchStore';

export function attemptScan(zoidId: string, probeId: string): boolean {
  const zoid = getZoidById(zoidId);
  if (!canScan(probeId) || zoid.scanRate < 0) {return false;}

  removeItem(probeId, 1);
  const rate = calculateScanRate(zoidId, probeId);

  if (Math.random() * 100 < rate) {
    const isNew = getZoidDataCount(zoidId) === 0;
    const inParty = party().zoids.some((z) => z.id === zoidId);
    incrementZoidData(zoidId);
    updateZoidResearch(zoidId, ZoidResearchStatus.Scanned);
    if (isNew && !inParty) {
      const zoidData = getZoidById(zoidId);
      showPopup(new PopupMessage(zoidData.name, t('ui:new_zdata'), PopupType.Item, getZoidImage(zoidId)));
    }
    return true;
  }
  return false;
}

export function calculateScanRate(zoidId: string, probeId: string): number {
  const zoid = getZoidById(zoidId);
  if (zoid.scanRate < 0) {return 0;}
  const probe = ITEMS[probeId];
  const bonus = probe instanceof SyncDeviceItem ? probe.successBonus : 0;
  return Math.min(100, Math.max(0, zoid.scanRate + bonus));
}

export function canScan(probeId: string): boolean {
  return getItemCount(probeId) > 0;
}

export function getActiveScanRate(mode: ScanMode, deviceId: string | null, enemyId: string | null): number {
  if (mode === ScanMode.Off || !deviceId || !canScan(deviceId) || !enemyId) {return 0;}
  return calculateScanRate(enemyId, deviceId);
}

export function getAvailableProbe(): string | null {
  const owned = inventory();
  return Object.keys(owned)
    .find((id) => owned[id] > 0 && ITEMS[id] instanceof SyncDeviceItem)
    ?? null;
}
