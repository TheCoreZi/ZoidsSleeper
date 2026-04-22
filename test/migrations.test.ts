import { describe, expect, it } from 'vitest';
import { migrate } from '../src/game/migrations';

describe('migrate', () => {
  it('should return data unchanged when no migrations apply', () => {
    const data = { landmarkId: 'test', version: '0.2.1' };

    const result = migrate(data, '0.2.1');

    expect(result).toEqual({ landmarkId: 'test', version: '0.2.1' });
  });

  it('should skip migrations older than saved version', () => {
    const data = { landmarkId: 'test', version: '1.0.0' };

    const result = migrate(data, '1.0.0');

    expect(result).toEqual({ landmarkId: 'test', version: '1.0.0' });
  });

  describe('0.2.1 migration', () => {
    it('should convert core_probe inventory to core_preserver', () => {
      const data = { inventory: { core_probe: 3 }, landmarkId: 'test', version: '0.2.0' };

      migrate(data, '0.2.0');

      expect(data.inventory).toEqual({ core_preserver: 3 });
    });

    it('should merge core_probe into existing core_preserver count', () => {
      const data = { inventory: { core_preserver: 1, core_probe: 2 }, landmarkId: 'test', version: '0.2.0' };

      migrate(data, '0.2.0');

      expect(data.inventory).toEqual({ core_preserver: 3 });
    });

    it('should not fail when no inventory exists', () => {
      const data = { landmarkId: 'test', version: '0.2.0' };

      expect(() => migrate(data, '0.2.0')).not.toThrow();
    });

    it('should not change inventory without core_probe', () => {
      const data = { inventory: { core_preserver: 5 }, landmarkId: 'test', version: '0.2.0' };

      migrate(data, '0.2.0');

      expect(data.inventory).toEqual({ core_preserver: 5 });
    });
  });

  describe('0.3.0 migration', () => {
    it('should reset completed campaign to maria_van_status', () => {
      const data = {
        campaigns: {
          sleeper_commander: { currentMission: '', missionNpcFlags: {}, status: 'completed' as const },
        },
        landmarkId: 'elmia_ruins',
        version: '0.2.1',
      };

      migrate(data, '0.2.1');

      expect(data.campaigns.sleeper_commander).toEqual({
        currentMission: 'maria_van_status',
        missionNpcFlags: { 'sleeper_commander:maria_flyheight': false },
        status: 'started',
      });
      expect(data.landmarkId).toBe('wind_colony');
    });

    it('should reset campaign past maria_van_status back to it', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'talk_to_van_and_fiona',
            missionNpcFlags: {},
            status: 'started' as const,
          },
        },
        landmarkId: 'wind_oasis',
        version: '0.2.1',
      };

      migrate(data, '0.2.1');

      expect(data.campaigns.sleeper_commander.currentMission).toBe('maria_van_status');
      expect(data.landmarkId).toBe('wind_colony');
    });

    it('should not affect campaign before maria_van_status', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'interrogate_bandits',
            missionNpcFlags: {},
            status: 'started' as const,
          },
        },
        landmarkId: 'elmia_ruins',
        version: '0.2.1',
      };

      migrate(data, '0.2.1');

      expect(data.campaigns.sleeper_commander.currentMission).toBe('interrogate_bandits');
      expect(data.landmarkId).toBe('elmia_ruins');
    });

    it('should not fail when no campaign data exists', () => {
      const data = { landmarkId: 'test', version: '0.2.1' };

      expect(() => migrate(data, '0.2.1')).not.toThrow();
    });
  });

  describe('0.4.0 migration', () => {
    it('should reset completed campaign to find_van_oasis', () => {
      const data = {
        campaigns: {
          sleeper_commander: { currentMission: '', missionNpcFlags: {}, status: 'completed' as const },
        },
        landmarkId: 'wind_colony',
        pilotDefeats: { van_shield_liger: 1 },
        version: '0.3.0',
      };

      migrate(data, '0.3.0');

      expect(data.campaigns.sleeper_commander).toEqual({
        currentMission: 'find_van_oasis',
        missionNpcFlags: {},
        status: 'started',
      });
      expect(data.landmarkId).toBe('wind_oasis');
      expect(data.pilotDefeats).not.toHaveProperty('van_shield_liger');
    });

    it('should reset campaign past find_van_oasis back to it', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'fight_van',
            missionNpcFlags: {},
            status: 'started' as const,
          },
        },
        landmarkId: 'wind_oasis',
        pilotDefeats: { van_shield_liger: 2 },
        version: '0.3.0',
      };

      migrate(data, '0.3.0');

      expect(data.campaigns.sleeper_commander.currentMission).toBe('find_van_oasis');
      expect(data.landmarkId).toBe('wind_oasis');
      expect(data.pilotDefeats).not.toHaveProperty('van_shield_liger');
    });

    it('should not affect campaign before find_van_oasis', () => {
      const data = {
        campaigns: {
          sleeper_commander: {
            currentMission: 'maria_van_status',
            missionNpcFlags: {},
            status: 'started' as const,
          },
        },
        landmarkId: 'wind_colony',
        version: '0.3.0',
      };

      migrate(data, '0.3.0');

      expect(data.campaigns.sleeper_commander.currentMission).toBe('maria_van_status');
      expect(data.landmarkId).toBe('wind_colony');
    });

    it('should not fail when no campaign data exists', () => {
      const data = { landmarkId: 'test', version: '0.3.0' };

      expect(() => migrate(data, '0.3.0')).not.toThrow();
    });
  });

  describe('0.4.1 migration', () => {
    it('should convert party array to PartyData', () => {
      const data = {
        landmarkId: 'test',
        party: [{ experience: 1000, id: 'shield_liger' }, { experience: 500, id: 'molga' }],
        version: '0.4.0',
      };

      migrate(data, '0.4.0');

      expect(data.party).toEqual({
        commanderZoidId: 'shield_liger',
        zoids: [{ experience: 1000, id: 'shield_liger' }, { experience: 500, id: 'molga' }],
      });
    });

    it('should pick strongest zoid as commander', () => {
      const data = {
        landmarkId: 'test',
        party: [{ experience: 100, id: 'molga' }, { experience: 999, id: 'gator' }],
        version: '0.4.0',
      };

      migrate(data, '0.4.0');

      expect((data.party as { commanderZoidId: string }).commanderZoidId).toBe('gator');
    });

    it('should handle empty party array', () => {
      const data = {
        landmarkId: 'test',
        party: [],
        version: '0.4.0',
      };

      migrate(data, '0.4.0');

      expect(data.party).toEqual({ commanderZoidId: '', zoids: [] });
    });

    it('should not modify already-migrated party', () => {
      const data = {
        landmarkId: 'test',
        party: { commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }] },
        version: '0.4.0',
      };

      migrate(data, '0.4.0');

      expect(data.party).toEqual({ commanderZoidId: 'molga', zoids: [{ experience: 0, id: 'molga' }] });
    });
  });

  describe('0.4.3 migration', () => {
    it('should add neutral faction to playerStats', () => {
      const data = {
        landmarkId: 'test',
        playerStats: { attackMult: 1, baseHealth: 10, clickAttack: 1 },
        version: '0.4.2',
      };

      migrate(data, '0.4.2');

      expect((data.playerStats as Record<string, unknown>).faction).toBe('neutral');
    });

    it('should not overwrite existing faction', () => {
      const data = {
        landmarkId: 'test',
        playerStats: { attackMult: 1, baseHealth: 10, clickAttack: 1, faction: 'helic_republic' },
        version: '0.4.2',
      };

      migrate(data, '0.4.2');

      expect((data.playerStats as Record<string, unknown>).faction).toBe('helic_republic');
    });

    it('should not fail when no playerStats exists', () => {
      const data = { landmarkId: 'test', version: '0.4.2' };

      expect(() => migrate(data, '0.4.2')).not.toThrow();
    });
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
