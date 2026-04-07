import { createSignal } from 'solid-js';

const [zoidDataLog, setZoidDataLog] = createSignal<Record<string, number>>({});

function getTotalZoidDataCount(): number {
  return Object.values(zoidDataLog()).reduce((sum, count) => sum + count, 0);
}

function getZoidDataCount(zoidId: string): number {
  return zoidDataLog()[zoidId] ?? 0;
}

function decrementZoidData(zoidId: string): void {
  setZoidDataLog((prev) => {
    const current = prev[zoidId] ?? 0;
    if (current <= 0) {return prev;}
    if (current <= 1) {
      const next = { ...prev };
      delete next[zoidId];
      return next;
    }
    return { ...prev, [zoidId]: current - 1 };
  });
}

function incrementZoidData(zoidId: string): void {
  setZoidDataLog((prev) => ({ ...prev, [zoidId]: (prev[zoidId] ?? 0) + 1 }));
}

function loadZoidData(data: Record<string, number>): void {
  setZoidDataLog(data);
}

export { decrementZoidData, getTotalZoidDataCount, getZoidDataCount, incrementZoidData, loadZoidData, zoidDataLog };
