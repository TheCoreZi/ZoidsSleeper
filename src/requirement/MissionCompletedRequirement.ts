import { t } from '../i18n';
import { isMissionCompleted } from '../store/campaignStore';
import type { Requirement } from './Requirement';

export class MissionCompletedRequirement implements Requirement {
  campaignId: string;
  missionId: string;
  requiredValue = 1;

  constructor(campaignId: string, missionId: string) {
    this.campaignId = campaignId;
    this.missionId = missionId;
  }

  hint(): string {
    return t('requirements:complete_mission', {
      campaign: t(`campaigns:${this.campaignId}.name`),
      mission: t(`campaigns:${this.campaignId}.missions.${this.missionId}.name`),
    });
  }

  isCompleted(): boolean {
    return isMissionCompleted(this.campaignId, this.missionId);
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
