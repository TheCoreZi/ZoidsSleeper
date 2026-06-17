import {
  AmbushOutcome,
  AttackBuffOutcome,
  DamageOutcome,
  DungeonEvent,
  DungeonEventChoice,
  HealOutcome,
  ItemRewardOutcome,
  PilotAmbushOutcome,
  RewardOutcome,
  WildAmbushOutcome,
} from './DungeonEventOutcome';

export const DUNGEON_EVENTS = {
  downed_zoid: new DungeonEvent('downed_zoid', 'dungeon:event_downed', [
    new DungeonEventChoice('dungeon:event_downed_repair', [
      new AttackBuffOutcome('dungeon:event_downed_repair_buff', 20, 50),
      new WildAmbushOutcome('dungeon:event_downed_salvage_wild', { id: 'cannon_tortoise', level: 30, maxHealthOverride: 5000, attackOverride: 25 }, 50),
      new ItemRewardOutcome('dungeon:event_downed_repair_cannon', 'buster_cannon', 1, 0.5),
    ]),
    new DungeonEventChoice('dungeon:event_downed_salvage', [
      new ItemRewardOutcome('dungeon:event_downed_salvage_preserver', 'core_preserver', 3, 4),
      new ItemRewardOutcome('dungeon:event_downed_salvage_saver', 'core_saver', 2, 2),
      new DamageOutcome('dungeon:event_downed_salvage_damage', 10, 4),
    ]),
  ]),
  enemy_patrol: new DungeonEvent('enemy_patrol', 'dungeon:event_patrol', [
    new DungeonEventChoice('dungeon:event_patrol_confront', [
      new PilotAmbushOutcome('dungeon:event_patrol_confront_fight', 'imperial_scout', 1),
      new RewardOutcome('dungeon:event_patrol_confront_flee', 500, 'magnis', 1),
    ]),
    new DungeonEventChoice('dungeon:event_patrol_hide', [
      new RewardOutcome('dungeon:event_patrol_hide_reward', 30, 'zi_metal', 1),
      new DamageOutcome('dungeon:event_patrol_hide_spotted', 30, 1),
    ]),
  ]),
  fallen_soldiers: new DungeonEvent('fallen_soldiers', 'dungeon:event_soldiers', [
    new DungeonEventChoice('dungeon:event_soldiers_help', [
      new HealOutcome('dungeon:event_soldiers_help_heal', 15, 6),
      new DamageOutcome('dungeon:event_soldiers_help_trap', 20, 4),
    ]),
    new DungeonEventChoice('dungeon:event_soldiers_search', [
      new RewardOutcome('dungeon:event_soldiers_search_reward', 80, 'zi_metal', 1),
      new AmbushOutcome('dungeon:event_soldiers_search_ambush', 1),
    ]),
  ]),
  mysterious_creature: new DungeonEvent('mysterious_creature', 'dungeon:event_creature', [
    new DungeonEventChoice('dungeon:event_creature_provoke', [
      new DamageOutcome('dungeon:event_creature_provoke_damage', 15, 60),
      new RewardOutcome('dungeon:event_creature_provoke_reward', 50, 'zi_metal', 39),
      new RewardOutcome('dungeon:event_creature_provoke_jackpot', 3000, 'zi_metal', 1),
    ]),
    new DungeonEventChoice('dungeon:event_creature_approach', [
      new HealOutcome('dungeon:event_creature_approach_heal', 10, 7),
      new AmbushOutcome('dungeon:event_creature_approach_ambush', 3),
    ]),
  ]),
  mysterious_device: new DungeonEvent('mysterious_device', 'dungeon:event_device', [
    new DungeonEventChoice('dungeon:event_device_take', [
      new RewardOutcome('dungeon:event_device_take_reward', 500, 'magnis', 1),
      new DamageOutcome('dungeon:event_device_take_damage', 10, 1),
    ]),
    new DungeonEventChoice('dungeon:event_device_activate', [
      new AmbushOutcome('dungeon:event_device_activate_ambush', 4),
      new HealOutcome('dungeon:event_device_activate_heal', 20, 6),
    ]),
  ]),
  sealed_chamber: new DungeonEvent('sealed_chamber', 'dungeon:event_chamber', [
    new DungeonEventChoice('dungeon:event_chamber_open', [
      new RewardOutcome('dungeon:event_chamber_open_reward', 1000, 'magnis', 1),
      new RewardOutcome('dungeon:event_chamber_open_reward', 10000, 'magnis', 0.5),
      new RewardOutcome('dungeon:event_chamber_open_reward', 1000000, 'magnis', 0.01),
      new AmbushOutcome('dungeon:event_chamber_open_ambush', 1),
    ]),
    new DungeonEventChoice('dungeon:event_chamber_analyze', [
      new RewardOutcome('dungeon:event_chamber_analyze_reward', 50, 'zi_metal', 6),
      new AmbushOutcome('dungeon:event_chamber_analyze_ambush', 4),
    ]),
  ]),
  stray_zoid: new DungeonEvent('stray_zoid', 'dungeon:event_stray', [
    new DungeonEventChoice('dungeon:event_stray_calm', [
      new AttackBuffOutcome('dungeon:event_stray_calm_buff', 15, 6),
      new AmbushOutcome('dungeon:event_stray_calm_ambush', 4),
    ]),
    new DungeonEventChoice('dungeon:event_stray_ignore', [
      new RewardOutcome('dungeon:event_stray_ignore_reward', 300, 'magnis', 1),
      new DamageOutcome('dungeon:event_stray_ignore_damage', 10, 1),
    ]),
  ]),
};
