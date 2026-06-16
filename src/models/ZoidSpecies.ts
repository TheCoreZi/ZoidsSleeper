import type { Drop } from '../item/Drop';
import type { Evolution } from '../evolution';
import type { Faction } from './Faction';
import type { LevelType } from './LevelType';
import type { TerrainType } from './Terrain';

export const ZoidSize = {
  Transport: 'transport',
  Colossal: 'colossal',
  XL: 'xl',
  L: 'l',
  M: 'm',
  S: 's',
  XS: 'xs',
  XXS: 'xxs',
} as const;

export type ZoidSize = (typeof ZoidSize)[keyof typeof ZoidSize];

/** Static base template for a zoid species (attack, health, faction, price, etc.) */
export interface ZoidSpecies {
  attack: number;
  baseExp: number;
  coreFragments: number;
  faction: Faction;
  id: string;
  levelType: LevelType;
  maxHealth: number;
  name: string;
  price: number;
  scanRate: number;
  size: ZoidSize;
  terrainTypes: TerrainType[];
  evolutions?: Evolution[];
  height?: number;
  itemDrops?: Drop[];
  length?: number;
  speed?: number;
  type?: string;
  weight?: number;
  width?: number;
}
