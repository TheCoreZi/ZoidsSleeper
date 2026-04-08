import {
  AmbushOutcome,
  DamageOutcome,
  DungeonEvent,
  DungeonEventChoice,
  HealOutcome,
  RewardOutcome,
} from './DungeonEventOutcome';

export const DUNGEON_EVENTS = {
  mysterious_device: new DungeonEvent('mysterious_device', 'dungeon:event_device', [
    new DungeonEventChoice('dungeon:event_device_take', new RewardOutcome('dungeon:event_device_reward', 500, 'magnis')),
    new DungeonEventChoice('dungeon:event_device_activate', new AmbushOutcome('dungeon:event_device_ambush')),
  ]),
  mysterious_creature: new DungeonEvent('mysterious_creature', 'dungeon:event_creature', [
    new DungeonEventChoice('dungeon:event_creature_provoke', new DamageOutcome('dungeon:event_creature_damage', 15)),
    new DungeonEventChoice('dungeon:event_creature_approach',new HealOutcome('dungeon:event_creature_heal', 10) ),
  ]),
};
