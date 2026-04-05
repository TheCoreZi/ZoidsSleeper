import { beforeEach, describe, expect, it } from 'vitest';
import {
  getPilotDefeats,
  getRouteKills,
  incrementPilotDefeats,
  incrementRouteKills,
  loadStatistics,
} from '../src/store/statisticsStore';

describe('StatisticsStore - routeKills', () => {
  beforeEach(() => {
    loadStatistics({}, {});
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
    loadStatistics({ 'route-a': 10, 'route-b': 25 }, {});

    expect(getRouteKills('route-a')).toBe(10);
    expect(getRouteKills('route-b')).toBe(25);
  });

  it('should add to loaded values when incrementing', () => {
    loadStatistics({ 'test-route': 5 }, {});

    incrementRouteKills('test-route');

    expect(getRouteKills('test-route')).toBe(6);
  });
});

describe('StatisticsStore - pilotDefeats', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  it('should return 0 for a pilot with no defeats', () => {
    expect(getPilotDefeats('unknown-pilot')).toBe(0);
  });

  it('should increment pilot defeats', () => {
    incrementPilotDefeats('bandit1');

    expect(getPilotDefeats('bandit1')).toBe(1);
  });

  it('should accumulate defeats across multiple increments', () => {
    incrementPilotDefeats('bandit1');
    incrementPilotDefeats('bandit1');
    incrementPilotDefeats('bandit1');

    expect(getPilotDefeats('bandit1')).toBe(3);
  });

  it('should load pilot defeats from saved data', () => {
    loadStatistics({}, { bandit1: 2, bandit2: 5 });

    expect(getPilotDefeats('bandit1')).toBe(2);
    expect(getPilotDefeats('bandit2')).toBe(5);
  });

  it('should add to loaded values when incrementing', () => {
    loadStatistics({}, { bandit1: 3 });

    incrementPilotDefeats('bandit1');

    expect(getPilotDefeats('bandit1')).toBe(4);
  });
});
