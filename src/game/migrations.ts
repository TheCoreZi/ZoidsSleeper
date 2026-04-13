import { CAMPAIGNS } from '../campaign/campaigns';
import type { SaveData } from './Save';

export type MigrationData = Partial<SaveData> & Record<string, unknown>;

type MigrationFn = (data: MigrationData) => void;

const migrations: Record<string, MigrationFn> = {
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
