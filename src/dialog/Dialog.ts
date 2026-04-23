import { dialogLength } from '../i18n';
import type { Reward } from '../reward';

export interface DialogLine {
  image?: string;
  interpolation?: Record<string, number | string>;
  portrait?: string;
  speakerKey: string;
  textKey: string;
}

export interface SpeakerOverride {
  portrait?: string;
  speakerKey: string;
}

export class DialogChoice {
  readonly followUp: DialogScript;
  readonly image?: string;
  readonly labelKey: string;
  readonly onChoose?: () => void;

  constructor(labelKey: string, followUp: DialogScript, image?: string, onChoose?: () => void) {
    this.followUp = followUp;
    this.image = image;
    this.labelKey = labelKey;
    this.onChoose = onChoose;
  }
}

export class DialogDecision {
  readonly alertKey?: string;
  readonly choices: DialogChoice[];
  readonly portrait?: string;
  readonly questionKey: string;

  constructor(questionKey: string, choices: DialogChoice[], portrait?: string, alertKey?: string) {
    this.alertKey = alertKey;
    this.choices = choices;
    this.portrait = portrait;
    this.questionKey = questionKey;
  }
}

export class DialogScript {
  readonly decision?: DialogDecision;
  readonly lines: DialogLine[];
  readonly reward?: Reward;

  constructor(lines: DialogLine[], reward?: Reward, decision?: DialogDecision) {
    this.decision = decision;
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
  images?: Record<number, string>,
  speakers?: Record<number, SpeakerOverride>
): DialogLine[] {
  let currentImage: string | undefined;
  let currentSpeaker: SpeakerOverride | undefined;
  return Array.from({ length: dialogLength(dialogKey) }, (_, i) => {
    if (images && i in images) {
      currentImage = images[i] || undefined;
    }
    if (speakers && i in speakers) {
      currentSpeaker = speakers[i].speakerKey ? speakers[i] : undefined;
    }
    const linePortrait = currentSpeaker ? currentSpeaker.portrait : portrait;
    return {
      ...(currentImage && { image: currentImage }),
      ...(interpolations?.[i] && { interpolation: interpolations[i] }),
      ...(linePortrait && { portrait: linePortrait }),
      speakerKey: currentSpeaker?.speakerKey ?? speakerKey,
      textKey: `${dialogKey}.${i}`,
    };
  });
}
