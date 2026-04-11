import { For, Show, type Component } from 'solid-js';
import { CAMPAIGNS } from '../campaign/campaigns';
import type { Campaign } from '../campaign/Campaign';
import { t } from '../i18n';
import { getCampaignState, isCampaignCompleted, isCampaignStarted, startCampaign } from '../store/campaignStore';

function isUnlocked(campaign: Campaign): boolean {
  return campaign.unlockRequirements?.every((r) => r.isCompleted()) ?? true;
}

interface MissionInfo {
  description: string;
  name: string;
}

function currentMissionInfo(campaign: Campaign): MissionInfo | undefined {
  const missionId = getCampaignState(campaign.id).currentMission;
  if (!missionId) { return undefined; }
  return {
    description: t(`campaigns:${campaign.id}.missions.${missionId}.description`),
    name: t(`campaigns:${campaign.id}.missions.${missionId}.name`),
  };
}

const CampaignEntry: Component<{ campaign: Campaign }> = (props) => {
  const mission = () => currentMissionInfo(props.campaign);
  return (
    <div class="campaign-entry campaign-active">
      <div class="campaign-header">
        <span class="campaign-name">{t(`campaigns:${props.campaign.id}.name`)}</span>
      </div>
      <Show when={mission()}>
        {(m) => <>
          <div class="campaign-mission-name">{m().name}</div>
          <div class="campaign-mission-hint">{m().description}</div>
        </>}
      </Show>
    </div>
  );
};

const CampaignPanel: Component = () => {
  const all = () => Object.values(CAMPAIGNS);
  const activeCampaigns = () => all().filter((c) => isCampaignStarted(c.id));
  const availableCampaigns = () => all().filter((c) =>
    !c.autoStart && !isCampaignStarted(c.id) && !isCampaignCompleted(c.id) && isUnlocked(c)
  );
  const completedCampaigns = () => all().filter((c) => isCampaignCompleted(c.id));

  return (
    <div class="campaign-panel">
      <h3 class="campaign-title">{t('ui:operations')}</h3>
      <div class="campaign-list">
        <For each={activeCampaigns()}>
          {(campaign) => <CampaignEntry campaign={campaign} />}
        </For>
        <For each={availableCampaigns()}>
          {(campaign) => (
            <div class="campaign-entry campaign-available">
              <div class="campaign-header">
                <span class="campaign-name">{t(`campaigns:${campaign.id}.name`)}</span>
              </div>
              <div class="campaign-description">{t(`campaigns:${campaign.id}.description`)}</div>
              <button class="campaign-deploy-btn" onClick={() => startCampaign(campaign.id)}>
                {t('ui:deploy')}
              </button>
            </div>
          )}
        </For>
        <For each={completedCampaigns()}>
          {(campaign) => (
            <div class="campaign-entry campaign-completed">
              <div class="campaign-header">
                <span class="campaign-name">{t(`campaigns:${campaign.id}.name`)}</span>
                <span class="campaign-status-check">{t('ui:campaign_completed')}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default CampaignPanel;
