import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActionVisitLab } from '../src/landmark';
import { RouteKillRequirement } from '../src/requirement';
import { loadStatistics } from '../src/store/statisticsStore';

describe('ActionVisitLab', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should return true for isUnlocked with no requirements', () => {
    const action = new ActionVisitLab('test_lab');

    expect(action.isUnlocked()).toBe(true);
  });

  it('should return false for isUnlocked with unfulfilled requirements', () => {
    const action = new ActionVisitLab('test_lab', [new RouteKillRequirement('test-route', 10)]);

    expect(action.isUnlocked()).toBe(false);
  });

  it('should return true for isUnlocked with fulfilled requirements', () => {
    loadStatistics({}, {}, { 'test-route': 10 });
    const action = new ActionVisitLab('test_lab', [new RouteKillRequirement('test-route', 10)]);

    expect(action.isUnlocked()).toBe(true);
  });

  it('should always return false for isCompleted', () => {
    const action = new ActionVisitLab('test_lab');

    expect(action.isCompleted()).toBe(false);
  });

  it('should call onExecute when execute is called', () => {
    const action = new ActionVisitLab('test_lab');
    const spy = vi.fn();
    action.onExecute = spy;

    action.execute();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should store labId', () => {
    const action = new ActionVisitLab('jenkins_lab');

    expect(action.labId).toBe('jenkins_lab');
  });
});
