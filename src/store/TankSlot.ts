import type { OwnedZoid } from '../models/Zoid';

export const TankSlotSource = {
  Core: 'core',
  Reborn: 'reborn',
} as const;

export type TankSlotSourceType = typeof TankSlotSource[keyof typeof TankSlotSource];

export interface NurturingSlot {
  coreId: string;
  fragments: number;
  fragmentsRequired: number;
  source: typeof TankSlotSource.Core;
  zoidSpeciesId: string;
}

export interface RebornSlot {
  fragments: number;
  fragmentsRequired: number;
  ownedZoid: OwnedZoid;
  source: typeof TankSlotSource.Reborn;
  zoidSpeciesId: string;
}

export type TankSlot = NurturingSlot | RebornSlot;
