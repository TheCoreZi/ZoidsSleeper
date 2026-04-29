import { t } from '../../i18n';
import type { CurrencyReward } from '../../models/Currency';
import { getZoidById, type ZoidBlueprint } from '../../models/Zoid';
import type { Requirement } from '../../requirement';
import type { Reward } from '../../reward';
import type { CityAction } from './CityAction';

export class ActionFightWild implements CityAction {
  completeRequirements?: Requirement[];
  currencyReward: CurrencyReward;
  id: string;
  onExecute: (() => void) | null = null;
  requirements?: Requirement[];
  reward?: Reward;
  unwinnable: boolean;
  wildId: string;
  zoids: ZoidBlueprint[];

  constructor(wildId: string, zoids: ZoidBlueprint[], currencyReward: CurrencyReward, requirements?: Requirement[], completeRequirements?: Requirement[], unwinnable = false, reward?: Reward) {
    this.completeRequirements = completeRequirements;
    this.currencyReward = currencyReward;
    this.id = `wild-${wildId}`;
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
    return t('ui:fight_wild', { name: getZoidById(this.zoids[0].id).name });
  }

  isCompleted(): boolean {
    return this.completeRequirements?.every((r) => r.isCompleted()) ?? false;
  }

  isUnlocked(): boolean {
    return this.requirements?.every((r) => r.isCompleted()) ?? true;
  }
}
