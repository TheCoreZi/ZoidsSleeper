import { t } from '../i18n';
import { getDungeonCompletions } from '../store/statisticsStore';
import type { RequirementSaveData, StatefulRequirement } from './Requirement';

export interface DungeonRequirementSaveData extends RequirementSaveData {
  baselineClears: number;
}

export class DungeonCompletionRequirement implements StatefulRequirement {
  baseline: number;
  dungeonId: string;
  requiredValue: number;

  constructor(dungeonId: string, requiredCompletions: number, baseline = 0) {
    this.baseline = baseline;
    this.dungeonId = dungeonId;
    this.requiredValue = requiredCompletions;
  }

  fromSaveData(data: RequirementSaveData): void {
    this.baseline = (data as DungeonRequirementSaveData).baselineClears ?? 0;
  }

  hint(): string {
    const landmarkId = this.dungeonId.replace(/_sortie$/, '');
    return t('requirements:complete_dungeon', {
      count: this.requiredValue,
      dungeon: t(`locations:${landmarkId}`),
    });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return Math.max(0, getDungeonCompletions(this.dungeonId) - this.baseline);
  }

  toSaveData(): DungeonRequirementSaveData {
    this.baseline = getDungeonCompletions(this.dungeonId);
    return { baselineClears: this.baseline };
  }
}
