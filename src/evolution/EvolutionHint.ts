export class FactionHint {
  faction: string;

  constructor(faction: string) {
    this.faction = faction;
  }
}

export class ItemHint {
  itemId: string;

  constructor(itemId: string) {
    this.itemId = itemId;
  }
}

export class SeparatorHint {
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

export const StatPrefix = {
  Atk: 'evo_prefix_atk',
  Hp: 'evo_prefix_hp',
  Level: 'evo_prefix_level',
} as const;

export type StatPrefix = (typeof StatPrefix)[keyof typeof StatPrefix];

export class StatHint {
  prefix: StatPrefix;
  threshold: number;

  constructor(prefix: StatPrefix, threshold: number) {
    this.prefix = prefix;
    this.threshold = threshold;
  }
}

export type EvolutionHint = FactionHint | ItemHint | SeparatorHint | StatHint;

export type EvolutionHintLine = EvolutionHint[];
