import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { Save, type SaveData } from '../game/Save';
import { changeLocale } from '../i18n';
import { Faction, FACTIONS } from '../models/Faction';
import HomeScreen from './HomeScreen';

const SAVED_GAME: SaveData = {
  landmarkId: 'gleam_village',
  party: {
    commanderZoidId: 'garius',
    zoids: [
      { experience: 0, id: 'garius' },
      { experience: 0, id: 'molga' },
    ],
  },
  playerStats: {
    attackMult: 1,
    baseHealth: 10,
    clickAttack: 1,
    evolvingEnabled: false,
    faction: Faction.HelicRepublic,
    name: 'Alice',
    nurturingSlots: 0,
    organoidId: 'beacon',
    reinforcementsEnabled: false,
  },
  version: '0.6.3',
};

let dispose: (() => void) | undefined;

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  changeLocale('en');
  vi.restoreAllMocks();
});

describe('HomeScreen', () => {
  it('shows the new and load game actions without a save', () => {
    const onNewGame = vi.fn();
    const root = renderHome(null, vi.fn(), onNewGame);

    expect(root.textContent).toContain(
      'Unleash the power of Zoids. Shape the legends.'
    );
    expect(root.querySelector('.home-save-card')).toBeNull();
    expect(root.textContent).toContain('Load Game');
    root.querySelector<HTMLButtonElement>('.home-new-game')?.click();
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('loads a game from a save file', async () => {
    const importSave = vi.spyOn(Save, 'importSave').mockResolvedValue(true);
    const root = renderHome(null);
    const file = new File(['save'], 'save.txt', { type: 'text/plain' });
    const input = root.querySelector<HTMLInputElement>('.home-save-file')!;
    Object.defineProperty(input, 'files', { value: [file] });

    input.dispatchEvent(new Event('change', { bubbles: true }));

    await vi.waitFor(() => expect(importSave).toHaveBeenCalledWith(file));
  });

  it('confirms before loading over a saved game', () => {
    const root = renderHome(SAVED_GAME);

    root.querySelector<HTMLButtonElement>('.home-load-game')?.click();

    expect(root.querySelector('.home-confirm-load-game')).not.toBeNull();
  });

  it('shows the saved game details', () => {
    const root = renderHome(SAVED_GAME);

    expect(root.textContent).toContain('Alice');
    expect(root.textContent).toContain('Gleam Village');
    expect(root.textContent).toContain('2 Zoids');
  });

  it('uses the neutral icon when the saved faction is invalid', () => {
    const save = {
      ...SAVED_GAME,
      playerStats: { ...SAVED_GAME.playerStats!, faction: 'invalid' as Faction },
    };
    const root = renderHome(save);

    expect(root.querySelector<HTMLImageElement>('.home-save-icon')?.src)
      .toContain(FACTIONS[Faction.Neutral].image);
  });

  it('shows small faction, commander, and Beacon images', () => {
    const root = renderHome(SAVED_GAME);
    const images = [...root.querySelectorAll<HTMLImageElement>('.home-save-icon')];

    expect(images).toHaveLength(3);
    expect(images[0].src).toContain(FACTIONS[Faction.HelicRepublic].image);
    expect(images[1].src).toContain('images/zoids/garius.png');
    expect(images[2].src).toContain('images/characters/beacon_full.png');
    expect(images.every((image) => image.alt.length > 0 && image.title.length > 0)).toBe(true);
  });

  it('hides Beacon when it has not joined the player', () => {
    const save = {
      ...SAVED_GAME,
      playerStats: { ...SAVED_GAME.playerStats!, organoidId: undefined },
    };
    const root = renderHome(save);

    expect(root.querySelectorAll('.home-save-icon')).toHaveLength(2);
    expect(root.querySelector('img[src="images/characters/beacon_full.png"]')).toBeNull();
  });

  it('continues a saved game', () => {
    const onContinue = vi.fn();
    const root = renderHome(SAVED_GAME, onContinue);

    root.querySelector<HTMLButtonElement>('.home-primary-action')?.click();

    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('confirms before replacing a saved game', () => {
    const onNewGame = vi.fn();
    const root = renderHome(SAVED_GAME, vi.fn(), onNewGame);

    root.querySelector<HTMLButtonElement>('.home-new-game')?.click();
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.home-confirmation-actions button')?.click();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(onNewGame).not.toHaveBeenCalled();

    root.querySelector<HTMLButtonElement>('.home-new-game')?.click();
    root.querySelector<HTMLButtonElement>('.home-confirm-new-game')?.click();
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('changes the home screen language', () => {
    const root = renderHome(null);

    root.querySelector<HTMLButtonElement>('.home-language-toggle')?.click();
    expect(root.textContent).toContain('🇺🇸');
    expect(root.textContent).toContain('🇪🇸');
    [...root.querySelectorAll<HTMLButtonElement>('.home-language')]
      .find((button) => button.textContent?.includes('Español'))
      ?.click();

    expect(root.textContent).toContain(
      'Libera el poder de los Zoids. Forja las leyendas.'
    );
    expect(root.textContent).toContain('Nueva partida');
    expect(root.querySelector('.home-language-dropdown')).toBeNull();
  });
});

function renderHome(
  save: SaveData | null,
  onContinue = vi.fn(),
  onNewGame = vi.fn()
): HTMLDivElement {
  const root = document.createElement('div');
  document.body.append(root);
  dispose = render(() => (
    <HomeScreen save={save} onContinue={onContinue} onNewGame={onNewGame} />
  ), root);
  return root;
}
