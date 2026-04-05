import type { Requirement } from '../../requirement';
import type { DialogScript } from '../../story/Dialog';
import type { CityAction } from './CityAction';

export class ActionTalkToNPC implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  label: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  script: DialogScript;

  constructor(scriptId: string, script: DialogScript, label: string, completeRequirements?: Requirement[], requirements?: Requirement[]) {
    this.completeRequirements = completeRequirements;
    this.id = `talk-${scriptId}`;
    this.label = label;
    this.requirements = requirements;
    this.script = script;
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
