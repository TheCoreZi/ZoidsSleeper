import { type Component, createMemo, createSignal, For, Show } from 'solid-js';
import { getSpeciesEvolvableByItem } from '../evolution/evolutionLookup';
import { t } from '../i18n';
import { ImportantItem, ITEMS, SyncDeviceItem, UpgradeItem } from '../item';
import { CoreType } from '../item/ZoidCore';
import { EvolutionPopupImage, PopupMessage, PopupType } from '../models/PopupMessage';
import { computeOwnedZoidStats, getZoidImage, getZoidName } from '../models/Zoid';
import { ZoidResearchStatus } from '../models/Zoid';
import { showPopup } from '../store/gameStore';
import { playerStats } from '../store/gameStore';
import { inventory, removeItem } from '../store/inventoryStore';
import { addZoidToArmy, party } from '../store/partyStore';
import { zoidCores } from '../store/zoidCoreStore';
import { zoidDataLog } from '../store/zoidDataStore';
import { ArchiveCard } from './ZiArchivePanel';
import './supplies.css';

const CORE_TYPE_VALUES = new Set<string>(Object.values(CoreType));

type SuppliesTab = 'cores' | 'items' | 'zdata';

interface SuppliesPanelProps {
  onClose: () => void;
}

const SuppliesPanel: Component<SuppliesPanelProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal<SuppliesTab>('items');
  const [selectedUpgradeItemId, setSelectedUpgradeItemId] = createSignal<string | null>(null);

  const ownedItemsByType = () => {
    const items = Object.entries(inventory()).filter(([, count]) => count > 0);
    return {
      important: items.filter(([id]) => ITEMS[id] instanceof ImportantItem).map(([id, count]) => ({ count, id })),
      sync: items.filter(([id]) => ITEMS[id] instanceof SyncDeviceItem).map(([id, count]) => ({ count, id })),
      upgrade: items.filter(([id]) => ITEMS[id] instanceof UpgradeItem).map(([id, count]) => ({ count, id })),
    };
  };
  const hasAnyItem = () => {
    const { important, sync, upgrade } = ownedItemsByType();
    return important.length > 0 || sync.length > 0 || upgrade.length > 0;
  };

  const ownedZoidData = () =>
    Object.entries(zoidDataLog())
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ count, id, name: getZoidName(id) }));

  const ownedCores = () =>
    Object.entries(zoidCores())
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const isTyped = CORE_TYPE_VALUES.has(id);
        const image = isTyped ? `images/cores/${id}.png` : getZoidImage(id);
        const name = isTyped ? t(`items:core_${id}.name`) : getZoidName(id);
        return { count, id, image, name };
      });

  const evolvableCandidates = createMemo(() => {
    const itemId = selectedUpgradeItemId();
    if (!itemId) { return []; }
    const matches = getSpeciesEvolvableByItem(itemId);
    const currentParty = party();
    const stats = playerStats();
    return matches
      .filter(({ sourceId }) => currentParty.zoids.some((z) => z.id === sourceId))
      .map(({ evolution, sourceId }) => {
        const owned = currentParty.zoids.find((z) => z.id === sourceId)!;
        const targetInParty = currentParty.zoids.some((z) => z.id === evolution.targetId);
        const ownedStats = computeOwnedZoidStats(owned, stats?.faction ?? 'neutral');
        const otherConditionsMet = evolution.isFulfilledWithItem(ownedStats, itemId);
        return { disabled: !stats?.evolvingEnabled || !otherConditionsMet, sourceId, targetId: evolution.targetId, targetInParty };
      });
  });

  function handleEvolve(sourceId: string, targetId: string): void {
    const itemId = selectedUpgradeItemId();
    if (!itemId || !playerStats()?.evolvingEnabled) { return; }
    removeItem(itemId, 1);
    addZoidToArmy(targetId);
    showPopup(new PopupMessage(
      t('ui:evolution_message', { source: getZoidName(sourceId), target: getZoidName(targetId) }),
      t('ui:evolution_title'),
      PopupType.Evolution,
      new EvolutionPopupImage(getZoidImage(sourceId), getZoidImage(targetId))
    ));
    showPopup(new PopupMessage(getZoidName(targetId), t('ui:new_zoid'), PopupType.Item, getZoidImage(targetId)));
    setSelectedUpgradeItemId(null);
  }

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
            onClick={() => { setActiveTab('items'); setSelectedUpgradeItemId(null); }}
          >
            {t('ui:tab_items')}
          </button>
          <button
            class={`supplies-tab ${activeTab() === 'zdata' ? 'supplies-tab--active' : ''}`}
            onClick={() => { setActiveTab('zdata'); setSelectedUpgradeItemId(null); }}
          >
            {t('ui:tab_zdata')}
          </button>
          <button
            class={`supplies-tab ${activeTab() === 'cores' ? 'supplies-tab--active' : ''}`}
            onClick={() => { setActiveTab('cores'); setSelectedUpgradeItemId(null); }}
          >
            {t('ui:tab_cores')}
          </button>
        </div>
        <Show when={activeTab() === 'items'}>
          <Show
            when={hasAnyItem()}
            fallback={<p class="supplies-empty">{t('ui:supplies_empty')}</p>}
          >
            <div class="supplies-items-layout">
              <div class="supplies-items-grid-wrapper">
                <Show when={ownedItemsByType().important.length > 0}>
                  <span class="supplies-section-title">{t('ui:section_important_items')}</span>
                  <div class="supplies-grid">
                    <For each={ownedItemsByType().important}>
                      {(item) => (
                        <div class="supplies-item">
                          <img class="supplies-item-icon" src={`images/items/${item.id}.png`} alt={t(`items:${item.id}.name`)} />
                          <span class="supplies-item-count">×{item.count}</span>
                          <div class="supplies-tooltip">
                            <span class="supplies-tooltip-name">{t(`items:${item.id}.name`)}</span>
                            <span class="supplies-tooltip-desc">{t(`items:${item.id}.description`)}</span>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                <Show when={ownedItemsByType().sync.length > 0}>
                  <span class="supplies-section-title">{t('ui:section_sync_tools')}</span>
                  <div class="supplies-grid">
                    <For each={ownedItemsByType().sync}>
                      {(item) => (
                        <div class="supplies-item">
                          <img class="supplies-item-icon" src={`images/items/${item.id}.png`} alt={t(`items:${item.id}.name`)} />
                          <span class="supplies-item-count">×{item.count}</span>
                          <div class="supplies-tooltip">
                            <span class="supplies-tooltip-name">{t(`items:${item.id}.name`)}</span>
                            <span class="supplies-tooltip-desc">{t(`items:${item.id}.description`)}</span>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                <Show when={ownedItemsByType().upgrade.length > 0}>
                  <span class="supplies-section-title">{t('ui:section_upgrade_items')}</span>
                  <div class="supplies-grid">
                    <For each={ownedItemsByType().upgrade}>
                      {(item) => (
                        <button
                          class={`supplies-item supplies-item--upgrade ${selectedUpgradeItemId() === item.id ? 'supplies-item--selected' : ''}`}
                          onClick={() => setSelectedUpgradeItemId((prev) => prev === item.id ? null : item.id)}
                        >
                          <img class="supplies-item-icon" src={`images/items/${item.id}.png`} alt={t(`items:${item.id}.name`)} />
                          <span class="supplies-item-count">×{item.count}</span>
                          <div class="supplies-tooltip">
                            <span class="supplies-tooltip-name">{t(`items:${item.id}.name`)}</span>
                            <span class="supplies-tooltip-desc">{t(`items:${item.id}.description`)}</span>
                          </div>
                        </button>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
              <div class={`supplies-evo-side ${selectedUpgradeItemId() ? '' : 'supplies-evo-side--hidden'}`}>
                <Show when={selectedUpgradeItemId()}>
                  <span class="supplies-evo-title">{t('ui:evolve_with_item')}</span>
                  <Show
                    when={evolvableCandidates().length > 0}
                    fallback={<p class="supplies-empty">{t('ui:no_evolvable_zoids')}</p>}
                  >
                    <div class="supplies-evo-grid">
                      <For each={evolvableCandidates()}>
                        {(candidate) => (
                          <ArchiveCard
                            class="supplies-evo-card"
                            disabled={candidate.disabled || candidate.targetInParty}
                            id={candidate.sourceId}
                            onClick={() => handleEvolve(candidate.sourceId, candidate.targetId)}
                            status={ZoidResearchStatus.Created}
                          >
                            <Show when={candidate.targetInParty}>
                              <span class="supplies-evo-hint">{t('ui:already_in_party')}</span>
                            </Show>
                          </ArchiveCard>
                        )}
                      </For>
                    </div>
                  </Show>
                </Show>
              </div>
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
        <Show when={activeTab() === 'cores'}>
          <Show
            when={ownedCores().length > 0}
            fallback={<p class="supplies-empty">{t('ui:cores_empty')}</p>}
          >
            <div class="supplies-grid">
              <For each={ownedCores()}>
                {(core) => (
                  <div class="supplies-item">
                    <img
                      class="supplies-item-icon"
                      src={core.image}
                      alt={core.name}
                    />
                    <span class="supplies-item-count">×{core.count}</span>
                    <div class="supplies-tooltip">
                      <span class="supplies-tooltip-name">{core.name}</span>
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
