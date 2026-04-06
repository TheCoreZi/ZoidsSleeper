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
      { dialogKey: 'dialog:captain_debrief' },
    ],
    id: 'captain_malinoff',
    nameKey: 'pilots:captain_malinoff',
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
