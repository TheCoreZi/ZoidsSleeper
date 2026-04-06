import { t } from '../i18n';
import { isCampaignCompleted } from '../store/campaignStore';
import type { Requirement } from './Requirement';

export class CampaignCompletedRequirement implements Requirement {
  campaignId: string;
  requiredValue = 1;

  constructor(campaignId: string) {
    this.campaignId = campaignId;
  }

  hint(): string {
    return t('requirements:complete_campaign', { name: t(`campaigns:${this.campaignId}.name`) });
  }

  isCompleted(): boolean {
    return isCampaignCompleted(this.campaignId);
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
