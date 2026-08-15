import { render } from 'solid-js/web';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { changeLocale } from '../i18n';
import { experienceForLevel } from '../models/LevelType';
import { getZoidById, ZoidResearchStatus } from '../models/Zoid';
import { loadTankSlots } from '../store/nurturingStore';
import { setParty } from '../store/partyStore';
import { TankSlotSource } from '../store/TankSlot';
import ZoidDetailModal from './ZoidDetailModal';

const ZOID_ID = 'merda';
let dispose: (() => void) | undefined;

beforeEach(() => {
  changeLocale('en');
  setParty({ commanderZoidId: 'gator', zoids: [{ experience: 0, id: 'gator' }] });
  loadTankSlots([{
    fragments: 0,
    fragmentsRequired: 400,
    ownedZoid: {
      copies: 2,
      experience: experienceForLevel(100, getZoidById(ZOID_ID).levelType),
      id: ZOID_ID,
      rebornBonusPercent: 15,
      rebornCount: 3,
    },
    source: TankSlotSource.Reborn,
    zoidSpeciesId: ZOID_ID,
  }]);
});

afterEach(() => {
  dispose?.();
  dispose = undefined;
  document.body.replaceChildren();
  loadTankSlots([]);
  vi.restoreAllMocks();
});

describe('ZoidDetailModal', () => {
  it('shows owned stats when the zoid is in the nurturing tank', () => {
    const root = document.createElement('div');
    document.body.append(root);
    dispose = render(() => (
      <ZoidDetailModal id={ZOID_ID} onClose={vi.fn()} status={ZoidResearchStatus.Created} />
    ), root);

    const stats = Object.fromEntries(
      [...root.querySelectorAll('.archive-detail-stat')].map((row) => [
        row.querySelector('.archive-detail-stat-label')?.textContent,
        row.querySelector('.archive-detail-stat-value')?.textContent,
      ])
    );
    expect(stats['Times Deployed']).toBe('2');
    expect(stats['Times Nurtured']).toBe('3');
    expect(stats['Research Bonus']).toBe('15%');
    expect(stats['Current Attack']).toBeDefined();
    expect(stats['Current HP']).toBeDefined();
  });
});
