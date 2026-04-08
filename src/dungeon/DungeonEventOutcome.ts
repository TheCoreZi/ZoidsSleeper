export const EventOutcomeType = {
  Ambush: 'ambush',
  Damage: 'damage',
  Heal: 'heal',
  Reward: 'reward',
} as const;
export type EventOutcomeType = (typeof EventOutcomeType)[keyof typeof EventOutcomeType];

export class DungeonEventOutcome {
  descriptionKey: string;
  type: EventOutcomeType;
  value: number;

  constructor(descriptionKey: string, type: EventOutcomeType, value: number) {
    this.descriptionKey = descriptionKey;
    this.type = type;
    this.value = value;
  }
}

export class AmbushOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string) {
    super(descriptionKey, EventOutcomeType.Ambush, 0);
  }
}

export class DamageOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, value: number) {
    super(descriptionKey, EventOutcomeType.Damage, value);
  }
}

export class HealOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, value: number) {
    super(descriptionKey, EventOutcomeType.Heal, value);
  }
}

export class RewardOutcome extends DungeonEventOutcome {
  itemId: string;

  constructor(descriptionKey: string, value: number, itemId: string) {
    super(descriptionKey, EventOutcomeType.Reward, value);
    this.itemId = itemId;
  }
}

export class DungeonEvent {
  choices: DungeonEventChoice[];
  descriptionKey: string;
  id: string;

  constructor(id: string, descriptionKey: string, choices: DungeonEventChoice[]) {
    this.choices = choices;
    this.descriptionKey = descriptionKey;
    this.id = id;
  }
}

export class DungeonEventChoice {
  labelKey: string;
  outcome: DungeonEventOutcome;

  constructor(labelKey: string, outcome: DungeonEventOutcome) {
    this.labelKey = labelKey;
    this.outcome = outcome;
  }
}
