import { t } from '../i18n';
import { Currency } from '../models/Currency';
import { getCurrency } from '../store/walletStore';
import type { Requirement } from './Requirement';

export class MagnisRequirement implements Requirement {
  requiredValue: number;

  constructor(requiredValue: number) {
    this.requiredValue = requiredValue;
  }

  hint(): string {
    return t('requirements:magnis_required', { count: this.requiredValue });
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getCurrency(Currency.Magnis);
  }
}
