import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { DEFAULT_PLAYER } from '../models/Player';
import { setPlayerStats } from '../store/gameStore';
import { DialogScript, PLAYER_SPEAKER_KEY } from './Dialog';
import DialogBox from './DialogBox';

vi.mock('../i18n', () => ({
  t: (key: string, options?: Record<string, number | string>) => key === 'dialog:test'
    ? `Hello ${options?.playerName}`
    : key,
}));

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  setPlayerStats(null);
});

describe('DialogBox player name', () => {
  it('uses the player name for the speaker and interpolation', () => {
    setPlayerStats({ ...DEFAULT_PLAYER, name: 'Alice' });
    const script = new DialogScript([{
      speakerKey: PLAYER_SPEAKER_KEY,
      textKey: 'dialog:test',
    }]);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <DialogBox onComplete={vi.fn()} script={script} />, root);

    expect(root.querySelector('.dialog-speaker')?.textContent).toBe('Alice');
    expect(root.querySelector('.dialog-text')?.textContent).toBe('Hello Alice');
  });

  it('translates an NPC speaker key', () => {
    const script = new DialogScript([{
      speakerKey: 'pilots:captain_malinoff',
      textKey: 'dialog:test',
    }]);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <DialogBox onComplete={vi.fn()} script={script} />, root);

    expect(root.querySelector('.dialog-speaker')?.textContent).toBe('pilots:captain_malinoff');
  });
});
