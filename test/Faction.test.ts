import { describe, expect, it } from 'vitest';
import { Faction, getFactionBonus } from '../src/models/Faction';

describe('getFactionBonus', () => {
  it('should return 1 for all zoid factions when player is Neutral', () => {
    const zoidFactions = Object.values(Faction);

    zoidFactions.forEach((zoidFaction) => {
      expect(getFactionBonus(Faction.Neutral, zoidFaction)).toBe(1);
    });
  });

  it('should return same-faction bonus for each faction', () => {
    expect(getFactionBonus(Faction.DarkArmy, Faction.DarkArmy)).toBe(1.20);
    expect(getFactionBonus(Faction.GuylosEmpire, Faction.GuylosEmpire)).toBe(1.25);
    expect(getFactionBonus(Faction.HelicRepublic, Faction.HelicRepublic)).toBe(1.30);
    expect(getFactionBonus(Faction.NeoZenebas, Faction.NeoZenebas)).toBe(1.25);
    expect(getFactionBonus(Faction.ZenebasEmpire, Faction.ZenebasEmpire)).toBe(1.25);
  });

  it('should penalize Helic player using enemy zoids', () => {
    expect(getFactionBonus(Faction.HelicRepublic, Faction.DarkArmy)).toBe(0.90);
    expect(getFactionBonus(Faction.HelicRepublic, Faction.NeoZenebas)).toBe(0.90);
    expect(getFactionBonus(Faction.HelicRepublic, Faction.GuylosEmpire)).toBe(0.95);
    expect(getFactionBonus(Faction.HelicRepublic, Faction.ZenebasEmpire)).toBe(0.95);
  });

  it('should give Guylos player ally bonus for DarkArmy zoids', () => {
    expect(getFactionBonus(Faction.GuylosEmpire, Faction.DarkArmy)).toBe(1.10);
  });

  it('should penalize Guylos player using Helic and NeoZenebas zoids', () => {
    expect(getFactionBonus(Faction.GuylosEmpire, Faction.HelicRepublic)).toBe(0.90);
    expect(getFactionBonus(Faction.GuylosEmpire, Faction.NeoZenebas)).toBe(0.85);
  });

  it('should give ZenebasEmpire and NeoZenebas mutual ally bonuses', () => {
    expect(getFactionBonus(Faction.ZenebasEmpire, Faction.NeoZenebas)).toBe(1.15);
    expect(getFactionBonus(Faction.NeoZenebas, Faction.ZenebasEmpire)).toBe(1.15);
  });

  it('should return 1 for Neutral zoid regardless of player faction', () => {
    const playerFactions = Object.values(Faction);

    playerFactions.forEach((pf) => {
      expect(getFactionBonus(pf, Faction.Neutral)).toBe(1);
    });
  });
});
