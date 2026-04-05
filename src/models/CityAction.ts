import type { Pilot } from './Pilot';

export interface CityAction {
  id: string;
  label: string;
  execute(): void;
}

export class ActionFightPilot implements CityAction {
  id: string;
  label: string;
  onExecute: (() => void) | null = null;
  pilot: Pilot;

  constructor(pilot: Pilot, label: string) {
    this.id = `fight-${pilot.id}`;
    this.label = label;
    this.pilot = pilot;
  }

  execute(): void {
    this.onExecute?.();
  }
}
