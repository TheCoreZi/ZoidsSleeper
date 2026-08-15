import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { Save } from '../game/Save';
import { changeLocale } from '../i18n';
import { DEFAULT_PLAYER } from '../models/Player';
import { GamePhase, playerStats, setGamePhase, setPlayerStats } from '../store/gameStore';
import SettingsMenu from './SettingsMenu';

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  setPlayerStats(null);
  vi.restoreAllMocks();
});

describe('SettingsMenu player name', () => {
  it('changes and stores the player name', () => {
    changeLocale('en');
    setGamePhase(GamePhase.Playing);
    setPlayerStats(DEFAULT_PLAYER);
    const store = vi.spyOn(Save.prototype, 'store').mockImplementation(() => undefined);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <SettingsMenu />, root);

    root.querySelector<HTMLButtonElement>('.settings-gear')!.click();
    const nameButton = root.querySelector<HTMLButtonElement>('[title="Change player name"]')!;
    expect(nameButton.textContent).toContain('Zoidbert');
    expect(nameButton.querySelector('.settings-menu-edit-icon')).not.toBeNull();
    nameButton.click();
    const input = root.querySelector<HTMLInputElement>('.player-name-input')!;
    input.value = 'Alice';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    root.querySelector<HTMLButtonElement>('.player-name-submit')!.click();

    expect(playerStats()?.name).toBe('Alice');
    expect(store).toHaveBeenCalledOnce();
  });
});
