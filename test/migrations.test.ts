import { describe, expect, it } from 'vitest';
import { migrate } from '../src/game/migrations';

describe('migrate', () => {
  it('should return data unchanged when no migrations apply', () => {
    const data = { landmarkId: 'test', version: '0.2.0' };

    const result = migrate(data, '0.2.0');

    expect(result).toEqual({ landmarkId: 'test', version: '0.2.0' });
  });

  it('should skip migrations older than saved version', () => {
    const data = { landmarkId: 'test', version: '1.0.0' };

    const result = migrate(data, '1.0.0');

    expect(result).toEqual({ landmarkId: 'test', version: '1.0.0' });
  });

  describe('0.2.0 migration', () => {
    it('should reset completed campaign to interrogate_bandits', () => {
      const data = {
        campaigns: {
          sleeper_commander: { currentMission: '', missionNpcFlags: {}, status: 'completed' as const },
        },
        landmarkId: 'wind_colony',
        version: '0.1.0',
      };

      migrate(data, '0.1.0');

      expect(data.campaigns.sleeper_commander).toEqual({
        currentMission: 'interrogate_bandits',
        missionNpcFlags: { 'sleeper_commander:bianco': false },
        status: 'started',
      });
      expect(data.landmarkId).toBe('elmia_ruins');
    });

    it('should reset campaign past interrogate_bandits back to it', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'maria_van_status',
            missionNpcFlags: { 'sleeper_commander:maria_flyheight': false },
            status: 'started' as const,
          },
        },
        landmarkId: 'wind_colony',
        version: '0.1.0',
      };

      migrate(data, '0.1.0');

      expect(data.campaigns.sleeper_commander).toEqual({
        currentMission: 'interrogate_bandits',
        missionNpcFlags: { 'sleeper_commander:bianco': false },
        status: 'started',
      });
      expect(data.landmarkId).toBe('elmia_ruins');
    });

    it('should not affect campaign before interrogate_bandits', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'defeat_bul',
            missionNpcFlags: {},
            status: 'started' as const,
          },
        },
        landmarkId: 'wind_colony',
        version: '0.1.0',
      };

      migrate(data, '0.1.0');

      expect(data.campaigns.sleeper_commander.currentMission).toBe('defeat_bul');
      expect(data.landmarkId).toBe('wind_colony');
    });

    it('should not fail when no campaign data exists', () => {
      const data = { landmarkId: 'test', version: '0.1.0' };

      expect(() => migrate(data, '0.1.0')).not.toThrow();
    });
  });
});
