import { describe, expect, it } from 'vitest';

import { CampaignStatus, type Campaign } from '../campaign/Campaign';
import { CampaignCompletedRequirement } from '../requirement/CampaignCompletedRequirement';
import { NpcTalkedInCampaignRequirement } from '../requirement/NpcTalkedInCampaignRequirement';
import { campaignStates, checkCampaigns, loadCampaigns } from './campaignStore';

function stubCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    autoStart: true,
    id: 'test_campaign',
    missions: [
      { id: 'first_mission', goals: [new NpcTalkedInCampaignRequirement('test_campaign', 'npc')] },
    ],
    ...overrides,
  };
}

describe('checkCampaigns', () => {
  it('auto-starts a campaign with no unlock requirements', () => {
    const campaign = stubCampaign({ id: 'auto_start' });
    loadCampaigns({ auto_start: campaign }, {});

    checkCampaigns();

    expect(campaignStates()['auto_start']?.status).toBe(CampaignStatus.Started);
  });

  it('auto-starts devOnly campaigns in dev mode', () => {
    const campaign = stubCampaign({ devOnly: true, id: 'dev_campaign' });
    loadCampaigns({ dev_campaign: campaign }, {});

    checkCampaigns();

    expect(campaignStates()['dev_campaign']?.status).toBe(CampaignStatus.Started);
  });

  it('does not auto-start a campaign with unmet unlock requirements', () => {
    const campaign = stubCampaign({
      id: 'locked_campaign',
      unlockRequirements: [new CampaignCompletedRequirement('nonexistent')],
    });
    loadCampaigns({ locked_campaign: campaign }, {});

    checkCampaigns();

    expect(campaignStates()['locked_campaign']).toBeUndefined();
  });

  it('chains campaigns via CampaignCompletedRequirement', () => {
    const first = stubCampaign({ id: 'first' });
    const second = stubCampaign({
      id: 'second',
      unlockRequirements: [new CampaignCompletedRequirement('first')],
    });
    loadCampaigns(
      { first, second },
      { first: { currentMission: '', missionNpcFlags: {}, status: CampaignStatus.Completed } }
    );

    checkCampaigns();

    expect(campaignStates()['second']?.status).toBe(CampaignStatus.Started);
  });
});
