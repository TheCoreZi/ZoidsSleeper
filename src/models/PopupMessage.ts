export const PopupType = { Campaign: 'campaign', Defeat: 'defeat', Evolution: 'evolution', Faction: 'faction', Item: 'item', Mission: 'mission', Victory: 'victory' } as const;
export type PopupType = (typeof PopupType)[keyof typeof PopupType];

export interface PopupImage {
  src: string;
}

export class StaticPopupImage implements PopupImage {
  src: string;

  constructor(src: string) {
    this.src = src;
  }
}

export class EvolutionPopupImage implements PopupImage {
  sourceImage: string;
  targetImage: string;

  constructor(sourceImage: string, targetImage: string) {
    this.sourceImage = sourceImage;
    this.targetImage = targetImage;
  }

  get src(): string {
    return this.sourceImage;
  }
}

export class PopupMessage {
  content: string;
  image?: PopupImage;
  title: string;
  type: PopupType;

  constructor(content: string, title: string, type: PopupType, image?: PopupImage | string) {
    this.content = content;
    this.image = typeof image === 'string' ? new StaticPopupImage(image) : image;
    this.title = title;
    this.type = type;
  }
}
