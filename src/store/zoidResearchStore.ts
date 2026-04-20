import { createSignal } from 'solid-js';
import { ZoidResearchStatus } from '../models/ZoidResearchStatus';

const PRIORITY: Record<ZoidResearchStatus, number> = {
  [ZoidResearchStatus.Seen]: 0,
  [ZoidResearchStatus.Scanned]: 1,
  [ZoidResearchStatus.Created]: 2,
};

const [zoidResearch, setZoidResearch] = createSignal<Record<string, ZoidResearchStatus>>({});

function getZoidResearch(zoidId: string): ZoidResearchStatus | null {
  return zoidResearch()[zoidId] ?? null;
}

function loadZoidResearch(data: Record<string, ZoidResearchStatus>): void {
  setZoidResearch(data);
}

function updateZoidResearch(zoidId: string, status: ZoidResearchStatus): void {
  setZoidResearch((prev) => {
    const current = prev[zoidId];
    if (current && PRIORITY[current] >= PRIORITY[status]) {return prev;}
    return { ...prev, [zoidId]: status };
  });
}

export { getZoidResearch, loadZoidResearch, updateZoidResearch, zoidResearch };
