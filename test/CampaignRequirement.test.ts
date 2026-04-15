import { beforeEach, describe, expect, it } from 'vitest';
import { CampaignStatus, type Campaign } from '../src/campaign/Campaign';
import { CampaignCompletedRequirement, CurrentMissionRequirement, MissionCompletedRequirement, RouteKillRequirement } from '../src/requirement';
import { NpcTalkedInCampaignRequirement } from '../src/requirement/NpcTalkedInCampaignRequirement';
import { loadCampaigns, markNpcTalked, startCampaign, checkCampaigns } from '../src/store/campaignStore';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';

const testCampaign: Campaign = {
  id: 'test_campaign',
  missions: [
    { id: 'm0', goals: [new RouteKillRequirement('r', 1)] },
    { id: 'm1', goals: [new NpcTalkedInCampaignRequirement('test_campaign', 'boy')] },
  ],
};

describe('CampaignCompletedRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should not be completed for inactive campaign', () => {
    const req = new CampaignCompletedRequirement('test_campaign');

    expect(req.isCompleted()).toBe(false);
  });

  it('should not be completed for started campaign', () => {
    startCampaign('test_campaign');
    const req = new CampaignCompletedRequirement('test_campaign');

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed for completed campaign', () => {
    loadCampaigns([testCampaign], {
      test_campaign: { currentMission: '', status: CampaignStatus.Completed },
    });
    const req = new CampaignCompletedRequirement('test_campaign');

    expect(req.isCompleted()).toBe(true);
  });
});

describe('MissionCompletedRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should not be completed when campaign is inactive', () => {
    const req = new MissionCompletedRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(false);
  });

  it('should not be completed when still on that mission', () => {
    startCampaign('test_campaign');
    const req = new MissionCompletedRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when campaign has advanced past that mission', () => {
    startCampaign('test_campaign');
    incrementRouteKills('r');
    checkCampaigns();
    const req = new MissionCompletedRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(true);
  });

  it('should be completed when campaign is fully completed', () => {
    loadCampaigns([testCampaign], {
      test_campaign: { currentMission: '', status: CampaignStatus.Completed },
    });
    const req = new MissionCompletedRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(true);
  });
});

describe('CurrentMissionRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should not be completed when campaign is inactive', () => {
    const req = new CurrentMissionRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when player is on that mission', () => {
    startCampaign('test_campaign');
    const req = new CurrentMissionRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(true);
  });

  it('should not be completed when player has passed that mission', () => {
    startCampaign('test_campaign');
    incrementRouteKills('r');
    checkCampaigns();
    const req = new CurrentMissionRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(false);
  });

  it('should not be completed when campaign is fully completed', () => {
    loadCampaigns([testCampaign], {
      test_campaign: { currentMission: '', status: CampaignStatus.Completed },
    });
    const req = new CurrentMissionRequirement('test_campaign', 'm0');

    expect(req.isCompleted()).toBe(false);
  });
});

describe('NpcTalkedInCampaignRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should not be completed when flag is not set', () => {
    startCampaign('test_campaign');
    incrementRouteKills('r');
    checkCampaigns();
    const req = new NpcTalkedInCampaignRequirement('test_campaign', 'boy');

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when npc has been talked to', () => {
    startCampaign('test_campaign');
    incrementRouteKills('r');
    checkCampaigns();
    markNpcTalked('boy');
    const req = new NpcTalkedInCampaignRequirement('test_campaign', 'boy');

    expect(req.isCompleted()).toBe(true);
  });
});
