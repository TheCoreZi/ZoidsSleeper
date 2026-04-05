import { beforeEach, describe, expect, it } from 'vitest';
import { ActionFightPilot, ActionTalkToNPC, getPilot, isCityActionVisible } from '../src/landmark';
import { PilotDefeatRequirement, RouteKillRequirement } from '../src/requirement';
import { loadStatistics } from '../src/store/statisticsStore';

describe('isCityActionVisible', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  it('should return true for action without any requirements', () => {
    const action = new ActionTalkToNPC('test', [], 'Test');

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false for action with fulfilled completeRequirements', () => {
    loadStatistics({}, { bandit1: 1 });
    const action = new ActionFightPilot(getPilot('bandit1')!, 'Fight', [new PilotDefeatRequirement('bandit1', 'Bandit')]);

    expect(isCityActionVisible(action)).toBe(false);
  });

  it('should return true for action with unfulfilled completeRequirements', () => {
    const action = new ActionFightPilot(getPilot('bandit1')!, 'Fight', [new PilotDefeatRequirement('bandit1', 'Bandit')]);

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false for action with unfulfilled requirements (locked)', () => {
    const action = new ActionTalkToNPC('test', [], 'Test', undefined, [new PilotDefeatRequirement('bandit1', 'Bandit')]);

    expect(isCityActionVisible(action)).toBe(false);
  });

  it('should return true for action with fulfilled requirements and no completeRequirements', () => {
    loadStatistics({}, { bandit1: 1 });
    const action = new ActionTalkToNPC('test', [], 'Test', undefined, [new PilotDefeatRequirement('bandit1', 'Bandit')]);

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return true when requirements fulfilled and completeRequirements not fulfilled', () => {
    loadStatistics({ 'test-route': 10 }, {});
    const action = new ActionFightPilot(
      getPilot('bandit1')!,
      'Fight',
      [new PilotDefeatRequirement('bandit1', 'Bandit')],
      [new RouteKillRequirement('test-route', 10)],
    );

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false when both requirements and completeRequirements fulfilled', () => {
    loadStatistics({ 'test-route': 10 }, { bandit1: 1 });
    const action = new ActionFightPilot(
      getPilot('bandit1')!,
      'Fight',
      [new PilotDefeatRequirement('bandit1', 'Bandit')],
      [new RouteKillRequirement('test-route', 10)],
    );

    expect(isCityActionVisible(action)).toBe(false);
  });
});
