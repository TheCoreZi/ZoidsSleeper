import { t } from '../i18n';
import type { TerrainType } from '../models/Terrain';
import { getZoidById } from '../models/Zoid';
import { party } from '../store/partyStore';
import type { Requirement } from './Requirement';

export class OwnZoidForTerrainRequirement implements Requirement {
  requiredValue = 1;
  terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    this.terrainType = terrainType;
  }

  hint(): string {
    return t('requirements:terrain_zoid_required', { terrain: t(`ui:terrain_${this.terrainType}`) });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return party().zoids.some((z) => getZoidById(z.id).terrainTypes.includes(this.terrainType)) ? 1 : 0;
  }
}
