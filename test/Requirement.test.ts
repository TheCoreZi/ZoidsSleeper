import { beforeEach, describe, expect, it } from 'vitest';
import { BattleBackground, getLandmarkHints, isLandmarkUnlocked, LandmarkType, type Landmark } from '../src/landmark';
import { RouteKillRequirement } from '../src/requirement';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';

describe('RouteKillRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  it('should not be completed when kills are insufficient', () => {
    const req = new RouteKillRequirement('test-route', 10);

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when kills reach required value', () => {
    loadStatistics({ 'test-route': 10 }, {});
    const req = new RouteKillRequirement('test-route', 10);

    expect(req.isCompleted()).toBe(true);
  });

  it('should return a descriptive hint', () => {
    const req = new RouteKillRequirement('test-route', 10);

    expect(req.hint()).toBe('Defeat 10 zoids on test-route');
  });

  it('should return current kill count as progress', () => {
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');
    const req = new RouteKillRequirement('test-route', 10);

    expect(req.progress()).toBe(3);
  });
});

describe('isLandmarkUnlocked', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  const baseLandmark: Landmark = {
    battleBackground: BattleBackground.Grass,
    id: 'test',
    name: 'Test',
    type: LandmarkType.City,
  };

  it('should return true when landmark has no requirements', () => {
    expect(isLandmarkUnlocked(baseLandmark)).toBe(true);
  });

  it('should return true when all requirements are completed', () => {
    loadStatistics({ 'test-route': 10 }, {});
    const landmark: Landmark = {
      ...baseLandmark,
      requirements: [new RouteKillRequirement('test-route', 10)],
    };

    expect(isLandmarkUnlocked(landmark)).toBe(true);
  });

  it('should return false when any requirement is not completed', () => {
    const landmark: Landmark = {
      ...baseLandmark,
      requirements: [new RouteKillRequirement('test-route', 10)],
    };

    expect(isLandmarkUnlocked(landmark)).toBe(false);
  });
});

describe('getLandmarkHints', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  it('should return hints for incomplete requirements', () => {
    const landmark: Landmark = {
      battleBackground: BattleBackground.Grass,
      id: 'test',
      name: 'Test',
      requirements: [new RouteKillRequirement('test-route', 10)],
      type: LandmarkType.City,
    };

    expect(getLandmarkHints(landmark)).toEqual(['Defeat 10 zoids on test-route']);
  });
});
