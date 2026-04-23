import { t } from '../i18n';
import type { Faction } from '../models/Faction';
import { playerStats } from '../store/gameStore';
import type { Requirement } from './Requirement';

export class FactionRequirement implements Requirement {
  faction: Faction;
  requiredValue = 1;

  constructor(faction: Faction) {
    this.faction = faction;
  }

  hint(): string {
    return t('requirements:join_faction', { name: t(`factions:${this.faction}`) });
  }

  isCompleted(): boolean {
    return playerStats()?.faction === this.faction;
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
