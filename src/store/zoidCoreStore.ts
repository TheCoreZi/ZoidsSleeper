import { createSignal } from 'solid-js';
import { t } from '../i18n';
import { CoreType } from '../item/ZoidCore';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { getZoidImage } from '../models/Zoid';
import { showPopup } from './gameStore';

const CORE_TYPE_VALUES = new Set<string>(Object.values(CoreType));
const [zoidCores, setZoidCores] = createSignal<Record<string, number>>({});

function addCore(coreId: string, amount = 1): void {
  const isTyped = CORE_TYPE_VALUES.has(coreId);
  const image = isTyped ? `images/cores/${coreId}.png` : getZoidImage(coreId);
  const name = isTyped ? t(`items:core_${coreId}.name`) : t(`zoids:${coreId}`);
  showPopup(new PopupMessage(name, t('ui:new_core'), PopupType.Item, image));
  setZoidCores((prev) => ({ ...prev, [coreId]: (prev[coreId] ?? 0) + amount }));
}

function addTypedCore(coreType: CoreType, amount = 1): void {
  addCore(coreType, amount);
}

function getCoreCount(coreId: string): number {
  return zoidCores()[coreId] ?? 0;
}

function loadZoidCores(data: Record<string, number>): void {
  setZoidCores(data);
}

function removeCore(coreId: string): void {
  setZoidCores((prev) => {
    const current = prev[coreId] ?? 0;
    if (current <= 0) {
      return prev;
    }
    const next = current - 1;
    if (next === 0) {
      const rest = { ...prev };
      delete rest[coreId];
      return rest;
    }
    return { ...prev, [coreId]: next };
  });
}

export { addCore, addTypedCore, getCoreCount, loadZoidCores, removeCore, zoidCores };
