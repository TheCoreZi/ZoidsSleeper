import { type Component, createMemo, For, Show } from 'solid-js';
import { t } from '../i18n';
import { FACTIONS } from '../models/Faction';
import {
  getZoidImage,
  ZOID_LIST,
  ZoidResearchStatus,
} from '../models/Zoid';
import { getZoidDataCount } from '../store/zoidDataStore';
import { getZoidResearch } from '../store/zoidResearchStore';
import './archive.css';

interface ZiArchivePanelProps {
  onClose: () => void;
}

const ZiArchivePanel: Component<ZiArchivePanelProps> = (props) => {
  const totalCount = Object.keys(ZOID_LIST).length;

  const archiveEntries = createMemo(() =>
    Object.keys(ZOID_LIST)
      .map((id) => ({ data: ZOID_LIST[id], id, status: getZoidResearch(id) }))
      .filter((e): e is typeof e & { status: ZoidResearchStatus } => e.status !== null)
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
  );

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
              {(entry) => <ArchiveCard id={entry.id} status={entry.status} />}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

const ArchiveCard: Component<{ id: string; status: ZoidResearchStatus }> = (props) => {
  const zoid = () => ZOID_LIST[props.id];

  return (
    <div
      class={`archive-card archive-card--${props.status}`}
      style={{ 'background-color': `${FACTIONS[zoid().faction].color}33`, 'border-color': FACTIONS[zoid().faction].color }}
    >
      <img
        class="archive-card-image"
        src={getZoidImage(props.id)}
        alt={zoid().name}
      />
      <span class="archive-card-name">{zoid().name}</span>
      <div class="archive-card-tooltip">
        <span class="archive-card-tooltip-name">{t(`ui:archive_status_${props.status}`)}</span>
        <Show when={props.status === ZoidResearchStatus.Scanned}>
          <span class="archive-card-tooltip-desc">
            {t('ui:archive_scans', { count: getZoidDataCount(props.id) })}
          </span>
        </Show>
        <Show when={props.status === ZoidResearchStatus.Created}>
          <span class="archive-card-tooltip-desc">{t('ui:archive_attack', { value: zoid().attack })}</span>
          <span class="archive-card-tooltip-desc">{t('ui:archive_hp', { value: zoid().maxHealth })}</span>
        </Show>
      </div>
    </div>
  );
};

export default ZiArchivePanel;
