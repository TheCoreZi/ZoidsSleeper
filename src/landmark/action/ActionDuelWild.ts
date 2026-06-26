import { t } from '../../i18n';
import type { CurrencyReward } from '../../models/Currency';
import type { ZoidBlueprint } from '../../models/Zoid';
import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';
import type { CityAction } from './CityAction';

export class ActionDuelWild implements CityAction {
  completeRequirements?: Requirement[];
  currencyReward: CurrencyReward;
  fragmentYield: number;
  id: string;
  nameKey: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  reward?: Reward;
  unwinnable: boolean;
  wildId: string;
  zoids: ZoidBlueprint[];

  constructor(nameKey: string, wildId: string, zoids: ZoidBlueprint[], currencyReward: CurrencyReward, fragmentYield = 0, requirements?: Requirement[], completeRequirements?: Requirement[], unwinnable = false, reward?: Reward) {
    this.completeRequirements = completeRequirements;
    this.currencyReward = currencyReward;
    this.fragmentYield = fragmentYield;
    this.id = `duel-wild-${wildId}`;
    this.nameKey = nameKey;
    this.requirements = requirements;
    this.reward = reward;
    this.unwinnable = unwinnable;
    this.wildId = wildId;
    this.zoids = zoids;
  }

  execute(): void {
    this.onExecute?.();
  }

  getLabel(): string {
    return t('ui:duel_wild', { name: t(this.nameKey) });
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
