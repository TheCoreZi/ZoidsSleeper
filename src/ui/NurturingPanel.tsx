import { type Component, createMemo, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { CoreType, resolveTypedCore } from '../item/ZoidCore';
import { getOwnedZoidLevel, getZoidImage, ZOID_LIST, ZoidResearchStatus } from '../models/Zoid';
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
                <div class="nurturing-available-grid">
                  <For each={availableCores()}>
                    {(core) => (
                      <button
                        class="nurturing-core-card"
                        disabled={getAvailableSlotCount() <= 0}
                        onClick={() => handlePlaceCore(core.id, core.zoidSpeciesId!)}
                      >
                        <img class="nurturing-core-image" src={core.image} alt={core.name} />
                        <span class="nurturing-core-name">{core.name}</span>
                        <span class="supplies-item-count">×{core.count}</span>
                      </button>
                    )}
                  </For>
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
                        showTooltip={false}
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
