import { describe, expect, it } from 'vitest';
import { Faction, FACTIONS } from '../src/models/Faction';
import { calculatePartyAttack, calculatePartyMaxHealth, getZoidById, spawnZoid, buildZoid, ZOID_LIST } from '../src/models/Zoid';

describe('Zoid', () => {
  it('should create a zoid instance with full health', () => {
    const stats = buildZoid({ id: 'command_wolf', level: 1 });
    const zoid = spawnZoid(stats);

    expect(zoid.health).toBe(zoid.maxHealth);
    expect(zoid.name).toBe('Command Wolf');
  });

  it('should have a valid faction for every zoid', () => {
    const validFactions = Object.values(Faction);

    Object.values(ZOID_LIST).forEach((zoid) => {
      expect(validFactions).toContain(zoid.faction);
      expect(FACTIONS[zoid.faction]).toBeDefined();
    });
  });

  it('should have a positive price for every zoid', () => {
    Object.values(ZOID_LIST).forEach((zoid) => {
      expect(zoid.price).toBeGreaterThan(0);
    });
  });

  it.each(['gorgodos', 'red_horn', 'redler', 'spiker'])('should have %s in ZOID_LIST', (id) => {
    const zoid = getZoidById(id);

    expect(zoid).toBeDefined();
    expect(zoid.attack).toBeGreaterThan(0);
    expect(zoid.maxHealth).toBeGreaterThan(0);
  });

  it('should apply faction bonus to party attack calculation', () => {
    const party = [{ experience: 1000, id: 'shield_liger' }];
    const neutralAttack = calculatePartyAttack(party);
    const helicAttack = calculatePartyAttack(party, Faction.HelicRepublic);
    const guylosAttack = calculatePartyAttack(party, Faction.GuylosEmpire);

    expect(helicAttack).toBeGreaterThan(neutralAttack);
    expect(guylosAttack).toBeLessThan(neutralAttack);
  });

  it('should apply faction bonus to party max health calculation', () => {
    const party = [{ experience: 1000, id: 'shield_liger' }];
    const neutralHealth = calculatePartyMaxHealth(party);
    const helicHealth = calculatePartyMaxHealth(party, Faction.HelicRepublic);

    expect(helicHealth).toBeGreaterThan(neutralHealth);
  });

  it('should create independent instances from the same stats', () => {
    const stats = buildZoid({ id: 'molga', level: 20 });
    const a = spawnZoid(stats);
    const b = spawnZoid(stats);

    a.health = 0;

    expect(b.health).toBe(stats.maxHealth);
  });
});
