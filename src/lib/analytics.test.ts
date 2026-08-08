import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AnalyticsSource, trackCampaignProgress, trackFaction } from './analytics';

const track = vi.fn();

beforeEach(() => {
  track.mockClear();
  window.umami = { track };
});

afterEach(() => {
  delete window.umami;
});

describe('analytics', () => {
  it('tracks the current faction', () => {
    trackFaction('helic_republic');

    expect(track).toHaveBeenCalledWith('player-faction', {
      faction: 'helic_republic',
      source: AnalyticsSource.Change,
    });
  });

  it('tracks campaign progress', () => {
    trackCampaignProgress('test_campaign', 'current_mission');

    expect(track).toHaveBeenCalledWith('campaign-progress', {
      campaign: 'test_campaign',
      progress: 'current_mission',
      source: AnalyticsSource.Change,
    });
  });

  it('tracks campaign progress from a session', () => {
    trackCampaignProgress('started_campaign', 'current_mission', AnalyticsSource.Session);

    expect(track).toHaveBeenCalledWith('campaign-progress', {
      campaign: 'started_campaign',
      progress: 'current_mission',
      source: AnalyticsSource.Session,
    });
  });

  it('does not fail when Umami is unavailable', () => {
    delete window.umami;

    expect(() => trackFaction('neutral')).not.toThrow();
  });
});
