import { MissionCompletedRequirement, PilotDefeatRequirement } from '../requirement';
import type { Organoid } from './Organoid';
import { ORGANOIDS } from './Organoid';
import type { ZoidBlueprint } from '../models/Zoid';
import { PilotZoidSet } from './PilotZoidSet';

export interface Pilot {
  fragmentYield: number;
  id: string;
  imageId?: string;
  magnisReward: number;
  name: string;
  zoidSets: PilotZoidSet[];
}

export function getActiveOrganoid(pilot: Pilot): Organoid | undefined {
  const active = pilot.zoidSets.find((s) => s.isActive());
  return (active ?? pilot.zoidSets[pilot.zoidSets.length - 1]).organoid;
}

export function getActiveZoids(pilot: Pilot): ZoidBlueprint[] {
  const active = pilot.zoidSets.find((s) => s.isActive());
  return active?.zoids ?? pilot.zoidSets[pilot.zoidSets.length - 1].zoids;
}

export function getPilotImage(id: string): string {
  const pilot = PILOTS[id];
  return `images/pilots/${pilot?.imageId ?? id}.png`;
}

export const PILOTS: Record<string, Pilot> = {
  arcadia_guard: {
    fragmentYield: 7,
    id: 'arcadia_guard',
    magnisReward: 5000,
    name: 'Guard',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 25, id: 'hammerrock', imageOverride: 'hammerrock_zenebas', level: 28, maxHealthOverride: 5000 },
      ]),
    ],
  },
  arthur: {
    fragmentYield: 7,
    id: 'arthur',
    magnisReward: 12000,
    name: 'Arthur',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 20, id: 'shield_liger', imageOverride: 'shield_liger_black', level: 40, maxHealthOverride: 7500 },
      ]),
    ],
  },
  bandit1: {
    fragmentYield: 4,
    id: 'bandit1',
    magnisReward: 3000,
    name: 'Bandit',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 1, id: 'molga', level: 5, maxHealthOverride: 250 },
      ]),
    ],
  },
  bandits_elmia: {
    fragmentYield: 6,
    id: 'bandits_elmia',
    imageId: 'bandit1',
    magnisReward: 6000,
    name: 'Ruins Bandits',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 200, id: 'guysack', level: 80, maxHealthOverride: 40000 },
        { attackOverride: 250, id: 'malder', level: 80, maxHealthOverride: 40000 },
      ]),
    ],
  },
  bandits_gorge: {
    fragmentYield: 6,
    id: 'bandits_gorge',
    imageId: 'bandit1',
    magnisReward: 6000,
    name: 'Gorge Bandits',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 300, id: 'redler', level: 80, maxHealthOverride: 30000 },
        { attackOverride: 300, id: 'zatton', level: 80, maxHealthOverride: 30000 },
      ]),
    ],
  },
  bandits_oasis: {
    fragmentYield: 6,
    id: 'bandits_oasis',
    imageId: 'bandit1',
    magnisReward: 6000,
    name: 'Oasis Bandits',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 100, id: 'gator', level: 80, maxHealthOverride: 50000 },
        { attackOverride: 150, id: 'merda', level: 80, maxHealthOverride: 60000 },
      ]),
    ],
  },
  dock_thugs: {
    fragmentYield: 5,
    id: 'dock_thugs',
    imageId: 'thug',
    magnisReward: 5000,
    name: 'Dock Thugs',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 150, id: 'molga', level: 80, maxHealthOverride: 30000 },
        { attackOverride: 200, id: 'gator', level: 80, maxHealthOverride: 35000 },
      ]),
    ],
  },
  imperial_scout: {
    fragmentYield: 5,
    id: 'imperial_scout',
    imageId: 'empire_soldier',
    magnisReward: 3000,
    name: 'Imperial Scout',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 20, id: 'molga', level: 20, maxHealthOverride: 2000 },
      ]),
    ],
  },
  gale_task: {
    fragmentYield: 12,
    id: 'gale_task',
    magnisReward: 14000,
    name: 'Gale Task',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 1000, id: 'iron_kong', level: 55, maxHealthOverride: 60000 },
      ], [new MissionCompletedRequirement('shells_of_time', 'fight_opis_army')]),
      new PilotZoidSet([
        { attackOverride: 60, id: 'iron_kong', level: 55, maxHealthOverride: 60000 },
      ]),
    ],
  },
  concho_cancer: {
    fragmentYield: 7,
    id: 'concho_cancer',
    imageId: 'concho',
    magnisReward: 12000,
    name: 'Concho Cancer',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 30, id: 'heldigunner', level: 40, maxHealthOverride: 5500 },
      ]),
    ],
  },
  bianco: {
    fragmentYield: 4,
    id: 'bianco',
    magnisReward: 1500,
    name: 'Bianco',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 25, id: 'command_wolf_desert', level: 25, maxHealthOverride: 2000 },
      ]),
    ],
  },
  bianco_nero: {
    fragmentYield: 4,
    id: 'bianco_nero',
    magnisReward: 1200,
    name: 'Bianco & Nero',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 200, id: 'command_wolf_desert', level: 80, maxHealthOverride: 50000 },
        { attackOverride: 200, id: 'command_wolf_desert', level: 80, maxHealthOverride: 50000 },
      ], [new MissionCompletedRequirement('olympus_guylos', 'recover_cargo')]),
      new PilotZoidSet([
        { attackOverride: 8, id: 'command_wolf_desert', level: 15, maxHealthOverride: 450 },
        { attackOverride: 8, id: 'command_wolf_desert', level: 17, maxHealthOverride: 550 },
      ]),
    ],
  },
  bul: {
    fragmentYield: 4,
    id: 'bul',
    magnisReward: 1000,
    name: 'Bul',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 200, id: 'guysack', imageOverride: 'guysack_bs', level: 80, maxHealthOverride: 60000 },
      ], [new MissionCompletedRequirement('olympus_guylos', 'recover_cargo')]),
      new PilotZoidSet([
        { attackOverride: 8, id: 'guysack', imageOverride: 'guysack_bs', level: 5, maxHealthOverride: 2000 },
      ]),
    ],
  },
  bul_arcobaleno: {
    fragmentYield: 4,
    id: 'bul_arcobaleno',
    imageId: 'bul',
    magnisReward: 1500,
    name: 'Blu',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 20, id: 'guysack', imageOverride: 'guysack_bs', level: 20, maxHealthOverride: 2500 },
      ]),
    ],
  },
  giallo: {
    fragmentYield: 4,
    id: 'giallo',
    magnisReward: 1400,
    name: 'Giallo',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 9, id: 'molga', level: 22, maxHealthOverride: 500 },
      ]),
    ],
  },
  imperial_soldier: {
    fragmentYield: 7,
    id: 'imperial_soldier',
    imageId: 'empire_soldier',
    magnisReward: 5000,
    name: 'Imperial Soldier',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 25, id: 'sea_panther', level: 35, maxHealthOverride: 5000 },
      ]),
    ],
  },
  republican_officer: {
    fragmentYield: 10,
    id: 'republican_officer',
    magnisReward: 8000,
    name: 'Republican Officer',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 40, id: 'barigator', level: 40, maxHealthOverride: 8000 },
      ]),
    ],
  },
  opis_kerone: {
    fragmentYield: 12,
    id: 'opis_kerone',
    imageId: 'opis',
    magnisReward: 14000,
    name: 'Opis Kerone',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 250, id: 'cannon_tortoise_os', level: 55, maxHealthOverride: 15000 },
      ], [new PilotDefeatRequirement('opis_kerone')]),
      new PilotZoidSet([
        { attackOverride: 1000, id: 'cannon_tortoise_os', level: 55, maxHealthOverride: 15000 },
      ]),
    ],
  },
  nero: {
    fragmentYield: 4,
    id: 'nero',
    magnisReward: 1600,
    name: 'Nero',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 15, id: 'command_wolf_desert', level: 24, maxHealthOverride: 2500 },
      ]),
    ],
  },
  raven: {
    fragmentYield: 15,
    id: 'raven',
    magnisReward: 18000,
    name: 'Raven',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 80, id: 'saber_tiger_rs', level: 55, maxHealthOverride: 40000 },
      ], undefined, ORGANOIDS.shadow),
    ],
  },
  rosso: {
    fragmentYield: 4,
    id: 'rosso',
    magnisReward: 8000,
    name: 'Rosso',
    zoidSets: [
      new PilotZoidSet(
        [{ attackOverride: 10, id: 'red_horn', level: 30, maxHealthOverride: 6000 }],
        [new PilotDefeatRequirement('rosso')]
      ),
      new PilotZoidSet([
        { attackOverride: 50, id: 'red_horn', level: 80, maxHealthOverride: 80000 },
      ]),
    ],
  },
  van_shield_liger: {
    fragmentYield: 4,
    id: 'van_shield_liger',
    imageId: 'van',
    magnisReward: 10000,
    name: 'Van',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 5, id: 'shield_liger', level: 30, maxHealthOverride: 1800 },
      ], undefined, ORGANOIDS.zeke_shield_liger),
    ],
  },
  verde: {
    fragmentYield: 4,
    id: 'verde',
    magnisReward: 1300,
    name: 'Verde',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 8, id: 'molga', level: 20, maxHealthOverride: 450 },
      ]),
    ],
  },
  viola: {
    fragmentYield: 4,
    id: 'viola',
    magnisReward: 2000,
    name: 'Viola',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 14, id: 'redler', level: 25, maxHealthOverride: 550 },
      ]),
    ],
  },
  viola_verde_giallo: {
    fragmentYield: 4,
    id: 'viola_verde_giallo',
    magnisReward: 4000,
    name: 'Viola, Verde & Giallo',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 8, id: 'molga', level: 20, maxHealthOverride: 1000 },
        { attackOverride: 9, id: 'molga', level: 22, maxHealthOverride: 1000 },
        { attackOverride: 14, id: 'redler', level: 25, maxHealthOverride: 1200, imageOverride: 'redler_vs' },
      ]),
    ],
  },
};
