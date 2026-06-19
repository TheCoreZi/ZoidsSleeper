import type { FeatureFlag } from '../featureFlag';
import { isStatefulRequirement, type Requirement, type RequirementSaveData } from '../requirement';

export const CampaignStatus = {
  Completed: 'completed',
  Inactive: 'inactive',
  Started: 'started',
} as const;

export type CampaignStatus = typeof CampaignStatus[keyof typeof CampaignStatus];

export interface MissionSaveData {
  goalState: RequirementSaveData[];
  id: string;
}

export class Mission {
  featureFlag?: FeatureFlag;
  goals: Requirement[];
  id: string;
  onComplete?: () => void;
  showProgress?: boolean;

  constructor({ featureFlag, goals, id, onComplete, showProgress }: {
    featureFlag?: FeatureFlag;
    goals: Requirement[];
    id: string;
    onComplete?: () => void;
    showProgress?: boolean;
  }) {
    this.featureFlag = featureFlag;
    this.goals = goals;
    this.id = id;
    this.onComplete = onComplete;
    this.showProgress = showProgress;
  }

  fromSaveData(data: MissionSaveData): void {
    this.goals.forEach((g, i) => { if (isStatefulRequirement(g)) {g.fromSaveData(data.goalState[i]);} });
  }

  toSaveData(): MissionSaveData {
    return { goalState: this.goals.map((g) => isStatefulRequirement(g) ? g.toSaveData() : {}), id: this.id };
  }
}

export interface Campaign {
  autoStart?: boolean;
  featureFlag?: FeatureFlag;
  hidden?: boolean;
  id: string;
  missions: Mission[];
  unlockRequirements?: Requirement[];
}

export interface CampaignSaveData {
  currentMission: MissionSaveData;
  missionNpcFlags?: Record<string, boolean>;
  status: CampaignStatus;
}
