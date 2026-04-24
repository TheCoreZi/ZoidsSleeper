import { t } from '../i18n';
import { isCampaignCompleted, isCampaignStarted } from '../store/campaignStore';
import type { Requirement } from './Requirement';

export class CampaignStartedRequirement implements Requirement {
  campaignId: string;
  requiredValue = 1;

  constructor(campaignId: string) {
    this.campaignId = campaignId;
  }

  hint(): string {
    return t('requirements:start_campaign', { name: t(`campaigns:${this.campaignId}.name`) });
  }

  isCompleted(): boolean {
    return isCampaignStarted(this.campaignId) || isCampaignCompleted(this.campaignId);
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
