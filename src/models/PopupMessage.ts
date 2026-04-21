export const PopupType = { Campaign: 'campaign', Defeat: 'defeat', Item: 'item', Mission: 'mission', Victory: 'victory' } as const;
export type PopupType = (typeof PopupType)[keyof typeof PopupType];

export class PopupMessage {
  content: string;
  image?: string;
  title: string;
  type: PopupType;

  constructor(content: string, title: string, type: PopupType, image?: string) {
    this.content = content;
    this.image = image;
    this.title = title;
    this.type = type;
  }
}
