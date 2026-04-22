import { describe, expect, it, vi } from 'vitest';
import '../src/i18n';
import { buildDialogLines, DialogChoice, DialogDecision, DialogScript } from '../src/dialog/Dialog';

describe('buildDialogLines', () => {
  it('should create lines with image on specific indexes', () => {
    const lines = buildDialogLines('', 'dialog:narration_discover_fione', undefined, undefined, { 1: 'images/a.png', 2: 'images/b.png' });

    expect(lines[0].image).toBeUndefined();
    expect(lines[1].image).toBe('images/a.png');
    expect(lines[2].image).toBe('images/b.png');
  });

  it('should carry image forward to subsequent lines (sticky)', () => {
    const lines = buildDialogLines('', 'dialog:narration_discover_fione', undefined, undefined, { 0: 'images/sticky.png' });

    expect(lines[0].image).toBe('images/sticky.png');
    expect(lines[1].image).toBe('images/sticky.png');
    expect(lines[2].image).toBe('images/sticky.png');
  });

  it('should clear sticky image with empty string', () => {
    const lines = buildDialogLines('', 'dialog:narration_discover_fione', undefined, undefined, { 0: 'images/sticky.png', 1: '' });

    expect(lines[0].image).toBe('images/sticky.png');
    expect(lines[1].image).toBeUndefined();
    expect(lines[2].image).toBeUndefined();
  });

  it('should create lines without images when not provided', () => {
    const lines = buildDialogLines('', 'dialog:narration_shield_liger');

    for (const line of lines) {
      expect(line.image).toBeUndefined();
    }
  });

  it('should override speaker on specific lines', () => {
    const lines = buildDialogLines('pilots:van', 'dialog:narration_discover_fione', 'images/pilots/van.png', undefined, undefined, {
      1: { speakerKey: 'pilots:fiona', portrait: 'images/pilots/fiona.png' },
    });

    expect(lines[0].speakerKey).toBe('pilots:van');
    expect(lines[0].portrait).toBe('images/pilots/van.png');
    expect(lines[1].speakerKey).toBe('pilots:fiona');
    expect(lines[1].portrait).toBe('images/pilots/fiona.png');
  });

  it('should carry speaker override forward to subsequent lines (sticky)', () => {
    const lines = buildDialogLines('pilots:van', 'dialog:narration_discover_fione', 'images/pilots/van.png', undefined, undefined, {
      1: { speakerKey: 'pilots:fiona', portrait: 'images/pilots/fiona.png' },
    });

    expect(lines[0].speakerKey).toBe('pilots:van');
    expect(lines[1].speakerKey).toBe('pilots:fiona');
    expect(lines[2].speakerKey).toBe('pilots:fiona');
    expect(lines[2].portrait).toBe('images/pilots/fiona.png');
  });

  it('should clear sticky speaker with empty speakerKey', () => {
    const lines = buildDialogLines('pilots:van', 'dialog:narration_discover_fione', 'images/pilots/van.png', undefined, undefined, {
      1: { speakerKey: 'pilots:fiona', portrait: 'images/pilots/fiona.png' },
      2: { speakerKey: '' },
    });

    expect(lines[0].speakerKey).toBe('pilots:van');
    expect(lines[1].speakerKey).toBe('pilots:fiona');
    expect(lines[2].speakerKey).toBe('pilots:van');
    expect(lines[2].portrait).toBe('images/pilots/van.png');
  });

  it('should handle speaker override without portrait', () => {
    const lines = buildDialogLines('pilots:van', 'dialog:narration_discover_fione', 'images/pilots/van.png', undefined, undefined, {
      1: { speakerKey: 'pilots:narrator' },
    });

    expect(lines[1].speakerKey).toBe('pilots:narrator');
    expect(lines[1].portrait).toBeUndefined();
  });
});

describe('DialogChoice', () => {
  it('should store all fields correctly', () => {
    const followUp = new DialogScript([]);
    const onChoose = vi.fn();
    const choice = new DialogChoice('ui:yes', followUp, 'images/icon.png', onChoose);

    expect(choice.followUp).toBe(followUp);
    expect(choice.image).toBe('images/icon.png');
    expect(choice.labelKey).toBe('ui:yes');
    expect(choice.onChoose).toBe(onChoose);
  });

  it('should allow optional image and onChoose', () => {
    const followUp = new DialogScript([]);
    const choice = new DialogChoice('ui:no', followUp);

    expect(choice.image).toBeUndefined();
    expect(choice.onChoose).toBeUndefined();
  });
});

describe('DialogDecision', () => {
  it('should store question, choices, and portrait', () => {
    const choices = [
      new DialogChoice('ui:yes', new DialogScript([])),
      new DialogChoice('ui:no', new DialogScript([])),
    ];
    const decision = new DialogDecision('dialog:join_question', choices, 'images/pilots/npc.png');

    expect(decision.choices).toBe(choices);
    expect(decision.portrait).toBe('images/pilots/npc.png');
    expect(decision.questionKey).toBe('dialog:join_question');
  });

  it('should allow optional portrait', () => {
    const decision = new DialogDecision('dialog:question', []);

    expect(decision.portrait).toBeUndefined();
  });
});

describe('DialogScript', () => {
  it('should be backward compatible without decision', () => {
    const script = new DialogScript([{ speakerKey: 'test', textKey: 'test.0' }]);

    expect(script.decision).toBeUndefined();
    expect(script.lines).toHaveLength(1);
    expect(script.reward).toBeUndefined();
  });

  it('should store decision when provided', () => {
    const decision = new DialogDecision('dialog:question', [
      new DialogChoice('ui:yes', new DialogScript([])),
    ]);
    const script = new DialogScript(
      [{ speakerKey: 'test', textKey: 'test.0' }],
      undefined,
      decision,
    );

    expect(script.decision).toBe(decision);
    expect(script.lines).toHaveLength(1);
  });

  it('should store both reward and decision', () => {
    const reward = { type: 'test' } as never;
    const decision = new DialogDecision('dialog:q', []);
    const script = new DialogScript([], reward, decision);

    expect(script.decision).toBe(decision);
    expect(script.reward).toBe(reward);
  });
});
