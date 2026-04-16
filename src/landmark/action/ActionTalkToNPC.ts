import { t } from '../../i18n';
import { getNpc } from '../../npc/Npc';
import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';
import { buildDialogLines, DialogScript } from '../../story/Dialog';
import type { CityAction } from './CityAction';

export class ActionTalkToNPC implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  labelKey?: string;
  npcId: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  reward?: Reward;

  constructor(npcId: string, requirements?: Requirement[], completeRequirements?: Requirement[], reward?: Reward, labelKey?: string) {
    this.completeRequirements = completeRequirements;
    this.id = `talk-${npcId}`;
    this.labelKey = labelKey;
    this.npcId = npcId;
    this.requirements = requirements;
    this.reward = reward;
  }

  get script(): DialogScript {
    const npc = getNpc(this.npcId);
    const dialog = npc.dialogs.find((d) => !d.unlockRequirement || d.unlockRequirement.isCompleted())
      ?? npc.dialogs[npc.dialogs.length - 1];
    return new DialogScript(buildDialogLines(npc.nameKey, dialog.dialogKey, npc.portrait, undefined, dialog.images), this.reward);
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    if (this.labelKey) {
      return t(this.labelKey);
    }
    const npc = getNpc(this.npcId);
    return t('ui:talk_to_npc', { name: t(npc.nameKey) });
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
