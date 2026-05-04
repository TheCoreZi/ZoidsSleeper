import type { Requirement } from '../requirement/Requirement';

export const CoreProgress = { Dormant: 'dormant', Growing: 'growing', Ready: 'ready' } as const;
export type CoreProgress = (typeof CoreProgress)[keyof typeof CoreProgress];

export const CoreType = { MiniCore: 'mini_core' } as const;
export type CoreType = (typeof CoreType)[keyof typeof CoreType];

export interface CorePoolEntry {
  requirement?: Requirement;
  zoidSpeciesId: string;
}

export interface CoreTypeData {
  nameKey: string;
  pool: CorePoolEntry[];
}

export interface ZoidCoreState {
  fragments: number;
  fragmentsRequired: number;
  id: string;
  zoidSpeciesId: string;
}

export const CORE_EMERGE_POOLS: Record<CoreType, CoreTypeData> = {
  [CoreType.MiniCore]: {
    nameKey: 'items:core_mini_core.name',
    pool: [
      { zoidSpeciesId: 'dragon_horse' },
    ],
  },
};

export function getCoreProgress(core: ZoidCoreState): CoreProgress {
  if (core.fragments >= core.fragmentsRequired) {
    return CoreProgress.Ready;
  }
  if (core.fragments > 0) {
    return CoreProgress.Growing;
  }
  return CoreProgress.Dormant;
}

export function resolveTypedCore(coreType: CoreType, rng: () => number = Math.random): string | null {
  const { pool } = CORE_EMERGE_POOLS[coreType];
  const eligible = pool.filter((entry) => !entry.requirement || entry.requirement.isCompleted());
  if (eligible.length === 0) {
    return null;
  }
  return eligible[Math.floor(rng() * eligible.length)].zoidSpeciesId;
}
