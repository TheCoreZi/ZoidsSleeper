import { MissionCompletedRequirement } from '../requirement';
import type { Requirement } from '../requirement';

export interface NpcDialog {
  dialogKey: string;
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
    dialogs: [{ dialogKey: 'dialog:becker_scan' }],
    id: 'becker',
    nameKey: 'pilots:becker',
  },
  bianco: {
    dialogs: [{ dialogKey: 'dialog:bianco' }],
    id: 'bianco',
    nameKey: 'pilots:bianco',
  },
  boy: {
    dialogs: [
      { dialogKey: 'dialog:boy' },
    ],
    id: 'boy',
    nameKey: 'pilots:boy',
  },
  priest_leon: {
    dialogs: [{ dialogKey: 'dialog:priest_leon' }],
    id: 'priest_leon',
    nameKey: 'pilots:priest_leon',
    portrait: 'images/pilots/priest_leon.png',
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
    dialogs: [{ dialogKey: 'dialog:maria_flyheight' }],
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

