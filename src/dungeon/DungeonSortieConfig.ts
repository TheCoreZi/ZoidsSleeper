import type { ZoidBlueprint } from '../models/Zoid';
import type { Requirement } from '../requirement';

export interface BossTier {
  pilots: string[];
  requirements?: Requirement[];
}

export interface DungeonEnemy {
  zoidData: ZoidBlueprint;
  requirement?: Requirement;
}
