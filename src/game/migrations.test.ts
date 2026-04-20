import { describe, expect, it } from 'vitest';

import type { MigrationData } from './migrations';
import { migrate } from './migrations';

function baseSave(overrides: Partial<MigrationData> = {}): MigrationData {
  return {
    campaigns: {
      sleeper_commander: {
        currentMission: 'talk_to_boy',
        missionNpcFlags: {},
        status: 'started',
      },
    },
    landmarkId: 'gleam_village',
    version: '0.4.1',
    ...overrides,
  };
}

describe('migration 0.4.2', () => {
  it('resets completed campaign to deliver_girl', () => {
    const data = baseSave({
      campaigns: {
        sleeper_commander: {
          currentMission: 'fight_van',
          missionNpcFlags: {},
          status: 'completed',
        },
      },
    });

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander']).toEqual({
      currentMission: 'deliver_girl',
      missionNpcFlags: {},
      status: 'started',
    });
  });

  it('does not affect players before fight_van', () => {
    const data = baseSave();

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander'].currentMission).toBe('talk_to_boy');
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
      },
    });

    migrate(data, '0.4.1');

    expect(data.campaigns!['sleeper_commander'].currentMission).toBe('fight_van');
    expect(data.campaigns!['sleeper_commander'].status).toBe('started');
  });

  it('does not affect saves without campaign data', () => {
    const data = baseSave({ campaigns: undefined });

    migrate(data, '0.4.1');

    expect(data.campaigns).toBeUndefined();
  });
});
