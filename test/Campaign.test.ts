import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CampaignStatus, type Campaign } from '../src/campaign/Campaign';
import { PopupType } from '../src/models/PopupMessage';
import { RouteKillRequirement } from '../src/requirement';
import { NpcTalkedInCampaignRequirement } from '../src/requirement/NpcTalkedInCampaignRequirement';
import {
  getCampaignState,
  isCampaignCompleted,
  isCampaignStarted,
  loadCampaigns,
  markNpcTalked,
  startCampaign,
  checkCampaigns,
} from '../src/store/campaignStore';
import * as gameStore from '../src/store/gameStore';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';

const testCampaign: Campaign = {
  id: 'test_campaign',
  missions: [
    { id: 'mission_1', goals: [new RouteKillRequirement('test_route', 3)] },
    { id: 'mission_2', goals: [new NpcTalkedInCampaignRequirement('test_campaign', 'boy')] },
  ],
};

describe('Campaign Store', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should return inactive state for unknown campaign', () => {
    const state = getCampaignState('unknown');

    expect(state.status).toBe(CampaignStatus.Inactive);
  });

  it('should start a campaign', () => {
    startCampaign('test_campaign');

    expect(isCampaignStarted('test_campaign')).toBe(true);
    expect(getCampaignState('test_campaign').currentMission).toBe('mission_1');
  });

  it('should not advance when requirements are not met', () => {
    startCampaign('test_campaign');
    checkCampaigns();

    expect(getCampaignState('test_campaign').currentMission).toBe('mission_1');
  });

  it('should advance to next mission when requirements are met', () => {
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();

    expect(getCampaignState('test_campaign').currentMission).toBe('mission_2');
  });

  it('should complete campaign when all missions are done', () => {
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();

    markNpcTalked('boy');
    checkCampaigns();

    expect(isCampaignCompleted('test_campaign')).toBe(true);
  });

  it('should show campaign completed popup with correct title', () => {
    const spy = vi.spyOn(gameStore, 'showPopup');
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();

    markNpcTalked('boy');
    checkCampaigns();

    const campaignPopup = spy.mock.calls.find(([msg]) => msg.type === PopupType.Campaign);
    expect(campaignPopup).toBeDefined();
    expect(campaignPopup![0].title).toBe('Campaign Completed!');

    spy.mockRestore();
  });

  it('should fire onComplete callback when mission completes', () => {
    const callback = vi.fn();
    const campaignWithCallback: Campaign = {
      id: 'callback_campaign',
      missions: [
        { id: 'm1', onComplete: callback, goals: [new RouteKillRequirement('test_route', 1)] },
      ],
    };
    loadCampaigns({ callback_campaign: campaignWithCallback }, {});
    startCampaign('callback_campaign');
    incrementRouteKills('test_route');
    checkCampaigns();

    expect(callback).toHaveBeenCalledOnce();
  });

  it('should restore campaign state from save data', () => {
    loadCampaigns([testCampaign], {
      test_campaign: { currentMission: 'mission_2', status: CampaignStatus.Started },
    });

    expect(getCampaignState('test_campaign').currentMission).toBe('mission_2');
    expect(isCampaignStarted('test_campaign')).toBe(true);
  });
});

describe('NPC Talk Flags', () => {
  beforeEach(() => {
    loadStatistics({}, {});
    loadCampaigns({ test_campaign: testCampaign }, {});
  });

  it('should reset npc flag when mission with NpcTalkedInCampaignRequirement starts', () => {
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();

    const state = getCampaignState('test_campaign');

    expect(state.missionNpcFlags?.['test_campaign:boy']).toBe(false);
  });

  it('should set npc flag when markNpcTalked is called', () => {
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();
    markNpcTalked('boy');

    const state = getCampaignState('test_campaign');

    expect(state.missionNpcFlags?.['test_campaign:boy']).toBe(true);
  });

  it('should not set flag for unrelated npc', () => {
    startCampaign('test_campaign');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    checkCampaigns();
    markNpcTalked('woman');

    const state = getCampaignState('test_campaign');

    expect(state.missionNpcFlags?.['test_campaign:boy']).toBe(false);
  });
});
