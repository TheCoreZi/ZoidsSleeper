import { beforeEach, describe, expect, it } from 'vitest';
import { BattleBackground, findRouteKillRequirement, getLandmarkHints, isLandmarkUnlocked, LandmarkType, type Landmark } from '../src/landmark';
import { RouteKillRequirement } from '../src/requirement';
import { incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';

describe('RouteKillRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should not be completed when kills are insufficient', () => {
    const req = new RouteKillRequirement('test_route', 10);

    expect(req.isCompleted()).toBe(false);
  });

  it('should be completed when kills reach required value', () => {
    loadStatistics({}, {}, { 'test_route': 10 });
    const req = new RouteKillRequirement('test_route', 10);

    expect(req.isCompleted()).toBe(true);
  });

  it('should return a descriptive hint', () => {
    const req = new RouteKillRequirement('test_route', 10);

    expect(req.hint()).toBe('Defeat 10 zoids on test_route');
  });

  it('should return current kill count as progress', () => {
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    incrementRouteKills('test_route');
    const req = new RouteKillRequirement('test_route', 10);

    expect(req.progress()).toBe(3);
  });
});

describe('isLandmarkUnlocked', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
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
    loadStatistics({}, {}, { 'test_route': 10 });
    const landmark: Landmark = {
      ...baseLandmark,
      requirements: [new RouteKillRequirement('test_route', 10)],
    };

    expect(isLandmarkUnlocked(landmark)).toBe(true);
  });

  it('should return false when any requirement is not completed', () => {
    const landmark: Landmark = {
      ...baseLandmark,
      requirements: [new RouteKillRequirement('test_route', 10)],
    };

    expect(isLandmarkUnlocked(landmark)).toBe(false);
  });
});

describe('findRouteKillRequirement', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  const baseLandmark: Landmark = {
    battleBackground: BattleBackground.Grass,
    id: 'test',
    name: 'Test',
    type: LandmarkType.City,
  };

  it('should find a kill requirement matching the route id', () => {
    const landmarks: Landmark[] = [
      { ...baseLandmark, id: 'city_a', requirements: [new RouteKillRequirement('route_a', 10)] },
      { ...baseLandmark, id: 'city_b', requirements: [new RouteKillRequirement('route_b', 5)] },
    ];

    const result = findRouteKillRequirement(landmarks, 'route_b');

    expect(result).toBeInstanceOf(RouteKillRequirement);
    expect(result?.routeId).toBe('route_b');
    expect(result?.requiredValue).toBe(5);
  });

  it('should return undefined when no landmark has a matching requirement', () => {
    const landmarks: Landmark[] = [
      { ...baseLandmark, id: 'city_a', requirements: [new RouteKillRequirement('route_a', 10)] },
    ];

    expect(findRouteKillRequirement(landmarks, 'unknown_route')).toBeUndefined();
  });

  it('should find requirements across different landmark types', () => {
    const city: Landmark = { ...baseLandmark, id: 'city', requirements: [new RouteKillRequirement('city_route', 10)] };
    const dungeon: Landmark = { ...baseLandmark, id: 'dungeon', type: LandmarkType.Dungeon, requirements: [new RouteKillRequirement('dungeon_route', 10)] };

    expect(findRouteKillRequirement([city, dungeon], 'dungeon_route')?.routeId).toBe('dungeon_route');
  });
});

describe('getLandmarkHints', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should return hints for incomplete requirements', () => {
    const landmark: Landmark = {
      battleBackground: BattleBackground.Grass,
      id: 'test',
      name: 'Test',
      requirements: [new RouteKillRequirement('test_route', 10)],
      type: LandmarkType.City,
    };

    expect(getLandmarkHints(landmark)).toEqual(['Defeat 10 zoids on test_route']);
  });
});
