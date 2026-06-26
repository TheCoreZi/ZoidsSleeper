import { type Component, createMemo, createSignal, For, type ParentComponent, Show } from 'solid-js';
import { t } from '../i18n';
import { FACTIONS } from '../models/Faction';
import {
  getZoidImage,
  getZoidName,
  ZOID_LIST,
  ZoidResearchStatus,
} from '../models/Zoid';
import { getTerrainBorderStyle } from '../models/Terrain';
import { getZoidResearch } from '../store/zoidResearchStore';
import { formatStatLabel, SORT_CYCLE, type SortDirection, StatOption } from './StatSort';
import StatSortBar from './StatSortBar';
import ZoidDetailModal from './ZoidDetailModal';
import './archive.css';

const ARCHIVE_STAT_OPTIONS: StatOption[] = [
  StatOption.Name, StatOption.BaseAttack, StatOption.BaseHp, StatOption.CoreFragments,
];

function getArchiveStatValue(id: string, stat: StatOption): number | null {
  const data = ZOID_LIST[id];
  switch (stat) {
    case StatOption.BaseAttack: return data.attack;
    case StatOption.BaseHp: return data.maxHealth;
    case StatOption.CoreFragments: return data.coreFragments;
    default: return null;
  }
}

function getArchiveStatLabel(id: string, stat: StatOption, status: ZoidResearchStatus): string | undefined {
  if (status === ZoidResearchStatus.Seen) {return stat !== StatOption.Name ? '???' : undefined;}
  const value = getArchiveStatValue(id, stat);
  if (value === null) {return undefined;}
  return formatStatLabel(stat, value.toLocaleString());
}

function getArchiveNumericStat(id: string, stat: StatOption, status: ZoidResearchStatus): number {
  if (status === ZoidResearchStatus.Seen) {return -1;}
  return getArchiveStatValue(id, stat) ?? 0;
}

function archiveCompare(aId: string, bId: string, aStat: ZoidResearchStatus, bStat: ZoidResearchStatus, stat: StatOption): number {
  if (stat === StatOption.Name) {
    return getZoidName(bId).localeCompare(getZoidName(aId));
  }
  return getArchiveNumericStat(aId, stat, aStat) - getArchiveNumericStat(bId, stat, bStat);
}

interface ZiArchivePanelProps {
  onClose: () => void;
}

const ZiArchivePanel: Component<ZiArchivePanelProps> = (props) => {
  const totalCount = Object.keys(ZOID_LIST).length;
  const [selectedZoidId, setSelectedZoidId] = createSignal<string | null>(null);
  const [selectedStat, setSelectedStat] = createSignal<StatOption>(StatOption.Name);
  const [sortDirection, setSortDirection] = createSignal<SortDirection>('desc');

  const archiveEntries = createMemo(() => {
    const stat = selectedStat();
    const dir = sortDirection();
    return Object.keys(ZOID_LIST)
      .map((id) => ({ data: ZOID_LIST[id], id, status: getZoidResearch(id) }))
      .filter((e): e is typeof e & { status: ZoidResearchStatus } => e.status !== null)
      .sort((a, b) => {
        const cmp = archiveCompare(a.id, b.id, a.status, b.status, stat);
        return dir === 'desc' ? -cmp : cmp;
      });
  });

  const selectedEntry = () => {
    const id = selectedZoidId();
    if (!id) {return null;}
    return archiveEntries().find((e) => e.id === id) ?? null;
  };

  return (
    <div class="archive-overlay" onClick={() => props.onClose()}>
      <div class="archive-panel" onClick={(e) => e.stopPropagation()}>
        <div class="archive-header">
          <span class="archive-title">{t('ui:zi_archive')}</span>
          <span class="archive-count">{archiveEntries().length}/{totalCount}</span>
          <button class="archive-close" onClick={() => props.onClose()}>
            ✕
          </button>
        </div>
        <StatSortBar
          options={ARCHIVE_STAT_OPTIONS}
          selectedStat={selectedStat}
          onStatChange={(s) => { setSelectedStat(s); setSortDirection('desc'); }}
          sortDirection={sortDirection}
          onSortToggle={() => setSortDirection(d => SORT_CYCLE[(SORT_CYCLE.indexOf(d) + 1) % SORT_CYCLE.length])}
        />
        <Show
          when={archiveEntries().length > 0}
          fallback={<p class="archive-empty">{t('ui:archive_empty')}</p>}
        >
          <div class="archive-grid">
            <For each={archiveEntries()}>
              {(entry) => (
                <ArchiveCard
                  id={entry.id}
                  onClick={() => setSelectedZoidId(entry.id)}
                  statLabel={getArchiveStatLabel(entry.id, selectedStat(), entry.status)}
                  status={entry.status}
                />
              )}
            </For>
          </div>
        </Show>
      </div>
      <Show when={selectedEntry()}>
        {(entry) => (
          <ZoidDetailModal
            id={entry().id}
            onClose={() => setSelectedZoidId(null)}
            status={entry().status}
          />
        )}
      </Show>
    </div>
  );
};

interface ArchiveCardProps {
  class?: string;
  disabled?: boolean;
  id: string;
  onClick?: () => void;
  statLabel?: string;
  status: ZoidResearchStatus | null;
}

export const ArchiveCard: ParentComponent<ArchiveCardProps> = (props) => {
  const zoid = () => ZOID_LIST[props.id];
  const statusClass = () => props.status ? `archive-card--${props.status}` : 'archive-card--seen';

  return (
    <button
      class={`archive-card ${statusClass()} ${props.class ?? ''}`}
      disabled={props.disabled}
      style={{ 'background-color': `${FACTIONS[zoid().faction].color}33`, 'border-color': FACTIONS[zoid().faction].color }}
      onClick={() => props.onClick?.()}
    >
      <div class="archive-card-inner">
        <div class="archive-card-terrain" style={{ background: getTerrainBorderStyle(zoid().terrainTypes) }} />
        <img
          class="archive-card-image"
          src={getZoidImage(props.id)}
          alt={getZoidName(props.id)}
        />
        <span class="archive-card-name">{props.status ? getZoidName(props.id) : '???'}</span>
        <Show when={props.statLabel}>
          <span class="archive-card-stat">{props.statLabel}</span>
        </Show>
        {props.children}
      </div>
    </button>
  );
};

export default ZiArchivePanel;
