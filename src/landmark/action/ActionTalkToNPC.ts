import { t } from '../../i18n';
import { getNpc } from '../../npc/Npc';
import type { Requirement } from '../../requirement';
import { buildDialog, type DialogScript } from '../../story/Dialog';
import type { CityAction } from './CityAction';

export class ActionTalkToNPC implements CityAction {
  completeRequirements?: Requirement[];
  id: string;
  labelKey?: string;
  npcId: string;
  onComplete?: () => void;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];

  constructor(npcId: string, completeRequirements?: Requirement[], requirements?: Requirement[], onComplete?: () => void, labelKey?: string) {
    this.completeRequirements = completeRequirements;
    this.id = `talk-${npcId}`;
    this.labelKey = labelKey;
    this.npcId = npcId;
    this.onComplete = onComplete;
    this.requirements = requirements;
  }

  get script(): DialogScript {
    const npc = getNpc(this.npcId);
    const dialog = npc.dialogs.find((d) => !d.unlockRequirement || d.unlockRequirement.isCompleted())
      ?? npc.dialogs[npc.dialogs.length - 1];
    return buildDialog(npc.nameKey, dialog.dialogKey, npc.portrait);
  }

  execute(): void {
    this.onExecute?.();
    this.onComplete?.();
    this.onComplete = undefined;
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
