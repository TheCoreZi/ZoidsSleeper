import { type Component, For, Show } from 'solid-js';
import { t } from '../i18n';
import { inventory } from '../store/inventoryStore';

interface SuppliesPanelProps {
  onClose: () => void;
}

const SuppliesPanel: Component<SuppliesPanelProps> = (props) => {
  const ownedItems = () =>
    Object.entries(inventory())
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ count, id }));

  return (
    <div class="supplies-overlay" onClick={() => props.onClose()}>
      <div class="supplies-panel" onClick={(e) => e.stopPropagation()}>
        <div class="supplies-header">
          <span class="supplies-title">{t('ui:supplies')}</span>
          <button class="supplies-close" onClick={() => props.onClose()}>
              ✕
          </button>
        </div>
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
      </div>
    </div>
  );
};

export default SuppliesPanel;
