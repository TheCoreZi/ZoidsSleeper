import { beforeEach, describe, expect, it } from 'vitest';
import { getRouteKills, incrementRouteKills, loadStatistics } from '../src/store/statisticsStore';

describe('StatisticsStore', () => {
  beforeEach(() => {
    loadStatistics({});
  });

  it('should return 0 for a route with no kills', () => {
    expect(getRouteKills('unknown-route')).toBe(0);
  });

  it('should increment route kills', () => {
    incrementRouteKills('test-route');

    expect(getRouteKills('test-route')).toBe(1);
  });

  it('should accumulate kills across multiple increments', () => {
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');
    incrementRouteKills('test-route');

    expect(getRouteKills('test-route')).toBe(3);
  });

  it('should load statistics from saved data', () => {
    loadStatistics({ 'route-a': 10, 'route-b': 25 });

    expect(getRouteKills('route-a')).toBe(10);
    expect(getRouteKills('route-b')).toBe(25);
  });

  it('should add to loaded values when incrementing', () => {
    loadStatistics({ 'test-route': 5 });

    incrementRouteKills('test-route');

    expect(getRouteKills('test-route')).toBe(6);
  });
});
