import type { Reward } from '../reward';
import { buildDialogLines, DialogScript } from '../story/Dialog';

export class Cutscene {
  readonly dialogKey: string;
  readonly id: string;
  readonly images?: Record<number, string>;
  readonly reward?: Reward;

  constructor(id: string, dialogKey: string, reward?: Reward, images?: Record<number, string>) {
    this.dialogKey = dialogKey;
    this.id = id;
    this.images = images;
    this.reward = reward;
  }

  toDialogScript(): DialogScript {
    return new DialogScript(buildDialogLines('', this.dialogKey, undefined, undefined, this.images), this.reward);
  }
}
