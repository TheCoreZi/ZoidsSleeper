import type { Drop } from '../item/Drop';
import type { ZoidBlueprint } from '../models/Zoid';
import type { Requirement } from '../requirement';

export interface BossTier {
  pilots: string[];
  requirements?: Requirement[];
}

export interface DungeonEnemy {
  itemDrops?: Drop[];
  requirement?: Requirement;
  zoidData: ZoidBlueprint;
}
