import { describe, expect, it } from 'vitest';
import '../src/i18n';
import { buildDialogLines } from '../src/story/Dialog';

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
});
