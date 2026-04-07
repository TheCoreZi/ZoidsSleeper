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
  boy: {
    dialogs: [
      { dialogKey: 'dialog:boy' },
    ],
    id: 'boy',
    nameKey: 'pilots:boy',
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
