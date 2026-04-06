import { t } from '../i18n';
import { isMissionNpcTalked } from '../store/campaignStore';
import type { Requirement } from './Requirement';

export class NpcTalkedInCampaignRequirement implements Requirement {
  campaignId: string;
  npcId: string;
  requiredValue = 1;

  constructor(campaignId: string, npcId: string) {
    this.campaignId = campaignId;
    this.npcId = npcId;
  }

  hint(): string {
    return t('requirements:talk_to_npc', { name: t(`pilots:${this.npcId}`) });
  }

  isCompleted(): boolean {
    return isMissionNpcTalked(this.campaignId, this.npcId);
  }

  progress(): number {
    return this.isCompleted() ? 1 : 0;
  }
}
