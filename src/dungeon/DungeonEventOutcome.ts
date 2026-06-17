import type { ZoidBlueprint } from '../models/Zoid';
import { probabilityRandom } from '../utils/probabilityRandom';

export const EventOutcomeType = {
  Ambush: 'ambush',
  AttackBuff: 'attackBuff',
  Damage: 'damage',
  Heal: 'heal',
  ItemReward: 'itemReward',
  PilotAmbush: 'pilotAmbush',
  Reward: 'reward',
  WildAmbush: 'wildAmbush',
} as const;
export type EventOutcomeType = (typeof EventOutcomeType)[keyof typeof EventOutcomeType];

export class DungeonEventOutcome {
  descriptionKey: string;
  type: EventOutcomeType;
  value: number;
  weight: number;

  constructor(descriptionKey: string, type: EventOutcomeType, value: number, weight: number = 1) {
    this.descriptionKey = descriptionKey;
    this.type = type;
    this.value = value;
    this.weight = weight;
  }
}

export class AttackBuffOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, value: number, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.AttackBuff, value, weight);
  }
}

export class AmbushOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.Ambush, 0, weight);
  }
}

export class DamageOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, value: number, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.Damage, value, weight);
  }
}

export class HealOutcome extends DungeonEventOutcome {
  constructor(descriptionKey: string, value: number, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.Heal, value, weight);
  }
}

export class ItemRewardOutcome extends DungeonEventOutcome {
  amount: number;
  itemId: string;

  constructor(descriptionKey: string, itemId: string, amount: number, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.ItemReward, 0, weight);
    this.amount = amount;
    this.itemId = itemId;
  }
}

export class PilotAmbushOutcome extends DungeonEventOutcome {
  pilotId: string;

  constructor(descriptionKey: string, pilotId: string, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.PilotAmbush, 0, weight);
    this.pilotId = pilotId;
  }
}

export class RewardOutcome extends DungeonEventOutcome {
  itemId: string;

  constructor(descriptionKey: string, value: number, itemId: string, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.Reward, value, weight);
    this.itemId = itemId;
  }
}

export class WildAmbushOutcome extends DungeonEventOutcome {
  zoidData: ZoidBlueprint;

  constructor(descriptionKey: string, zoidData: ZoidBlueprint, weight: number = 1) {
    super(descriptionKey, EventOutcomeType.WildAmbush, 0, weight);
    this.zoidData = zoidData;
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
  outcomes: DungeonEventOutcome[];

  constructor(labelKey: string, outcomes: DungeonEventOutcome[]) {
    this.labelKey = labelKey;
    this.outcomes = outcomes;
  }

  resolveOutcome(): DungeonEventOutcome {
    return probabilityRandom(this.outcomes, (o) => o.weight);
  }
}
