import { dialogLength } from '../i18n';
import type { Reward } from '../reward';

export interface DialogLine {
  image?: string;
  interpolation?: Record<string, number | string>;
  portrait?: string;
  speakerKey: string;
  textKey: string;
}

export class DialogScript {
  readonly lines: DialogLine[];
  readonly reward?: Reward;

  constructor(lines: DialogLine[], reward?: Reward) {
    this.lines = lines;
    this.reward = reward;
  }

  static fromKeys(speakerKey: string, dialogKey: string, portrait?: string): DialogScript {
    return new DialogScript(buildDialogLines(speakerKey, dialogKey, portrait));
  }
}

export function buildDialogLines(
  speakerKey: string,
  dialogKey: string,
  portrait?: string,
  interpolations?: Record<number, Record<string, number | string>>,
  images?: Record<number, string>
): DialogLine[] {
  let currentImage: string | undefined;
  return Array.from({ length: dialogLength(dialogKey) }, (_, i) => {
    if (images && i in images) {
      currentImage = images[i] || undefined;
    }
    return {
      ...(currentImage && { image: currentImage }),
      ...(interpolations?.[i] && { interpolation: interpolations[i] }),
      ...(portrait && { portrait }),
      speakerKey,
      textKey: `${dialogKey}.${i}`,
    };
  });
}
