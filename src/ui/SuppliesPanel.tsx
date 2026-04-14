import { type Component, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { ZOID_LIST, getZoidImage } from '../models/Zoid';
import { inventory } from '../store/inventoryStore';
import { zoidDataLog } from '../store/zoidDataStore';
import './supplies.css';

type SuppliesTab = 'items' | 'zdata';

interface SuppliesPanelProps {
  onClose: () => void;
}

const SuppliesPanel: Component<SuppliesPanelProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal<SuppliesTab>('items');

  const ownedItems = () =>
    Object.entries(inventory())
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ count, id }));

  const ownedZoidData = () =>
    Object.entries(zoidDataLog())
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ count, id, name: ZOID_LIST[id]?.name ?? id }));

  return (
    <div class="supplies-overlay" onClick={() => props.onClose()}>
      <div class="supplies-panel" onClick={(e) => e.stopPropagation()}>
        <div class="supplies-header">
          <span class="supplies-title">{t('ui:supplies')}</span>
          <button class="supplies-close" onClick={() => props.onClose()}>
              ✕
          </button>
        </div>
        <div class="supplies-tabs">
          <button
            class={`supplies-tab ${activeTab() === 'items' ? 'supplies-tab--active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            {t('ui:tab_items')}
          </button>
          <button
            class={`supplies-tab ${activeTab() === 'zdata' ? 'supplies-tab--active' : ''}`}
            onClick={() => setActiveTab('zdata')}
          >
            {t('ui:tab_zdata')}
          </button>
        </div>
        <Show when={activeTab() === 'items'}>
          <Show
            when={ownedItems().length > 0}
            fallback={<p class="supplies-empty">{t('ui:supplies_empty')}</p>}
          >
            <div class="supplies-grid">
              <For each={ownedItems()}>
                {(item) => (
                  <div class="supplies-item">
                    <img
                      class="supplies-item-icon"
                      src={`images/items/${item.id}.png`}
                      alt={t(`items:${item.id}.name`)}
                    />
                    <span class="supplies-item-count">×{item.count}</span>
                    <div class="supplies-tooltip">
                      <span class="supplies-tooltip-name">
                        {t(`items:${item.id}.name`)}
                      </span>
                      <span class="supplies-tooltip-desc">
                        {t(`items:${item.id}.description`)}
                      </span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
        <Show when={activeTab() === 'zdata'}>
          <Show
            when={ownedZoidData().length > 0}
            fallback={<p class="supplies-empty">{t('ui:zdata_empty')}</p>}
          >
            <div class="supplies-grid">
              <For each={ownedZoidData()}>
                {(entry) => (
                  <div class="supplies-item">
                    <img
                      class="supplies-item-icon"
                      src={getZoidImage(entry.id)}
                      alt={entry.name}
                    />
                    <span class="supplies-item-count">×{entry.count}</span>
                    <div class="supplies-tooltip">
                      <span class="supplies-tooltip-name">{entry.name}</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default SuppliesPanel;
