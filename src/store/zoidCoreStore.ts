import { createSignal } from 'solid-js';
import type { CoreType } from '../item/ZoidCore';

const [zoidCores, setZoidCores] = createSignal<Record<string, number>>({});

function addCore(coreId: string): void {
  setZoidCores((prev) => ({ ...prev, [coreId]: (prev[coreId] ?? 0) + 1 }));
}

function addTypedCore(coreType: CoreType): void {
  addCore(coreType);
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
