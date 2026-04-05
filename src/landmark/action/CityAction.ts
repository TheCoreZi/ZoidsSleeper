import type { Requirement } from '../../requirement';

export interface CityAction {
  completeRequirements?: Requirement[];
  id: string;
  label: string;
  requirements?: Requirement[];
  execute(): void;
  isCompleted(): boolean;
  isUnlocked(): boolean;
}

export function isCityActionVisible(action: CityAction): boolean {
  return action.isUnlocked() && !action.isCompleted();
}
