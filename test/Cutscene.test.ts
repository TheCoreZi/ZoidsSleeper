import { describe, expect, it } from 'vitest';
import '../src/i18n';
import { Cutscene } from '../src/cutscene/Cutscene';
import { CUTSCENES } from '../src/cutscene/cutscenes';
import { RewardType } from '../src/reward/Reward';

describe('Cutscene', () => {
  it('should create a DialogScript with lines from the dialog key', () => {
    const cutscene = new Cutscene('narration_shield_liger', 'dialog:narration_shield_liger');

    const script = cutscene.toDialogScript();

    expect(script.lines.length).toBeGreaterThan(0);
    expect(script.lines[0].textKey).toBe('dialog:narration_shield_liger.0');
  });

  it('should attach reward to DialogScript when present', () => {
    const cutscene = CUTSCENES.narration_discover_fione;

    const script = cutscene.toDialogScript();

    expect(script.reward).toBeDefined();
    expect(script.reward!.type).toBe(RewardType.Item);
  });

  it('should have no reward when none is provided', () => {
    const cutscene = CUTSCENES.narration_shield_liger;

    const script = cutscene.toDialogScript();

    expect(script.reward).toBeUndefined();
  });

  it('should attach images to specific dialog lines', () => {
    const cutscene = new Cutscene('test', 'dialog:narration_shield_liger', undefined, { 0: 'images/test.png' });

    const script = cutscene.toDialogScript();

    expect(script.lines[0].image).toBe('images/test.png');
    expect(script.lines[1].image).toBe('images/test.png');
  });

  it('should pass speaker overrides to dialog lines', () => {
    const cutscene = new Cutscene('test', 'dialog:narration_shield_liger', undefined, undefined, {
      1: { speakerKey: 'pilots:captain_malinoff', portrait: 'images/pilots/malinoff.png' },
    });

    const script = cutscene.toDialogScript();

    expect(script.lines[0].speakerKey).toBe('');
    expect(script.lines[1].speakerKey).toBe('pilots:captain_malinoff');
    expect(script.lines[1].portrait).toBe('images/pilots/malinoff.png');
  });
});

describe('CUTSCENES catalog', () => {
  it('should contain narration_discover_fione with item reward', () => {
    const cutscene = CUTSCENES.narration_discover_fione;

    expect(cutscene.id).toBe('narration_discover_fione');
    expect(cutscene.dialogKey).toBe('dialog:narration_discover_fione');
    expect(cutscene.reward?.type).toBe(RewardType.Item);
  });

  it('should contain narration_shield_liger without reward', () => {
    const cutscene = CUTSCENES.narration_shield_liger;

    expect(cutscene.id).toBe('narration_shield_liger');
    expect(cutscene.dialogKey).toBe('dialog:narration_shield_liger');
    expect(cutscene.reward).toBeUndefined();
  });
});
