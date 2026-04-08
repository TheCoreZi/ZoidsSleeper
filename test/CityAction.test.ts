import { beforeEach, describe, expect, it } from 'vitest';
import { ActionFightPilot, ActionTalkToNPC, isCityActionVisible } from '../src/landmark';
import { PILOTS } from '../src/models/Pilot';
import { PilotDefeatRequirement, RouteKillRequirement } from '../src/requirement';
import { loadStatistics } from '../src/store/statisticsStore';

describe('isCityActionVisible', () => {
  beforeEach(() => {
    loadStatistics({}, {});
  });

  it('should return true for action without any requirements', () => {
    const action = new ActionTalkToNPC('boy');

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false for action with fulfilled completeRequirements', () => {
    loadStatistics({}, { bandit1: 1 });
    const action = new ActionFightPilot(PILOTS['bandit1'], undefined, [new PilotDefeatRequirement('bandit1')]);

    expect(isCityActionVisible(action)).toBe(false);
  });

  it('should return true for action with unfulfilled completeRequirements', () => {
    const action = new ActionFightPilot(PILOTS['bandit1'], undefined, [new PilotDefeatRequirement('bandit1')]);

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false for action with unfulfilled requirements (locked)', () => {
    const action = new ActionTalkToNPC('boy', [new PilotDefeatRequirement('bandit1')]);

    expect(isCityActionVisible(action)).toBe(false);
  });

  it('should return true for action with fulfilled requirements and no completeRequirements', () => {
    loadStatistics({}, { bandit1: 1 });
    const action = new ActionTalkToNPC('boy', [new PilotDefeatRequirement('bandit1')]);

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return true when requirements fulfilled and completeRequirements not fulfilled', () => {
    loadStatistics({ 'test-route': 10 }, {});
    const action = new ActionFightPilot(
      PILOTS['bandit1'],
      [new RouteKillRequirement('test-route', 10)],
      [new PilotDefeatRequirement('bandit1')],
    );

    expect(isCityActionVisible(action)).toBe(true);
  });

  it('should return false when both requirements and completeRequirements fulfilled', () => {
    loadStatistics({ 'test-route': 10 }, { bandit1: 1 });
    const action = new ActionFightPilot(
      PILOTS['bandit1'],
      [new RouteKillRequirement('test-route', 10)],
      [new PilotDefeatRequirement('bandit1')],
    );

    expect(isCityActionVisible(action)).toBe(false);
  });
});
