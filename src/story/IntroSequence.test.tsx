import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { DEFAULT_PLAYER } from '../models/Player';
import { playerStats, setPlayerStats } from '../store/gameStore';
import IntroSequence from './IntroSequence';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  setPlayerStats(null);
});

describe('IntroSequence player name', () => {
  it('asks for the name before the planet introduction', () => {
    setPlayerStats(DEFAULT_PLAYER);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <IntroSequence onComplete={vi.fn()} />, root);

    expect(root.querySelector('.player-name-form')).not.toBeNull();
    expect(root.querySelector('.intro-text')).toBeNull();

    const input = root.querySelector<HTMLInputElement>('.player-name-input')!;
    input.value = 'Alice';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    root.querySelector<HTMLButtonElement>('.player-name-submit')!.click();

    expect(playerStats()?.name).toBe('Alice');
    expect(root.querySelector('.intro-text')).not.toBeNull();
  });
});
