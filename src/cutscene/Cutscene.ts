import { resolveSpeakerPortraits } from '../npc/Npc';
import type { Reward } from '../reward';
import { buildDialogLines, DialogScript, type SpeakerOverride } from '../story/Dialog';

export class Cutscene {
  readonly dialogKey: string;
  readonly id: string;
  readonly images?: Record<number, string>;
  readonly reward?: Reward;
  readonly speakers?: Record<number, SpeakerOverride>;

  constructor(id: string, dialogKey: string, reward?: Reward, images?: Record<number, string>, speakers?: Record<number, SpeakerOverride>) {
    this.dialogKey = dialogKey;
    this.id = id;
    this.images = images;
    this.reward = reward;
    this.speakers = speakers;
  }

  toDialogScript(): DialogScript {
    const speakers = this.speakers && resolveSpeakerPortraits(this.speakers);
    return new DialogScript(buildDialogLines('', this.dialogKey, undefined, undefined, this.images, speakers), this.reward);
  }
}
