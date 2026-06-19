import { describe, expect, it } from 'vitest';

import type { MigrationData } from './migrations';
import { migrate } from './migrations';

// Migration test data uses the OLD save format (currentMission as string)
function baseSave(overrides: Partial<MigrationData> = {}): MigrationData {
  return {
    campaigns: {
      sleeper_commander: {
        currentMission: 'talk_to_boy',
        missionNpcFlags: {},
        status: 'started',
      },
    } as unknown as MigrationData['campaigns'],
    landmarkId: 'gleam_village',
    version: '0.4.1',
    ...overrides,
  };
}

describe('migration 0.6.2', () => {
  it('converts currentMission string to object with goalState', () => {
    const data = baseSave({ version: '0.6.1' });

    migrate(data, '0.6.1');

    expect(data.campaigns!['sleeper_commander'].currentMission).toEqual({ goalState: [], id: 'talk_to_boy' });
  });

  it('does not affect saves without campaigns', () => {
    const data = baseSave({ campaigns: undefined, version: '0.6.1' });

    migrate(data, '0.6.1');

    expect(data.campaigns).toBeUndefined();
  });
});

describe('migration 0.4.5', () => {
  it('preserves existing save data without dungeonCompletions', () => {
    const data = baseSave({ version: '0.4.4' });

    migrate(data, '0.4.4');

    expect(data.dungeonCompletions).toBeUndefined();
    expect(data.campaigns!['sleeper_commander'].currentMission).toEqual({ goalState: [], id: 'talk_to_boy' });
  });
});

describe('migration 0.4.2', () => {
  it('resets completed campaign to deliver_girl', () => {
    const data = baseSave({
      campaigns: {
        sleeper_commander: {
          currentMission: 'fight_van',
          missionNpcFlags: {},
          status: 'completed',
        },
      } as unknown as MigrationData['campaigns'],
    });

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander']).toEqual({
      currentMission: { goalState: [], id: 'deliver_girl' },
      missionNpcFlags: {},
      status: 'started',
    });
  });

  it('does not affect players before fight_van', () => {
    const data = baseSave();

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander'].currentMission).toEqual({ goalState: [], id: 'talk_to_boy' });
    expect(data.campaigns!['sleeper_commander'].status).toBe('started');
  });

  it('does not affect players on fight_van', () => {
    const data = baseSave({
      campaigns: {
        sleeper_commander: {
          currentMission: 'fight_van',
          missionNpcFlags: {},
          status: 'started',
        },
      } as unknown as MigrationData['campaigns'],
    });

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander'].currentMission).toEqual({ goalState: [], id: 'fight_van' });
    expect(data.campaigns!['sleeper_commander'].status).toBe('started');
  });

  it('does not affect saves without campaign data', () => {
    const data = baseSave({ campaigns: undefined });

    migrate(data, '0.4.1');

    expect(data.campaigns).toBeUndefined();
  });

  it('renames girl npc flag to kara in missionNpcFlags', () => {
    const data = baseSave({
      campaigns: {
        sleeper_commander: {
          currentMission: 'talk_to_girl',
          missionNpcFlags: { 'sleeper_commander:girl': false },
          status: 'started',
        },
      } as unknown as MigrationData['campaigns'],
    });

    migrate(data, '0.4.1');

    const flags = data.campaigns!['sleeper_commander'].missionNpcFlags!;
    expect(flags['sleeper_commander:kara']).toBe(false);
    expect(flags['sleeper_commander:girl']).toBeUndefined();
  });
});
