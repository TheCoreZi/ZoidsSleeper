import { t } from '../i18n';
import { getDungeonCompletions } from '../store/statisticsStore';
import type { Requirement } from './Requirement';

export class DungeonCompletionRequirement implements Requirement {
  dungeonId: string;
  requiredValue: number;

  constructor(dungeonId: string, requiredCompletions: number) {
    this.dungeonId = dungeonId;
    this.requiredValue = requiredCompletions;
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
    return getDungeonCompletions(this.dungeonId);
  }
}
