export const SupplyCostType = {
  AttackDebuff: 'attackDebuff',
  Damage: 'damage',
} as const;
export type SupplyCostType = (typeof SupplyCostType)[keyof typeof SupplyCostType];

export const SupplyType = {
  AttackBuff: 'attackBuff',
  Heal: 'heal',
} as const;
export type SupplyType = (typeof SupplyType)[keyof typeof SupplyType];

export class SupplyOption {
  costType: SupplyCostType;
  costValue: number;
  labelKey: string;
  type: SupplyType;
  value: number;

  constructor(labelKey: string, type: SupplyType, value: number, costType: SupplyCostType, costValue: number) {
    this.costType = costType;
    this.costValue = costValue;
    this.labelKey = labelKey;
    this.type = type;
    this.value = value;
  }
}
