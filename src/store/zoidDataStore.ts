import { createSignal } from 'solid-js';

const [zoidDataLog, setZoidDataLog] = createSignal<Record<string, number>>({});

function getZoidDataCount(zoidId: string): number {
  return zoidDataLog()[zoidId] ?? 0;
}

function incrementZoidData(zoidId: string): void {
  setZoidDataLog((prev) => ({ ...prev, [zoidId]: (prev[zoidId] ?? 0) + 1 }));
}

function loadZoidData(data: Record<string, number>): void {
  setZoidDataLog(data);
}

export { getZoidDataCount, incrementZoidData, loadZoidData, zoidDataLog };
