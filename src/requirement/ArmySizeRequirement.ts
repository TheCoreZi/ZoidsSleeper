import { t } from '../i18n';
import { party } from '../store/partyStore';
import type { ComparisonCondition } from './ComparisonCondition';
import { evaluateCondition } from './ComparisonCondition';
import type { Requirement } from './Requirement';

export class ArmySizeRequirement implements Requirement {
  condition: ComparisonCondition;
  requiredValue: number;

  constructor(condition: ComparisonCondition, requiredValue: number) {
    this.condition = condition;
    this.requiredValue = requiredValue;
  }

  hint(): string {
    return t('requirements:army_size_required', { count: this.requiredValue });
  }

  isCompleted(): boolean {
    return evaluateCondition(this.condition, this.progress(), this.requiredValue);
  }

  progress(): number {
    return party().zoids.length;
  }
}
