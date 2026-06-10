import { type Component, createMemo, createSignal, For, type ParentComponent, Show } from 'solid-js';
import { t } from '../i18n';
import { FACTIONS } from '../models/Faction';
import {
  getZoidImage,
  ZOID_LIST,
  ZoidResearchStatus,
} from '../models/Zoid';
import { getTerrainBorderStyle } from '../models/Terrain';
import { getZoidResearch } from '../store/zoidResearchStore';
import ZoidDetailModal from './ZoidDetailModal';
import './archive.css';

interface ZiArchivePanelProps {
  onClose: () => void;
}

const ZiArchivePanel: Component<ZiArchivePanelProps> = (props) => {
  const totalCount = Object.keys(ZOID_LIST).length;
  const [selectedZoidId, setSelectedZoidId] = createSignal<string | null>(null);

  const archiveEntries = createMemo(() =>
    Object.keys(ZOID_LIST)
      .map((id) => ({ data: ZOID_LIST[id], id, status: getZoidResearch(id) }))
      .filter((e): e is typeof e & { status: ZoidResearchStatus } => e.status !== null)
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
  );

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
          alt={zoid().name}
        />
        <span class="archive-card-name">{props.status ? zoid().name : '???'}</span>
        {props.children}
      </div>
    </button>
  );
};

export default ZiArchivePanel;
