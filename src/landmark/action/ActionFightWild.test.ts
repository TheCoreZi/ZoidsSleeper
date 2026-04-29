import { describe, expect, it, vi } from 'vitest';
import { loadStatistics } from '../../store/statisticsStore';
import { WildDefeatRequirement } from '../../requirement';
import { ActionFightWild } from './ActionFightWild';

describe('ActionFightWild', () => {
  const zoids = [{ attackOverride: 70, id: 'helcat_stray', level: 55, maxHealthOverride: 20000 }];
  const reward = { magnis: 8000, zi_metal: 20 };

  it('generates id from wildId', () => {
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward);
    expect(action.id).toBe('wild-stray_helcat_wild');
  });

  it('is unlocked when no requirements', () => {
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward);
    expect(action.isUnlocked()).toBe(true);
  });

  it('is not unlocked when requirements are not met', () => {
    loadStatistics({}, {}, {});
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward, [new WildDefeatRequirement('other', 'helcat_stray')]);
    expect(action.isUnlocked()).toBe(false);
  });

  it('is not completed when no completeRequirements', () => {
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward);
    expect(action.isCompleted()).toBe(false);
  });

  it('is completed when completeRequirements are met', () => {
    loadStatistics({}, { stray_helcat_wild: 2 }, {});
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward, undefined, [new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray', 2)]);
    expect(action.isCompleted()).toBe(true);
  });

  it('calls onExecute when execute is called', () => {
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward);
    const spy = vi.fn();
    action.onExecute = spy;
    action.execute();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('does nothing when execute is called without onExecute', () => {
    const action = new ActionFightWild('stray_helcat_wild', zoids, reward);
    expect(() => action.execute()).not.toThrow();
  });
});
