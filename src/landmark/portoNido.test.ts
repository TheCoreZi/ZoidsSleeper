import { describe, expect, it } from 'vitest';

import { CAMPAIGNS } from '../campaign/campaigns';
import { getCity } from './City';
import { getDungeon } from './Dungeon';
import { getRoute } from './Route';
import { LandmarkType } from './Landmark';
import { ZOID_LIST, getZoidById } from '../models/Zoid';
import { PILOTS } from '../models/Pilot';
import { NPCS } from '../npc/Npc';
import { CampaignStartedRequirement } from '../requirement/CampaignStartedRequirement';
import { MissionCompletedRequirement } from '../requirement/MissionCompletedRequirement';
import { RouteKillRequirement } from '../requirement/RouteKillRequirement';

describe('Porto Nido landmarks', () => {
  it('porto_nido city exists with correct structure', () => {
    const city = getCity('porto_nido');
    expect(city).toBeDefined();
    expect(city!.type).toBe(LandmarkType.City);
    expect(city!.actions).toBeDefined();
    expect(city!.actions!.length).toBeGreaterThanOrEqual(3);
  });

  it('tauros_grotto dungeon exists with sortie', () => {
    const dungeon = getDungeon('tauros_grotto');
    expect(dungeon).toBeDefined();
    expect(dungeon!.type).toBe(LandmarkType.Dungeon);
    expect(dungeon!.actions).toBeDefined();
    expect(dungeon!.actions!.length).toBeGreaterThanOrEqual(1);
  });

  it('tauros_edge route exists and connects gleam_village to tauros_grotto', () => {
    const route = getRoute('tauros_edge');
    expect(route).toBeDefined();
    expect(route!.connects).toEqual(['gleam_village', 'tauros_grotto']);
    expect(route!.enemies.length).toBeGreaterThan(0);
  });

  it('south_coast route exists and connects tauros_grotto to porto_nido', () => {
    const route = getRoute('south_coast');
    expect(route).toBeDefined();
    expect(route!.connects).toEqual(['tauros_grotto', 'porto_nido']);
    expect(route!.enemies.length).toBeGreaterThan(0);
  });

  it('tauros_edge uses CampaignStartedRequirement', () => {
    const route = getRoute('tauros_edge');
    expect(route!.requirements).toBeDefined();
    expect(route!.requirements!.some((r) => r instanceof CampaignStartedRequirement)).toBe(true);
  });

  it('sommerso_trail route exists and connects porto_nido to sommerso_ruins', () => {
    const route = getRoute('sommerso_trail');
    expect(route).toBeDefined();
    expect(route!.connects).toEqual(['porto_nido', 'sommerso_ruins']);
    expect(route!.enemies.length).toBeGreaterThan(0);
    expect(route!.routeHealth).toBe(1200);
  });

  it('sommerso_trail unlocks after meet_dr_t mission', () => {
    const route = getRoute('sommerso_trail');
    expect(route!.requirements).toBeDefined();
    expect(route!.requirements!.some((r) => r instanceof MissionCompletedRequirement)).toBe(true);
  });

  it('sommerso_ruins dungeon exists with sortie', () => {
    const dungeon = getDungeon('sommerso_ruins');
    expect(dungeon).toBeDefined();
    expect(dungeon!.type).toBe(LandmarkType.Dungeon);
    expect(dungeon!.actions).toBeDefined();
    expect(dungeon!.actions!.length).toBeGreaterThanOrEqual(1);
  });

  it('sommerso_ruins unlocks after sommerso_trail kills', () => {
    const dungeon = getDungeon('sommerso_ruins');
    expect(dungeon!.requirements).toBeDefined();
    expect(dungeon!.requirements!.some((r) => r instanceof RouteKillRequirement)).toBe(true);
  });
});

describe('arcadia_guard pilot', () => {
  it('exists with correct zoid', () => {
    const pilot = PILOTS['arcadia_guard'];
    expect(pilot).toBeDefined();
    expect(pilot.zoidSets.length).toBe(1);
    expect(pilot.zoidSets[0].zoids[0].id).toBe('hammerrock');
    expect(pilot.zoidSets[0].zoids[0].imageOverride).toBe('hammerrock_zenebas');
  });
});

describe('new NPCs', () => {
  it('arcadia_guard NPC exists', () => {
    expect(NPCS['arcadia_guard']).toBeDefined();
    expect(NPCS['arcadia_guard'].dialogs.length).toBeGreaterThan(0);
  });

  it('dr_t NPC exists', () => {
    expect(NPCS['dr_t']).toBeDefined();
    expect(NPCS['dr_t'].dialogs.length).toBeGreaterThan(0);
  });
});

describe('shells_of_time campaign', () => {
  it('has 3 missions', () => {
    const campaign = CAMPAIGNS['shells_of_time'];
    expect(campaign).toBeDefined();
    expect(campaign.missions.length).toBe(9);
  });

  it('missions are in correct order', () => {
    const ids = CAMPAIGNS['shells_of_time'].missions.map((m) => m.id);
    expect(ids).toEqual([
      'head_to_porto_nido', 'fight_arcadia_guard', 'meet_dr_t', 'clear_ruins', 'meet_father',
      'father_backstory', 'clear_ruins_demo', 'clear_ruins_stray', 'survive_stray',
    ]);
  });

  it('fight_arcadia_guard has onComplete callback', () => {
    const mission = CAMPAIGNS['shells_of_time'].missions.find((m) => m.id === 'fight_arcadia_guard');
    expect(mission!.onComplete).toBeDefined();
  });
});

describe('new Zoid species', () => {
  const newZoids = ['aquadon', 'dcsj', 'giraffsworder', 'gunbeetle', 'hammerrock', 'helcat', 'hidocker', 'sea_panther', 'sinker', 'stealth_viper'];

  it.each(newZoids)('%s exists in ZOID_LIST', (id) => {
    expect(ZOID_LIST[id]).toBeDefined();
    expect(getZoidById(id).id).toBe(id);
  });

  it('all new zoids have positive stats', () => {
    for (const id of newZoids) {
      const z = ZOID_LIST[id];
      expect(z.attack).toBeGreaterThan(0);
      expect(z.maxHealth).toBeGreaterThan(0);
      expect(z.baseExp).toBeGreaterThan(0);
      expect(z.price).toBeGreaterThan(0);
    }
  });
});
