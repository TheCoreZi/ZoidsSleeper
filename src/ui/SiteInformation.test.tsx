import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'solid-js/web';
import { Save } from '../game/Save';
import { changeLocale } from '../i18n';
import { CommunityFooter, DISCORD_URL, MigrationNotice } from './SiteInformation';

const DISCORD_BACKGROUND = '#5865f2';
const DISCORD_TEXT = '#ffffff';
const MINIMUM_AA_CONTRAST = 4.5;
let dispose: (() => void) | undefined;

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

function relativeLuminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('SiteInformation', () => {
  it('meets WCAG AA text contrast in the Discord button', () => {
    expect(contrastRatio(DISCORD_TEXT, DISCORD_BACKGROUND)).toBeGreaterThanOrEqual(MINIMUM_AA_CONTRAST);
  });

  it('downloads the save from the migration notice', () => {
    const exportSave = vi.spyOn(Save, 'exportSave').mockImplementation(() => undefined);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <MigrationNotice />, root);

    root.querySelector('button')?.click();

    expect(exportSave).toHaveBeenCalledOnce();
  });

  it('links to Discord securely', () => {
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <CommunityFooter />, root);

    const link = root.querySelector('a');
    const logo = link?.querySelector('img');
    expect(link?.getAttribute('href')).toBe(DISCORD_URL);
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(logo?.getAttribute('src')).toBe('images/icons/discord.svg');
  });

  it.each([
    [
      'en',
      'Download Save',
      'Join our Discord',
      'Zoids Sleeper is an unofficial, non-profit fan game created by The Core Zi.',
      'We are changing domains. Download your save before September 30, 2026, to keep your progress.',
    ],
    [
      'es',
      'Descargar partida',
      'Únete a nuestro Discord',
      'Zoids Sleeper es un fangame no oficial y sin fines de lucro creado por The Core Zi.',
      'Vamos a cambiar de dominio. Descarga tu partida antes del 30 de septiembre de 2026 para conservar tu progreso.',
    ],
  ])('shows the %s translations', (locale, download, discord, disclaimer, notice) => {
    changeLocale(locale);
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => <><MigrationNotice /><CommunityFooter /></>, root);

    expect(root.textContent).toContain(disclaimer);
    expect(root.textContent).toContain(download);
    expect(root.textContent).toContain(discord);
    expect(root.textContent).toContain(notice);
  });
});
