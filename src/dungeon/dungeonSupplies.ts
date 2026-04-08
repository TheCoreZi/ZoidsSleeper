import { SupplyCostType, SupplyOption, SupplyType } from './DungeonSupply';

export const DUNGEON_SUPPLIES = {
  field_repair: new SupplyOption('dungeon:supply_repair', SupplyType.Heal, 30, SupplyCostType.AttackDebuff, 10),
  overclock: new SupplyOption('dungeon:supply_overclock', SupplyType.AttackBuff, 15, SupplyCostType.Damage, 15),
};
