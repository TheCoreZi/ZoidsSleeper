export const DropType = {
  Item: 'item',
  ZiData: 'zi_data',
} as const;
export type DropType = (typeof DropType)[keyof typeof DropType];

export abstract class Drop {
  chance: number;
  abstract type: DropType;

  constructor(chance: number) {
    this.chance = chance;
  }

  abstract canDrop(): boolean;
  abstract grant(): void;
}
