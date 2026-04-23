import { createEffect, For, on, Show, type Component } from 'solid-js';
import { CAMPAIGNS } from '../campaign/campaigns';
import type { Campaign } from '../campaign/Campaign';
import { t } from '../i18n';
import { getCampaignState, isCampaignCompleted, isCampaignStarted, startCampaign } from '../store/campaignStore';
import './campaign.css';

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
  let missionRef: HTMLDivElement | undefined;

  createEffect(on(
    () => getCampaignState(props.campaign.id).currentMission,
    (current, prev) => {
      if (prev && prev !== current && missionRef) {
        missionRef.classList.remove('campaign-mission-transition');
        void missionRef.offsetWidth;
        missionRef.classList.add('campaign-mission-transition');
      }
    }
  ));

  return (
    <div class="campaign-entry campaign-active">
      <div class="campaign-header">
        <span class="campaign-name">{t(`campaigns:${props.campaign.id}.name`)}</span>
      </div>
      <Show when={mission()}>
        {(m) => <div ref={missionRef} class="campaign-mission-content">
          <div class="campaign-mission-name">{m().name}</div>
          <div class="campaign-mission-hint">{m().description}</div>
        </div>}
      </Show>
    </div>
  );
};

const CampaignPanel: Component = () => {
  const all = () => Object.values(CAMPAIGNS);
  const activeCampaigns = () => all().filter((c) => isCampaignStarted(c.id));
  const availableCampaigns = () => all().filter((c) =>
    !c.autoStart && !c.hidden && !isCampaignStarted(c.id) && !isCampaignCompleted(c.id) && isUnlocked(c)
  );
  const isEmpty = () => activeCampaigns().length === 0 && availableCampaigns().length === 0;

  return (
    <div class="campaign-panel">
      <h3 class="campaign-title">{t('ui:operations')}</h3>
      <div class="campaign-list">
        <Show when={!isEmpty()} fallback={
          <div class="campaign-empty">{t('ui:no_missions')}</div>
        }>
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
        </Show>
      </div>
    </div>
  );
};

export default CampaignPanel;
