import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { Save, type SaveData } from './game/Save';
import GameRoot from './GameRoot';
import { Faction, FACTIONS, FACTION_THEMES } from './models/Faction';

vi.mock('./App', () => ({ default: () => <div data-testid="game">Game</div> }));

const SAVED_GAME: SaveData = {
  landmarkId: 'gleam_village',
  party: { commanderZoidId: 'garius', zoids: [{ experience: 0, id: 'garius' }] },
  version: '0.6.3',
};

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('GameRoot', () => {
  it('does not mount the game before starting a new game', () => {
    vi.spyOn(Save.prototype, 'load').mockReturnValue(null);
    const clear = vi.spyOn(Save, 'clear').mockImplementation(() => undefined);
    const root = renderGameRoot();

    expect(root.querySelector<HTMLElement>('.game-root')?.getAttribute('style'))
      .toContain(FACTIONS[Faction.Neutral].color);
    const patternZoids = root.querySelectorAll<HTMLImageElement>('.game-pattern-zoid');
    expect(patternZoids).toHaveLength(180);
    expect(patternZoids[0].src).toContain('images/zoids/');
    expect(root.querySelector('[data-testid="game"]')).toBeNull();
    root.querySelector<HTMLButtonElement>('.home-new-game')?.click();

    expect(clear).toHaveBeenCalledOnce();
    expect(root.querySelector('[data-testid="game"]')).not.toBeNull();
  });

  it('continues without clearing the save', () => {
    vi.spyOn(Save.prototype, 'load').mockReturnValue(SAVED_GAME);
    const clear = vi.spyOn(Save, 'clear').mockImplementation(() => undefined);
    const root = renderGameRoot();

    root.querySelector<HTMLButtonElement>('.home-primary-action')?.click();

    expect(clear).not.toHaveBeenCalled();
    expect(root.querySelector('[data-testid="game"]')).not.toBeNull();
  });

  it('applies the saved faction theme to the home screen', () => {
    vi.spyOn(Save.prototype, 'load').mockReturnValue({
      ...SAVED_GAME,
      playerStats: { faction: Faction.GuylosEmpire } as SaveData['playerStats'],
    });

    renderGameRoot();

    expect(document.documentElement.style.getPropertyValue('--theme-accent'))
      .toBe(FACTION_THEMES[Faction.GuylosEmpire].accent);
    expect(document.documentElement.style.getPropertyValue('--theme-button-bg'))
      .toBe(FACTION_THEMES[Faction.GuylosEmpire].buttonBg);
  });
});

function renderGameRoot(): HTMLDivElement {
  const root = document.createElement('div');
  document.body.append(root);
  dispose = render(() => <GameRoot />, root);
  return root;
}
