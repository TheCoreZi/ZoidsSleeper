import { createSignal } from 'solid-js';
import { CampaignStatus, type Campaign, type CampaignSaveData } from '../campaign/Campaign';
import { NpcTalkedInCampaignRequirement } from '../requirement/NpcTalkedInCampaignRequirement';

let campaigns: Record<string, Campaign> = {};

const [campaignStates, setCampaignStates] = createSignal<Record<string, CampaignSaveData>>({});

function advanceMission(campaignId: string): void {
  setCampaignStates((prev) => {
    const state = prev[campaignId];
    if (!state || state.status !== CampaignStatus.Started) {return prev;}

    const campaign = campaigns[campaignId];
    if (!campaign) {return prev;}

    const currentIndex = getMissionIndex(campaign, state.currentMission);
    if (currentIndex < 0) {return prev;}

    campaign.missions[currentIndex]?.onComplete?.();

    const nextIndex = currentIndex + 1;
    const completed = nextIndex >= campaign.missions.length;
    const nextMissionId = campaign.missions[nextIndex]?.id ?? '';

    const newState: CampaignSaveData = completed
      ? { currentMission: '', status: CampaignStatus.Completed }
      : { currentMission: nextMissionId, missionNpcFlags: buildNpcFlags(campaign, nextIndex), status: CampaignStatus.Started };

    return { ...prev, [campaignId]: newState };
  });
}

function buildNpcFlags(campaign: Campaign, missionIndex: number): Record<string, boolean> {
  const mission = campaign.missions[missionIndex];
  if (!mission) {return {};}
  const flags: Record<string, boolean> = {};
  for (const req of mission.goals) {
    if (req instanceof NpcTalkedInCampaignRequirement) {
      flags[`${campaign.id}:${req.npcId}`] = false;
    }
  }
  return flags;
}

function getCampaignState(id: string): CampaignSaveData {
  return campaignStates()[id] ?? { currentMission: '', status: CampaignStatus.Inactive };
}

function getMissionIndex(campaign: Campaign, missionId: string): number {
  return campaign.missions.findIndex((m) => m.id === missionId);
}

function isCampaignCompleted(id: string): boolean {
  return getCampaignState(id).status === CampaignStatus.Completed;
}

function isCampaignStarted(id: string): boolean {
  return getCampaignState(id).status === CampaignStatus.Started;
}

function isMissionCompleted(campaignId: string, missionId: string): boolean {
  const state = getCampaignState(campaignId);
  if (state.status === CampaignStatus.Completed) {return true;}
  if (state.status !== CampaignStatus.Started) {return false;}

  const campaign = campaigns[campaignId];
  if (!campaign) {return false;}

  const targetIndex = getMissionIndex(campaign, missionId);
  const currentIndex = getMissionIndex(campaign, state.currentMission);
  return targetIndex >= 0 && currentIndex > targetIndex;
}

function isMissionNpcTalked(campaignId: string, npcId: string): boolean {
  const state = campaignStates()[campaignId];
  return state?.missionNpcFlags?.[`${campaignId}:${npcId}`] ?? false;
}

function loadCampaigns(registeredCampaigns: Record<string, Campaign>, data: Record<string, CampaignSaveData>): void {
  campaigns = registeredCampaigns;
  setCampaignStates(data);
}

function markNpcTalked(npcId: string): void {
  setCampaignStates((prev) => {
    let changed = false;
    const next = { ...prev };
    for (const [id, state] of Object.entries(next)) {
      if (state.status !== CampaignStatus.Started) {continue;}
      const key = `${id}:${npcId}`;
      if (state.missionNpcFlags?.[key] !== true) {
        next[id] = { ...state, missionNpcFlags: { ...state.missionNpcFlags, [key]: true } };
        changed = true;
      }
    }
    return changed ? next : prev;
  });
}

function startCampaign(id: string): void {
  const campaign = campaigns[id];
  if (!campaign) {return;}
  const firstMissionId = campaign.missions[0]?.id ?? '';
  setCampaignStates((prev) => ({
    ...prev,
    [id]: { currentMission: firstMissionId, missionNpcFlags: buildNpcFlags(campaign, 0), status: CampaignStatus.Started },
  }));
}

function checkCampaigns(): void {
  const states = campaignStates();
  for (const campaign of Object.values(campaigns)) {
    const state = states[campaign.id];

    if (campaign.autoStart && (!state || state.status === CampaignStatus.Inactive)) {
      const unlocked = campaign.unlockRequirements?.every((r) => r.isCompleted()) ?? true;
      if (unlocked) {startCampaign(campaign.id);}
      continue;
    }

    if (!state || state.status !== CampaignStatus.Started) {continue;}

    const currentIndex = getMissionIndex(campaign, state.currentMission);
    const mission = campaign.missions[currentIndex];
    if (!mission) {continue;}

    const allCompleted = mission.goals.every((r) => r.isCompleted());
    if (allCompleted) {
      advanceMission(campaign.id);
    }
  }
}

export {
  campaignStates,
  getCampaignState,
  isCampaignCompleted,
  isCampaignStarted,
  isMissionCompleted,
  isMissionNpcTalked,
  loadCampaigns,
  markNpcTalked,
  startCampaign,
  checkCampaigns,
};
