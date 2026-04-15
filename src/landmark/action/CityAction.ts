import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';

export interface CityAction {
  completeRequirements?: Requirement[];
  id: string;
  onComplete?: () => void;
  requirements?: Requirement[];
  reward?: Reward;
  execute(): void;
  getLabel(): string;
  isCompleted(): boolean;
  isUnlocked(): boolean;
}

export function isCityActionVisible(action: CityAction): boolean {
  return action.isUnlocked() && !action.isCompleted();
}
