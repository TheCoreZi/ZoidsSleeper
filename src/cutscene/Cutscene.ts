import type { Reward } from '../reward';
import { buildDialogLines, DialogScript } from '../story/Dialog';

export class Cutscene {
  readonly dialogKey: string;
  readonly id: string;
  readonly reward?: Reward;

  constructor(id: string, dialogKey: string, reward?: Reward) {
    this.dialogKey = dialogKey;
    this.id = id;
    this.reward = reward;
  }

  toDialogScript(): DialogScript {
    return new DialogScript(buildDialogLines('', this.dialogKey), this.reward);
  }
}
