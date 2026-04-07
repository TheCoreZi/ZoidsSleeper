import { t } from '../i18n';
import { getTotalZoidDataCount } from '../store/zoidDataStore';
import type { ComparisonCondition } from './ComparisonCondition';
import { evaluateCondition } from './ComparisonCondition';
import type { Requirement } from './Requirement';

export class ZiDataRequirement implements Requirement {
  condition: ComparisonCondition;
  requiredValue: number;

  constructor(condition: ComparisonCondition, requiredValue: number) {
    this.condition = condition;
    this.requiredValue = requiredValue;
  }

  hint(): string {
    return t('requirements:zi_data_required', { count: this.requiredValue });
  }

  isCompleted(): boolean {
    return evaluateCondition(this.condition, this.progress(), this.requiredValue);
  }

  progress(): number {
    return getTotalZoidDataCount();
  }
}
