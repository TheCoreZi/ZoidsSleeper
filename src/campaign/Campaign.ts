import type { Requirement } from '../requirement';

export const CampaignStatus = {
  Completed: 'completed',
  Inactive: 'inactive',
  Started: 'started',
} as const;

export type CampaignStatus = typeof CampaignStatus[keyof typeof CampaignStatus];

export interface Mission {
  devOnly?: boolean;
  goals: Requirement[];
  id: string;
  onComplete?: () => void;
}

export interface Campaign {
  autoStart?: boolean;
  devOnly?: boolean;
  id: string;
  missions: Mission[];
  unlockRequirements?: Requirement[];
}

export interface CampaignSaveData {
  currentMission: string;
  missionNpcFlags?: Record<string, boolean>;
  status: CampaignStatus;
}
