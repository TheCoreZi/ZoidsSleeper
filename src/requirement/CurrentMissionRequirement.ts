import { t } from '../i18n';
import { getCampaignState } from '../store/campaignStore';
import type { Requirement } from './Requirement';

export class CurrentMissionRequirement implements Requirement {
  campaignId: string;
  missionId: string;
  requiredValue = 1;

  constructor(campaignId: string, missionId: string) {
    this.campaignId = campaignId;
    this.missionId = missionId;
  }

  hint(): string {
    return t('requirements:current_mission', {
      campaign: t(`campaigns:${this.campaignId}.name`),
      mission: t(`campaigns:${this.campaignId}.missions.${this.missionId}.name`),
    });
  }

  isCompleted(): boolean {
    return getCampaignState(this.campaignId).currentMission === this.missionId;
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
