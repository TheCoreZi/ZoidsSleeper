import { describe, expect, it } from 'vitest';

import { CampaignStatus, Mission, type Campaign } from '../campaign/Campaign';
import { AllOfRequirement } from '../requirement/AllOfRequirement';
import { CampaignCompletedRequirement } from '../requirement/CampaignCompletedRequirement';
import { DungeonCompletionRequirement, type DungeonRequirementSaveData } from '../requirement/DungeonCompletionRequirement';
import { ItemRequirement } from '../requirement/ItemRequirement';
import { NpcTalkedInCampaignRequirement } from '../requirement/NpcTalkedInCampaignRequirement';
import { campaignStates, checkCampaigns, loadCampaigns } from './campaignStore';
import { addItem } from './inventoryStore';
import { incrementDungeonCompletions, loadStatistics } from './statisticsStore';

function stubCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    autoStart: true,
    id: 'test_campaign',
    missions: [
      new Mission({ id: 'first_mission', goals: [new NpcTalkedInCampaignRequirement('test_campaign', 'npc')] }),
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

  it('auto-starts feature-flagged campaigns in dev mode', () => {
    const campaign = stubCampaign({ featureFlag: { isEnabled: () => true }, id: 'dev_campaign' });
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
      { first: { currentMission: { goalState: [], id: '' }, missionNpcFlags: {}, status: CampaignStatus.Completed } }
    );

    checkCampaigns();

    expect(campaignStates()['second']?.status).toBe(CampaignStatus.Started);
  });

  it('sets dungeon baseline so previous completions do not satisfy mission', () => {
    loadStatistics({ test_dungeon_sortie: 5 }, {}, {});
    const dungeonReq = new DungeonCompletionRequirement('test_dungeon_sortie', 1);
    const campaign = stubCampaign({
      id: 'dungeon_campaign',
      missions: [
        new Mission({ id: 'talk', goals: [new NpcTalkedInCampaignRequirement('dungeon_campaign', 'npc')] }),
        new Mission({ id: 'clear_dungeon', goals: [dungeonReq] }),
      ],
    });
    loadCampaigns(
      { dungeon_campaign: campaign },
      { dungeon_campaign: { currentMission: { goalState: [], id: 'clear_dungeon' }, status: CampaignStatus.Started } }
    );

    expect(dungeonReq.baseline).toBe(5);
    expect(dungeonReq.isCompleted()).toBe(false);

    incrementDungeonCompletions('test_dungeon_sortie');

    expect(dungeonReq.isCompleted()).toBe(true);
  });

  it('persists goalState in currentMission save data', () => {
    loadStatistics({ test_dungeon_sortie: 3 }, {}, {});
    const dungeonReq = new DungeonCompletionRequirement('test_dungeon_sortie', 1);
    const campaign = stubCampaign({
      id: 'dungeon_campaign',
      missions: [
        new Mission({ id: 'talk', goals: [new NpcTalkedInCampaignRequirement('dungeon_campaign', 'npc')] }),
        new Mission({ id: 'clear_dungeon', goals: [dungeonReq] }),
      ],
    });
    loadCampaigns(
      { dungeon_campaign: campaign },
      { dungeon_campaign: { currentMission: { goalState: [], id: 'clear_dungeon' }, status: CampaignStatus.Started } }
    );

    const state = campaignStates()['dungeon_campaign'];
    expect(state.currentMission).toEqual({ goalState: [{ baselineClears: 3 }], id: 'clear_dungeon' });
  });

  it('restores baseline from saved goalState on load', () => {
    loadStatistics({ test_dungeon_sortie: 10 }, {}, {});
    const dungeonReq = new DungeonCompletionRequirement('test_dungeon_sortie', 1);
    const campaign = stubCampaign({
      id: 'dungeon_campaign',
      missions: [
        new Mission({ id: 'clear_dungeon', goals: [dungeonReq] }),
      ],
    });
    loadCampaigns(
      { dungeon_campaign: campaign },
      { dungeon_campaign: { currentMission: { goalState: [{ baselineClears: 8 } as DungeonRequirementSaveData], id: 'clear_dungeon' }, status: CampaignStatus.Started } }
    );

    expect(dungeonReq.baseline).toBe(8);
    expect(dungeonReq.isCompleted()).toBe(true);
  });

  it('preserves baseline across save and load', () => {
    loadStatistics({ test_dungeon_sortie: 0 }, {}, {});
    const dungeonReq = new DungeonCompletionRequirement('test_dungeon_sortie', 2);
    const campaign = stubCampaign({
      id: 'dungeon_campaign',
      missions: [
        new Mission({ id: 'clear_dungeon', goals: [dungeonReq] }),
      ],
    });

    loadCampaigns({ dungeon_campaign: campaign }, {});
    checkCampaigns();
    incrementDungeonCompletions('test_dungeon_sortie');
    expect(dungeonReq.isCompleted()).toBe(false);

    const savedState = campaignStates();
    loadCampaigns({ dungeon_campaign: campaign }, savedState);
    incrementDungeonCompletions('test_dungeon_sortie');

    expect(dungeonReq.isCompleted()).toBe(true);
  });

  it('advances mission when ItemRequirement is met', () => {
    const campaign = stubCampaign({
      id: 'item_campaign',
      missions: [
        new Mission({ id: 'collect_items', goals: [new ItemRequirement('core_saver', 3)] }),
        new Mission({ id: 'done', goals: [new NpcTalkedInCampaignRequirement('item_campaign', 'npc')] }),
      ],
    });
    loadCampaigns(
      { item_campaign: campaign },
      { item_campaign: { currentMission: { goalState: [], id: 'collect_items' }, status: CampaignStatus.Started } }
    );

    addItem('core_saver', 3);
    checkCampaigns();

    expect(campaignStates()['item_campaign']?.currentMission.id).toBe('done');
  });

  it('handles DungeonCompletionRequirement inside AllOfRequirement', () => {
    loadStatistics({ test_dungeon_sortie: 4 }, {}, {});
    const dungeonReq = new DungeonCompletionRequirement('test_dungeon_sortie', 1);
    const npcReq = new NpcTalkedInCampaignRequirement('dungeon_campaign', 'npc');
    const campaign = stubCampaign({
      id: 'dungeon_campaign',
      missions: [
        new Mission({ id: 'composite', goals: [new AllOfRequirement([dungeonReq, npcReq])] }),
      ],
    });
    loadCampaigns(
      { dungeon_campaign: campaign },
      { dungeon_campaign: { currentMission: { goalState: [{ requirements: [{ baselineClears: 2 } as DungeonRequirementSaveData, {}] }], id: 'composite' }, status: CampaignStatus.Started } }
    );

    expect(dungeonReq.baseline).toBe(2);
    expect(dungeonReq.isCompleted()).toBe(true);
  });
});
