import { type Component, createMemo, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { CORE_EMERGE_POOLS, type CoreTypeData, CoreType, resolveTypedCore } from '../item/ZoidCore';
import { getOwnedZoidLevel, getZoidImage, ZOID_LIST, ZoidResearchStatus } from '../models/Zoid';
import { getZoidResearch } from '../store/zoidResearchStore';
import { playerStats } from '../store/gameStore';
import { completeSlot, getAvailableSlotCount, placeCore, placeReborn, tankSlots } from '../store/nurturingStore';
import { party } from '../store/partyStore';
import type { TankSlot } from '../store/TankSlot';
import { TankSlotSource } from '../store/TankSlot';
import { zoidCores } from '../store/zoidCoreStore';
import CoreVisual from './CoreVisual';
import { ArchiveCard } from './ZiArchivePanel';
import './nurturing.css';

const CORE_TYPE_VALUES = new Set<string>(Object.values(CoreType));

const PickerTab = { Cores: 'cores', Zoids: 'zoids' } as const;
type PickerTabType = typeof PickerTab[keyof typeof PickerTab];

const NurturingPanel: Component = () => {
  const [showPicker, setShowPicker] = createSignal(false);
  const [pickerTab, setPickerTab] = createSignal<PickerTabType>(PickerTab.Zoids);
  const [selectedCoreId, setSelectedCoreId] = createSignal<string | null>(null);

  const emptySlotCount = () => Math.max(0, (playerStats()?.nurturingSlots ?? 1) - tankSlots().length);

  const availableCores = createMemo(() => {
    const cores = zoidCores();
    return Object.entries(cores)
      .filter(([, count]) => count > 0)
      .map(([id, count]) => {
        const isTyped = CORE_TYPE_VALUES.has(id);
        const zoidSpeciesId = isTyped ? resolveTypedCore(id as CoreType) : id;
        const image = isTyped ? `images/cores/${id}.png` : getZoidImage(id);
        const name = isTyped ? t(`items:core_${id}.name`) : (ZOID_LIST[id]?.name ?? id);
        return { count, id, image, name, zoidSpeciesId };
      })
      .filter((c) => c.zoidSpeciesId !== null);
  });

  function isRevealed(zoidId: string): boolean {
    const status = getZoidResearch(zoidId);
    return status === ZoidResearchStatus.Scanned || status === ZoidResearchStatus.Created;
  }

  function getEligiblePool(coreId: string): { zoidSpeciesId: string }[] {
    const poolData = (CORE_EMERGE_POOLS as Record<string, CoreTypeData | undefined>)[coreId];
    if (poolData) {
      return poolData.pool.filter((e) => !e.requirement || e.requirement.isCompleted());
    }
    if (ZOID_LIST[coreId]) {
      return [{ zoidSpeciesId: coreId }];
    }
    return [];
  }

  const selectedCorePool = createMemo(() => {
    const coreId = selectedCoreId();
    if (!coreId) {
      return null;
    }
    const entries = getEligiblePool(coreId);
    if (entries.length === 0) {
      return null;
    }
    const chance = Math.round(10000 / entries.length) / 100;
    return entries.map(({ zoidSpeciesId }) => ({
      chance,
      image: isRevealed(zoidSpeciesId) ? getZoidImage(zoidSpeciesId) : null,
      name: isRevealed(zoidSpeciesId) ? (ZOID_LIST[zoidSpeciesId]?.name ?? zoidSpeciesId) : '???',
    }));
  });

  const rebornCandidates = createMemo(() =>
    party().zoids.filter((z) => getOwnedZoidLevel(z) >= 100)
  );

  const isReady = (slot: TankSlot) => slot.fragments >= slot.fragmentsRequired;
  const progress = (slot: TankSlot) => Math.min(100, Math.floor(slot.fragments / slot.fragmentsRequired * 100));

  const getSlotImage = (slot: TankSlot): string | null => {
    if (slot.source === TankSlotSource.Core) {return `images/cores/${slot.coreId}.png`;}
    if (slot.source === TankSlotSource.Statue) {return `images/items/${slot.zoidSpeciesId}.png`;}
    return null;
  };

  const handlePlaceCore = (coreId: string, zoidSpeciesId: string) => {
    placeCore(coreId, zoidSpeciesId);
  };

  const handlePlaceReborn = (zoidId: string) => {
    placeReborn(zoidId);
  };

  return (
    <div class="nurturing-panel">
      <div class="nurturing-header">
        <span class="nurturing-title">{t('ui:nurturing_tank')}</span>
      </div>

      <div class="nurturing-tank-grid">
        <For each={tankSlots()}>
          {(slot, index) => (
            <div class="nurturing-slot">
              <Show when={getSlotImage(slot)} fallback={
                <CoreVisual
                  class={isReady(slot) ? 'nurturing-slot-image--ready' : ''}
                  speciesId={slot.zoidSpeciesId}
                />
              }>
                {(src) => <img class={`nurturing-slot-image ${isReady(slot) ? 'nurturing-slot-image--ready' : ''}`} src={src()} alt="" />}
              </Show>
              <Show when={isReady(slot) && slot.source !== TankSlotSource.Statue} fallback={
                <>
                  <div class="nurturing-progress-bar">
                    <div
                      class="nurturing-progress-fill"
                      style={{ width: `${progress(slot)}%` }}
                    />
                  </div>
                  <span class="nurturing-progress-text">
                    {t('ui:nurturing_fragments', { current: slot.fragments, required: slot.fragmentsRequired })}
                  </span>
                </>
              }>
                <button class="nurturing-complete-btn" onClick={() => completeSlot(index())}>
                  {t('ui:nurturing_complete')}
                </button>
              </Show>
            </div>
          )}
        </For>
        <For each={Array.from({ length: emptySlotCount() })}>
          {() => (
            <button
              class="nurturing-slot nurturing-slot--empty"
              disabled={availableCores().length === 0 && rebornCandidates().length === 0}
              onClick={() => setShowPicker(true)}
            >
              <span class="nurturing-add-icon">+</span>
              <span>{t('ui:nurturing_empty_slot')}</span>
            </button>
          )}
        </For>
      </div>

      <Show when={showPicker()}>
        <div class="nurturing-picker-overlay" onClick={() => setShowPicker(false)}>
          <div class="nurturing-picker" onClick={(e) => e.stopPropagation()}>
            <div class="nurturing-picker-header">
              <span class="nurturing-picker-title">{t('ui:nurturing_send_to_tank')}</span>
              <button class="nurturing-picker-close" onClick={() => setShowPicker(false)}>✕</button>
            </div>

            <div class="nurturing-picker-tabs">
              <button
                class={`nurturing-picker-tab ${pickerTab() === PickerTab.Zoids ? 'nurturing-picker-tab--active' : ''}`}
                onClick={() => setPickerTab(PickerTab.Zoids)}
              >
                {t('ui:zoids')}
              </button>
              <button
                class={`nurturing-picker-tab ${pickerTab() === PickerTab.Cores ? 'nurturing-picker-tab--active' : ''}`}
                onClick={() => setPickerTab(PickerTab.Cores)}
              >
                {t('ui:tab_cores')}
              </button>
            </div>

            <Show when={pickerTab() === PickerTab.Cores}>
              <Show when={availableCores().length > 0} fallback={
                <p class="nurturing-empty">{t('ui:cores_empty')}</p>
              }>
                <div class="nurturing-cores-layout">
                  <div class="nurturing-cores-grid-wrapper">
                    <div class="nurturing-available-grid">
                      <For each={availableCores()}>
                        {(core) => (
                          <button
                            class={`nurturing-core-card ${selectedCoreId() === core.id ? 'nurturing-core-card--selected' : ''}`}
                            onClick={() => setSelectedCoreId((prev) => prev === core.id ? null : core.id)}
                          >
                            <img class="nurturing-core-image" src={core.image} alt={core.name} />
                            <span class="nurturing-core-name">{core.name}</span>
                            <span class="supplies-item-count">×{core.count}</span>
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                  <div class={`nurturing-pool-table ${selectedCorePool() ? '' : 'nurturing-pool-table--hidden'}`}>
                    <Show when={availableCores().find((c) => c.id === selectedCoreId())}>
                      {(core) => (
                        <>
                          <div class="nurturing-pool-core-header">
                            <img class="nurturing-pool-core-image" src={core().image} alt={core().name} />
                            <span class="nurturing-pool-core-name">{core().name}</span>
                          </div>
                          <span class="nurturing-pool-title">{t('ui:core_pool')}</span>
                          <table class="nurturing-pool-entries">
                            <For each={selectedCorePool()!}>
                              {(entry) => (
                                <tr class="nurturing-pool-row">
                                  <td>
                                    {entry.image
                                      ? <img class="nurturing-pool-zoid-image" src={entry.image} alt={entry.name} />
                                      : <div class="nurturing-pool-zoid-unknown" />}
                                  </td>
                                  <td class="nurturing-pool-zoid-name">{entry.name}</td>
                                  <td class="nurturing-pool-chance">{entry.chance}%</td>
                                </tr>
                              )}
                            </For>
                          </table>
                          <button
                            class="nurturing-pool-place-btn"
                            disabled={getAvailableSlotCount() <= 0}
                            onClick={() => handlePlaceCore(core().id, core().zoidSpeciesId!)}
                          >
                            {t('ui:nurturing_place_core')}
                          </button>
                        </>
                      )}
                    </Show>
                  </div>
                </div>
              </Show>
            </Show>

            <Show when={pickerTab() === PickerTab.Zoids}>
              <Show when={rebornCandidates().length > 0} fallback={
                <p class="nurturing-empty">{t('ui:nurturing_empty_slot')}</p>
              }>
                <div class="nurturing-available-grid">
                  <For each={rebornCandidates()}>
                    {(zoid) => (
                      <ArchiveCard
                        disabled={party().zoids.length <= 1 || getAvailableSlotCount() <= 0}
                        id={zoid.id}
                        onClick={() => handlePlaceReborn(zoid.id)}
                        status={ZoidResearchStatus.Created}
                      />
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default NurturingPanel;
