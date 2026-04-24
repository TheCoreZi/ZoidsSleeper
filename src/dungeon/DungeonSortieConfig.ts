import type { Drop } from '../item/Drop';
import type { Pilot } from '../models/Pilot';
import { getPilotImage, PILOTS } from '../models/Pilot';
import { getZoidById, getZoidImage, type ZoidBlueprint } from '../models/Zoid';
import type { Requirement } from '../requirement';

export interface BossPreview {
  id: string;
  imageUrl: string;
  isZoid: boolean;
  label: string;
}

export interface DungeonEnemy {
  itemDrops?: Drop[];
  requirement?: Requirement;
  zoidData: ZoidBlueprint;
}

export abstract class DungeonBoss {}

export class PilotDungeonBoss extends DungeonBoss {
  pilot: Pilot;

  constructor(pilot: Pilot) {
    super();
    this.pilot = pilot;
  }
}

export class WildDungeonBoss extends DungeonBoss {
  zoidData: ZoidBlueprint;

  constructor(zoidData: ZoidBlueprint) {
    super();
    this.zoidData = zoidData;
  }
}

export abstract class BossEntry {
  abstract getPreview(): BossPreview;
  abstract resolve(): DungeonBoss;
}

export class PilotBossEntry extends BossEntry {
  pilotId: string;

  constructor(pilotId: string) {
    super();
    this.pilotId = pilotId;
  }

  getPreview(): BossPreview {
    return {
      id: this.pilotId,
      imageUrl: getPilotImage(this.pilotId),
      isZoid: false,
      label: PILOTS[this.pilotId]?.name ?? this.pilotId,
    };
  }

  resolve(): PilotDungeonBoss {
    return new PilotDungeonBoss(PILOTS[this.pilotId]);
  }
}

export class WildBossEntry extends BossEntry {
  zoidData: ZoidBlueprint;

  constructor(zoidData: ZoidBlueprint) {
    super();
    this.zoidData = zoidData;
  }

  getPreview(): BossPreview {
    return {
      id: this.zoidData.id,
      imageUrl: getZoidImage(this.zoidData.id, this.zoidData.imageOverride),
      isZoid: true,
      label: getZoidById(this.zoidData.id).name,
    };
  }

  resolve(): WildDungeonBoss {
    return new WildDungeonBoss(this.zoidData);
  }
}

export class BossTier {
  entries: BossEntry[];
  requirements?: Requirement[];

  constructor(entries: BossEntry[], requirements?: Requirement[]) {
    this.entries = entries;
    this.requirements = requirements;
  }

  getPreviews(): BossPreview[] {
    return this.entries.map((e) => e.getPreview());
  }

  resolve(): DungeonBoss {
    const entry = this.entries[Math.floor(Math.random() * this.entries.length)];
    return entry.resolve();
  }
}
