import { COMPOUND_REQUIREMENTS, MissionCompletedRequirement } from '../requirement';
import type { Requirement } from '../requirement';

export interface NpcDialog {
  dialogKey: string;
  images?: Record<number, string>;
  unlockRequirement?: Requirement;
}

export interface Npc {
  dialogs: NpcDialog[];
  id: string;
  nameKey: string;
  portrait?: string;
}

export const NPCS: Record<string, Npc> = {
  becker: {
    dialogs: [
      { dialogKey: 'dialog:becker_scan', unlockRequirement: COMPOUND_REQUIREMENTS.becker_probes },
      { dialogKey: 'dialog:becker_scan_gift' },
    ],
    id: 'becker',
    nameKey: 'pilots:becker',
  },
  bianco: {
    dialogs: [
      { dialogKey: 'dialog:bianco_interrogation', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'defeat_bianco_nero') },
      { dialogKey: 'dialog:bianco' },
    ],
    id: 'bianco',
    nameKey: 'pilots:bianco',
    portrait: 'images/pilots/bianco.png',
  },
  boy: {
    dialogs: [
      { dialogKey: 'dialog:boy' },
    ],
    id: 'boy',
    nameKey: 'pilots:boy',
  },
  priest_leon: {
    dialogs: [
      { dialogKey: 'dialog:priest_leon_exchange', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'repel_attackers') },
      { dialogKey: 'dialog:priest_leon' },
    ],
    id: 'priest_leon',
    nameKey: 'pilots:priest_leon',
    portrait: 'images/pilots/priest_leon.png',
  },
  rosso: {
    dialogs: [{ dialogKey: 'dialog:rosso_confrontation' }],
    id: 'rosso',
    nameKey: 'pilots:rosso',
    portrait: 'images/pilots/rosso.png',
  },
  explorer: {
    dialogs: [{ dialogKey: 'dialog:explorer_dungeon_tips', images: {1: 'images/items/zi_metal.png', 2: '' } }],
    id: 'explorer',
    nameKey: 'pilots:explorer',
  },
  fiona: {
    dialogs: [
      { dialogKey: 'dialog:fiona_rescue', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'fight_rosso') },
      { dialogKey: 'dialog:fiona_oasis', images: {1: 'images/items/ancient_statue.png', 2: '' } },
    ],
    id: 'fiona',
    nameKey: 'pilots:fiona',
    portrait: 'images/pilots/fiona.png',
  },
  girl: {
    dialogs: [{ dialogKey: 'dialog:girl_thanks' }],
    id: 'girl',
    nameKey: 'pilots:girl',
    portrait: 'images/pilots/girl.png',
  },
  captain_malinoff: {
    dialogs: [
      {
        dialogKey: 'dialog:captain_farewell',
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'grow_army'),
      },
      { dialogKey: 'dialog:captain_debrief' },
    ],
    id: 'captain_malinoff',
    nameKey: 'pilots:captain_malinoff',
    portrait: 'images/pilots/malinoff.png',
  },
  maria_flyheight: {
    dialogs: [
      { dialogKey: 'dialog:maria_van_fled', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'talk_to_girl') },
      { dialogKey: 'dialog:maria_fiona', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'interrogate_bandits') },
      { dialogKey: 'dialog:maria_flyheight' },
    ],
    id: 'maria_flyheight',
    nameKey: 'pilots:maria_flyheight',
    portrait: 'images/pilots/maria.png',
  },
  jenkins: {
    dialogs: [
      {
        dialogKey: 'dialog:jenkins_to_work',
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'obtain_zi_data'),
      },
      {
        dialogKey: 'dialog:jenkins',
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'report_to_captain'),
      },
    ],
    id: 'jenkins',
    nameKey: 'pilots:jenkins',
  },
  scrap_dealer: {
    dialogs: [
      { dialogKey: 'dialog:scrap_dealer' },
    ],
    id: 'scrap_dealer',
    nameKey: 'pilots:scrap_dealer',
  },
  van: {
    dialogs: [
      { dialogKey: 'dialog:van_challenge', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'check_van_colony') },
      { dialogKey: 'dialog:van_tied', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'tell_van_kidnapping') },
      { dialogKey: 'dialog:van_kidnapping', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'repel_attackers') },
      { dialogKey: 'dialog:van_oasis', unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'maria_van_status') },
      { dialogKey: 'dialog:van_alert', images: { 0: 'images/characters/zeke_full.png' } },
    ],
    id: 'van',
    nameKey: 'pilots:van',
    portrait: 'images/pilots/van.png',
  },
  watchman: {
    dialogs: [{ dialogKey: 'dialog:watchman_combat_tips' }],
    id: 'watchman',
    nameKey: 'pilots:watchman',
  },
  woman: {
    dialogs: [
      { dialogKey: 'dialog:woman' },
    ],
    id: 'woman',
    nameKey: 'pilots:woman',
  },
};

export function getNpc(id: string): Npc {
  return NPCS[id];
}

