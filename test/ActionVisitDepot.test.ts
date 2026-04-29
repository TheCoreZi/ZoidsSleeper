import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ITEMS } from '../src/item';
import type { ConsumableItem } from '../src/item';
import { ActionVisitDepot } from '../src/landmark';
import { RouteKillRequirement } from '../src/requirement';
import { loadStatistics } from '../src/store/statisticsStore';

describe('ActionVisitDepot', () => {
  beforeEach(() => {
    loadStatistics({}, {}, {});
  });

  it('should return true for isUnlocked with no requirements', () => {
    const action = new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem]);

    expect(action.isUnlocked()).toBe(true);
  });

  it('should return false for isUnlocked with unfulfilled requirements', () => {
    const action = new ActionVisitDepot(
      [ITEMS.core_preserver as ConsumableItem],
      [new RouteKillRequirement('test-route', 10)],
    );

    expect(action.isUnlocked()).toBe(false);
  });

  it('should return true for isUnlocked with fulfilled requirements', () => {
    loadStatistics({}, {}, { 'test-route': 10 });
    const action = new ActionVisitDepot(
      [ITEMS.core_preserver as ConsumableItem],
      [new RouteKillRequirement('test-route', 10)],
    );

    expect(action.isUnlocked()).toBe(true);
  });

  it('should always return false for isCompleted', () => {
    const action = new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem]);

    expect(action.isCompleted()).toBe(false);
  });

  it('should call onExecute when execute is called', () => {
    const action = new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem]);
    const spy = vi.fn();
    action.onExecute = spy;

    action.execute();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should store items', () => {
    const items = [ITEMS.core_preserver as ConsumableItem, ITEMS.core_saver as ConsumableItem];
    const action = new ActionVisitDepot(items);

    expect(action.items).toEqual(items);
  });

  it('should use default labelKey', () => {
    const action = new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem]);

    expect(action.labelKey).toBe('ui:visit_depot');
  });

  it('should use custom labelKey', () => {
    const action = new ActionVisitDepot([ITEMS.core_preserver as ConsumableItem], undefined, 'ui:visit_shop');

    expect(action.labelKey).toBe('ui:visit_shop');
  });
});
