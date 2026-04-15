import { PilotDefeatRequirement } from '../requirement';
import type { ZoidBlueprint } from '../models/Zoid';
import { PilotZoidSet } from './PilotZoidSet';

export interface Pilot {
  id: string;
  imageId?: string;
  magnisReward: number;
  name: string;
  zoidSets: PilotZoidSet[];
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
  bandit1: {
    id: 'bandit1',
    magnisReward: 3000,
    name: 'Bandit',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 1, id: 'molga', level: 5, maxHealthOverride: 250 },
      ]),
    ],
  },
  bianco: {
    id: 'bianco',
    magnisReward: 1500,
    name: 'Bianco',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 12, id: 'command_wolf', level: 25, maxHealthOverride: 700 },
      ]),
    ],
  },
  bianco_nero: {
    id: 'bianco_nero',
    magnisReward: 1200,
    name: 'Bianco & Nero',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 8, id: 'command_wolf', level: 15, maxHealthOverride: 450 },
        { attackOverride: 8, id: 'command_wolf', level: 17, maxHealthOverride: 550 },
      ]),
    ],
  },
  bul: {
    id: 'bul',
    magnisReward: 1000,
    name: 'Bul',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 5, id: 'guysack', imageOverride: 'guysack_bs', level: 5, maxHealthOverride: 1500 },
      ]),
    ],
  },
  bul_arcobaleno: {
    id: 'bul_arcobaleno',
    imageId: 'bul',
    magnisReward: 1500,
    name: 'Blu',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 8, id: 'guysack', imageOverride: 'guysack_bs', level: 20, maxHealthOverride: 1700 },
      ]),
    ],
  },
  giallo: {
    id: 'giallo',
    magnisReward: 1400,
    name: 'Giallo',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 9, id: 'molga', level: 22, maxHealthOverride: 500 },
      ]),
    ],
  },
  nero: {
    id: 'nero',
    magnisReward: 1600,
    name: 'Nero',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 10, id: 'command_wolf', level: 24, maxHealthOverride: 650 },
      ]),
    ],
  },
  rosso: {
    id: 'rosso',
    magnisReward: 8000,
    name: 'Rosso',
    zoidSets: [
      new PilotZoidSet(
        [{ attackOverride: 10, id: 'red_horn', level: 30, maxHealthOverride: 1800 }],
        [new PilotDefeatRequirement('rosso')]
      ),
      new PilotZoidSet([
        { attackOverride: 50, id: 'red_horn', level: 80, maxHealthOverride: 10000 },
      ]),
    ],
  },
  van_shield_liger: {
    id: 'van_shield_liger',
    magnisReward: 10000,
    name: 'Van',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 20, id: 'shield_liger', level: 30, maxHealthOverride: 2000 },
      ]),
    ],
  },
  verde: {
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
    id: 'viola_verde_giallo',
    magnisReward: 4000,
    name: 'Viola, Verde & Giallo',
    zoidSets: [
      new PilotZoidSet([
        { attackOverride: 8, id: 'molga', level: 20, maxHealthOverride: 450 },
        { attackOverride: 9, id: 'molga', level: 22, maxHealthOverride: 450 },
        { attackOverride: 14, id: 'redler', level: 25, maxHealthOverride: 550, imageOverride: 'redler_vs' },
      ]),
    ],
  },
};
