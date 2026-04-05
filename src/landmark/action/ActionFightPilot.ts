import type { Requirement } from '../../requirement';
import type { Pilot } from '../Pilot';
import type { CityAction } from './CityAction';

export class ActionFightPilot implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  label: string;
  onExecute: (() => void) | null = null;
  pilot: Pilot;
  requirements?: Requirement[];

  constructor(pilot: Pilot, label: string, completeRequirements?: Requirement[], requirements?: Requirement[]) {
    this.completeRequirements = completeRequirements;
    this.id = `fight-${pilot.id}`;
    this.label = label;
    this.pilot = pilot;
    this.requirements = requirements;
  }

  execute(): void {
    this.onExecute?.();
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
