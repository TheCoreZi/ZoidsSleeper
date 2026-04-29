import { Faction } from '../models/Faction';
import { AllOfRequirement, COMPOUND_REQUIREMENTS, FactionRequirement, MissionCompletedRequirement, NotRequirement, PilotDefeatRequirement } from '../requirement';
import type { Requirement } from '../requirement';
import { DECISIONS } from '../dialog/decisions';
import type { DialogDecision, SpeakerOverride } from '../dialog/Dialog';

export interface NpcDialog {
  decision?: DialogDecision;
  dialogKey: string;
  images?: Record<number, string>;
  speakers?: Record<number, SpeakerOverride>;
  unlockRequirement?: Requirement;
}

export interface Npc {
  dialogs: NpcDialog[];
  id: string;
  nameKey: string;
  portrait?: string;
}

export const NPCS: Record<string, Npc> = {
  arcadia_guard: {
    dialogs: [{ dialogKey: 'dialog:arcadia_guard' }],
    id: 'arcadia_guard',
    nameKey: 'pilots:arcadia_guard',
    portrait: 'images/pilots/arcadia_guard.png',
  },
  arthur: {
    dialogs: [
      { dialogKey: 'dialog:arthur_same_faction', unlockRequirement: new AllOfRequirement([new PilotDefeatRequirement('arthur'), new FactionRequirement(Faction.HelicRepublic)]) },
      { dialogKey: 'dialog:arthur_already_faction', unlockRequirement: new AllOfRequirement([new PilotDefeatRequirement('arthur'), new NotRequirement(new FactionRequirement(Faction.Neutral))]) },
      { decision: DECISIONS.arthur_join_republic, dialogKey: 'dialog:arthur_post_battle', unlockRequirement: new PilotDefeatRequirement('arthur') },
      { dialogKey: 'dialog:arthur_intro' },
    ],
    id: 'arthur',
    nameKey: 'pilots:arthur',
    portrait: 'images/pilots/arthur.png',
  },
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
  dr_t: {
    dialogs: [{ dialogKey: 'dialog:dr_t_intro' }],
    id: 'dr_t',
    nameKey: 'pilots:dr_t',
    portrait: 'images/pilots/dr_t.png',
  },
  dr_thrun: {
    dialogs: [
      {
        dialogKey: 'dialog:dr_thrun_stray_intro',
        unlockRequirement: new MissionCompletedRequirement('shells_of_time', 'clear_ruins_demo'),
      },
      {
        dialogKey: 'dialog:dr_thrun_backstory',
        unlockRequirement: new MissionCompletedRequirement('shells_of_time', 'meet_father'),
      },
      {
        dialogKey: 'dialog:dr_thrun_ruins',
        images: { 7: 'images/items/sleeper_module.png', 8: '' },
        speakers: {
          2: { speakerKey: 'pilots:kara', portrait: 'images/pilots/girl.png' },
          3: { speakerKey: '' },
          4: { speakerKey: 'pilots:kara', portrait: 'images/pilots/girl.png' },
          5: { speakerKey: '' },
          9: { speakerKey: 'pilots:dr_t', portrait: 'images/pilots/dr_t.png' },
          10: { speakerKey: '' },
        },
      },
    ],
    id: 'dr_thrun',
    nameKey: 'pilots:dr_thrun',
    portrait: 'images/pilots/dr_thrun.png',
  },
  concho_cancer: {
    dialogs: [
      { dialogKey: 'dialog:concho_same_faction', unlockRequirement: new AllOfRequirement([new PilotDefeatRequirement('concho_cancer'), new FactionRequirement(Faction.GuylosEmpire)]) },
      { dialogKey: 'dialog:concho_already_faction', unlockRequirement: new AllOfRequirement([new PilotDefeatRequirement('concho_cancer'), new NotRequirement(new FactionRequirement(Faction.Neutral))]) },
      { decision: DECISIONS.concho_join_guylos, dialogKey: 'dialog:concho_post_battle', unlockRequirement: new PilotDefeatRequirement('concho_cancer') },
      { dialogKey: 'dialog:concho_intro' },
    ],
    id: 'concho_cancer',
    nameKey: 'pilots:concho_cancer',
    portrait: 'images/pilots/concho.png',
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
  kara: {
    dialogs: [{ dialogKey: 'dialog:girl_thanks', speakers: { 0: { portrait: 'images/pilots/girl.png', speakerKey: 'pilots:girl' } } }],
    id: 'kara',
    nameKey: 'pilots:kara',
    portrait: 'images/pilots/girl.png',
  },
  captain_malinoff: {
    dialogs: [
      {
        dialogKey: 'dialog:captain_pride',
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'fight_van'),
      },
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
      {
        dialogKey: 'dialog:van_oasis',
        speakers: { 1: { speakerKey: 'pilots:zeke' }, 2: { speakerKey: '' } },
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'maria_van_status'),
      },
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
      {
        dialogKey: 'dialog:woman_reunion',
        speakers: { 1: { speakerKey: 'pilots:girl', portrait: 'images/pilots/girl.png' }, 2: { speakerKey: '' }, 3: { speakerKey: 'pilots:kara' }, 4: { speakerKey: '' }, 6: { speakerKey: 'pilots:kara' }, 7: { speakerKey: '' } },
        unlockRequirement: new MissionCompletedRequirement('sleeper_commander', 'fight_van'),
      },
      { dialogKey: 'dialog:woman' },
    ],
    id: 'woman',
    nameKey: 'pilots:woman',
  },
  zeke: {
    dialogs: [],
    id: 'zeke',
    nameKey: 'pilots:zeke',
    portrait: 'images/pilots/zeke.png',
  },
};

export function getNpc(id: string): Npc {
  return NPCS[id];
}

export function resolvePortrait(speakerKey: string): string | undefined {
  return Object.values(NPCS).find((n) => n.nameKey === speakerKey)?.portrait;
}

export function resolveSpeakerPortraits(speakers: Record<number, SpeakerOverride>): Record<number, SpeakerOverride> {
  return Object.fromEntries(
    Object.entries(speakers).map(([key, override]) => {
      if (override.portrait || !override.speakerKey) {
        return [key, override];
      }
      const portrait = resolvePortrait(override.speakerKey);
      return [key, portrait ? { ...override, portrait } : override];
    })
  );
}

