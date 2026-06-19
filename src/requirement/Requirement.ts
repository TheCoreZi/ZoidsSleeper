export interface RequirementSaveData {
  requirements?: RequirementSaveData[];
}

export interface Requirement {
  hint(): string;
  isCompleted(): boolean;
  progress(): number;
  requiredValue: number;
}

export interface StatefulRequirement extends Requirement {
  fromSaveData(data: RequirementSaveData): void;
  toSaveData(): RequirementSaveData;
}

export function isStatefulRequirement(req: Requirement): req is StatefulRequirement {
  return 'toSaveData' in req;
}
