import { CAMPAIGNS } from '../campaign/campaigns';
import type { OwnedZoid } from '../models/Zoid';
import type { SaveData } from './Save';

export type MigrationData = Partial<SaveData> & Record<string, unknown>;

type MigrationFn = (data: MigrationData) => void;

const migrations: Record<string, MigrationFn> = {
  '0.4.1': (data) => {
    if (Array.isArray(data.party)) {
      const zoids = data.party as OwnedZoid[];
      const commanderZoidId = zoids.length > 0
        ? zoids.reduce((best, z) => z.experience > best.experience ? z : best).id
        : '';
      data.party = { commanderZoidId, zoids };
    }
  },
  '0.4.0': (data) => {
    const campaign = data.campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'find_van_oasis');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      data.campaigns!['sleeper_commander'] = {
        currentMission: 'find_van_oasis',
        missionNpcFlags: {},
        status: 'started',
      };
      data.landmarkId = 'wind_oasis';
      const defeats = data.pilotDefeats as Record<string, number> | undefined;
      if (defeats?.['van_shield_liger']) {
        delete defeats['van_shield_liger'];
      }
    }
  },
  '0.3.0': (data) => {
    const campaign = data.campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'maria_van_status');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      data.campaigns!['sleeper_commander'] = {
        currentMission: 'maria_van_status',
        missionNpcFlags: { 'sleeper_commander:maria_flyheight': false },
        status: 'started',
      };
      data.landmarkId = 'wind_colony';
    }
  },
  '0.2.1': (data) => {
    const inv = data.inventory as Record<string, number> | undefined;
    if (!inv?.['core_probe']) {return;}
    inv['core_preserver'] = (inv['core_preserver'] ?? 0) + inv['core_probe'];
    delete inv['core_probe'];
  },
  '0.2.0': (data) => {
    const campaign = data.campaigns?.['sleeper_commander'];
    if (!campaign) {return;}

    const missions = CAMPAIGNS.sleeper_commander.missions;
    const targetIndex = missions.findIndex((m) => m.id === 'interrogate_bandits');
    const currentIndex = missions.findIndex((m) => m.id === campaign.currentMission);
    const pastTarget = campaign.status === 'completed' || currentIndex > targetIndex;

    if (pastTarget) {
      data.campaigns!['sleeper_commander'] = {
        currentMission: 'interrogate_bandits',
        missionNpcFlags: { 'sleeper_commander:bianco': false },
        status: 'started',
      };
      data.landmarkId = 'elmia_ruins';
    }
  },
};

export function migrate(data: MigrationData, savedVersion: string): MigrationData {
  const versions = Object.keys(migrations)
    .filter((v) => v.localeCompare(savedVersion, undefined, { numeric: true }) > 0)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const version of versions) {
    migrations[version](data);
  }
  return data;
}
