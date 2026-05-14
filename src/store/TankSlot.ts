import type { OwnedZoid } from '../models/Zoid';

export const TankSlotSource = {
  Core: 'core',
  Reborn: 'reborn',
  Statue: 'statue',
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

export interface StatueSlot {
  fragments: number;
  fragmentsRequired: number;
  source: typeof TankSlotSource.Statue;
  zoidSpeciesId: string;
}

export const STATUE_SLOT: StatueSlot = {
  fragments: 0,
  fragmentsRequired: 500,
  source: TankSlotSource.Statue,
  zoidSpeciesId: 'ancient_statue',
};

export type TankSlot = NurturingSlot | RebornSlot | StatueSlot;
