export const AnalyticsSource = {
  Change: 'change',
  Session: 'session',
} as const;

export type AnalyticsSource = (typeof AnalyticsSource)[keyof typeof AnalyticsSource];

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, string>) => void;
    };
  }
}

export function trackFaction(faction: string, source: AnalyticsSource = AnalyticsSource.Change): void {
  track('player-faction', { faction, source });
}

export function trackCampaignProgress(campaign: string, progress: string, source: AnalyticsSource = AnalyticsSource.Change): void {
  track('campaign-progress', { campaign, progress, source });
}

function track(name: string, data: Record<string, string>): void {
  window.umami?.track(name, data);
}
