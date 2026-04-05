export const PopupType = { Defeat: 'defeat', Victory: 'victory' } as const;
export type PopupType = (typeof PopupType)[keyof typeof PopupType];

export class PopupMessage {
  content: string;
  title: string;
  type: PopupType;

  constructor(content: string, title: string, type: PopupType) {
    this.content = content;
    this.title = title;
    this.type = type;
  }
}
