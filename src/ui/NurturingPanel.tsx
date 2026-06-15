import { type Component, createMemo, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { CORE_EMERGE_POOLS, type CoreTypeData, CoreType, resolveTypedCore } from '../item/ZoidCore';
import { getFactionBonus } from '../models/Faction';
import { buildZoid, getOwnedZoidLevel, getZoidImage, ZOID_LIST, ZoidResearchStatus, type OwnedZoid } from '../models/Zoid';
import { DateStat, NameStat, NumericStat, type ZoidDisplayStat } from '../models/ZoidDisplayStat';
import { getZoidResearch } from '../store/zoidResearchStore';
import { playerStats } from '../store/gameStore';
import { TRANSPORT_ZOID_BONUSES } from '../models/TransportZoid';
import { completeSlot, getAvailableSlotCount, placeCore, placeReborn, tankSlots, transportZoidId } from '../store/nurturingStore';
import { party } from '../store/partyStore';
import type { TankSlot } from '../store/TankSlot';
import { TankSlotSource } from '../store/TankSlot';
import { zoidCores } from '../store/zoidCoreStore';
import CoreVisual from './CoreVisual';
import { formatStatLabel, SORT_CYCLE, type SortDirection, StatOption } from './StatSort';
import StatSortBar from './StatSortBar';
import TransportPickerModal from './TransportPickerModal';
import { ArchiveCard } from './ZiArchivePanel';
import './nurturing.css';

const NURTURING_STAT_OPTIONS: StatOption[] = [
  StatOption.Name, StatOption.DateObtained, StatOption.Attack, StatOption.Hp,
  StatOption.BaseAttack, StatOption.BaseHp, StatOption.CoreFragments, StatOption.Experience,
];

function getNurturingStatValue(zoid: OwnedZoid, stat: StatOption): ZoidDisplayStat {
  const level = getOwnedZoidLevel(zoid);
  const bonusMultiplier = getFactionBonus(playerStats()?.faction ?? 'neutral', ZOID_LIST[zoid.id].faction);
  const built = () => buildZoid({ bonusMultiplier, id: zoid.id, level, rebornBonusPercent: zoid.rebornBonusPercent });
  switch (stat) {
    case StatOption.Attack: return new NumericStat(built().attack);
    case StatOption.Attack100: return new NumericStat(buildZoid({ bonusMultiplier, id: zoid.id, level: 100, rebornBonusPercent: zoid.rebornBonusPercent }).attack);
    case StatOption.BaseAttack: return new NumericStat(ZOID_LIST[zoid.id].attack);
    case StatOption.BaseHp: return new NumericStat(ZOID_LIST[zoid.id].maxHealth);
    case StatOption.DateObtained: return new DateStat(zoid.dateObtained ?? 0);
    case StatOption.Experience: return new NumericStat(zoid.experience);
    case StatOption.Hp: return new NumericStat(built().maxHealth);
    case StatOption.Hp100: return new NumericStat(buildZoid({ bonusMultiplier, id: zoid.id, level: 100, rebornBonusPercent: zoid.rebornBonusPercent }).maxHealth);
    case StatOption.CoreFragments: return new NumericStat(ZOID_LIST[zoid.id].coreFragments);
    case StatOption.Name: return new NameStat(ZOID_LIST[zoid.id].name, built().attack, built().maxHealth);
  }
}

const CORE_TYPE_VALUES = new Set<string>(Object.values(CoreType));

const PickerTab = { Cores: 'cores', Zoids: 'zoids' } as const;
type PickerTabType = typeof PickerTab[keyof typeof PickerTab];

const NurturingPanel: Component = () => {
  const [showPicker, setShowPicker] = createSignal(false);
  const [showTransportPicker, setShowTransportPicker] = createSignal(false);
  const [pickerTab, setPickerTab] = createSignal<PickerTabType>(PickerTab.Zoids);
  const [selectedCoreId, setSelectedCoreId] = createSignal<string | null>(null);
  const [selectedStat, setSelectedStat] = createSignal<StatOption>(StatOption.Name);
  const [sortDirection, setSortDirection] = createSignal<SortDirection>('desc');

  const emptySlotCount = () => Math.max(0, getAvailableSlotCount());

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

  const rebornCandidates = createMemo(() => {
    const stat = selectedStat();
    const dir = sortDirection();
    return party().zoids
      .filter((z) => getOwnedZoidLevel(z) >= 100)
      .sort((a, b) => {
        const cmp = getNurturingStatValue(a, stat).compare(getNurturingStatValue(b, stat));
        return dir === 'desc' ? -cmp : cmp;
      });
  });

  const isReady = (slot: TankSlot) => slot.fragments >= slot.fragmentsRequired;
  const progress = (slot: TankSlot) => Math.min(100, Math.floor(slot.fragments / slot.fragmentsRequired * 100));

  const getSlotImage = (slot: TankSlot): string | null => {
    if (slot.source === TankSlotSource.Core) {return `images/cores/${slot.coreId}.png`;}
    if (slot.source === TankSlotSource.Statue) {return `images/items/${slot.zoidSpeciesId}.png`;}
    return null;
  };

  const bonusColorClass = (multiplier: number): string =>
    multiplier > 1 ? 'nurturing-bonus--positive' : multiplier < 1 ? 'nurturing-bonus--negative' : '';

  const formatPercent = (multiplier: number): string => `${Math.round(multiplier * 100)}%`;

  const getBonusEntries = (zoidId: string): { key: string; label: string; multiplier: number; value: string }[] => {
    const bonus = TRANSPORT_ZOID_BONUSES[zoidId];
    if (!bonus) {return [];}
    return [
      { key: 'fragments', label: t('ui:nurturing_transport_label_fragments'), multiplier: bonus.fragmentMultiplier, value: formatPercent(bonus.fragmentMultiplier) },
      { key: 'reborn', label: t('ui:nurturing_transport_label_reborn'), multiplier: bonus.rebornBonusMultiplier, value: formatPercent(bonus.rebornBonusMultiplier) },
    ];
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

      <div class="nurturing-transport">
        <Show when={transportZoidId()} fallback={
          <span class="nurturing-transport-none">{t('ui:nurturing_no_transport')}</span>
        }>
          {(id) => (
            <>
              <img class="nurturing-transport-image" src={getZoidImage(id())} alt={ZOID_LIST[id()]?.name ?? ''} />
              <span class="nurturing-transport-name">{ZOID_LIST[id()]?.name ?? id()}</span>
              <table class="nurturing-transport-bonuses">
                <For each={getBonusEntries(id())}>
                  {(entry) => (
                    <tr>
                      <td class="nurturing-transport-bonuses-label">{entry.label}</td>
                      <td class={`nurturing-transport-bonuses-value ${bonusColorClass(entry.multiplier)}`}>{entry.value}</td>
                    </tr>
                  )}
                </For>
              </table>
            </>
          )}
        </Show>
        <button class="nurturing-transport-btn" onClick={() => setShowTransportPicker(true)} title={t('ui:nurturing_change_transport')}>
          ⇄
        </button>
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
              <StatSortBar
                options={NURTURING_STAT_OPTIONS}
                selectedStat={selectedStat}
                onStatChange={(s) => { setSelectedStat(s); setSortDirection('desc'); }}
                sortDirection={sortDirection}
                onSortToggle={() => setSortDirection(d => SORT_CYCLE[(SORT_CYCLE.indexOf(d) + 1) % SORT_CYCLE.length])}
              />
              <Show when={rebornCandidates().length > 0} fallback={
                <p class="nurturing-empty">{t('ui:nurturing_empty_slot')}</p>
              }>
                <div class="nurturing-available-grid">
                  <For each={rebornCandidates()}>
                    {(zoid) => {
                      const stat = () => getNurturingStatValue(zoid, selectedStat());
                      return (
                        <ArchiveCard
                          disabled={party().zoids.length <= 1 || getAvailableSlotCount() <= 0}
                          id={zoid.id}
                          onClick={() => handlePlaceReborn(zoid.id)}
                          statLabel={formatStatLabel(selectedStat(), stat().display())}
                          status={ZoidResearchStatus.Created}
                        />
                      );
                    }}
                  </For>
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={showTransportPicker()}>
        <TransportPickerModal onClose={() => setShowTransportPicker(false)} />
      </Show>
    </div>
  );
};

export default NurturingPanel;
