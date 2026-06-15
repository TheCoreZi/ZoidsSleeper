import { type Component, For } from 'solid-js';
import { t } from '../i18n';
import { TRANSPORT_ZOID_BONUSES } from '../models/TransportZoid';
import { getZoidImage, ZOID_LIST } from '../models/Zoid';
import { playerStats } from '../store/gameStore';
import { getAvailableTransportZoids, selectTransportZoid, transportZoidId } from '../store/nurturingStore';
import './nurturing.css';

interface TransportPickerModalProps {
  onClose: () => void;
}

const bonusColorClass = (multiplier: number): string =>
  multiplier > 1 ? 'nurturing-bonus--positive' : multiplier < 1 ? 'nurturing-bonus--negative' : '';

const formatPercent = (multiplier: number): string => `${Math.round(multiplier * 100)}%`;

const TransportPickerModal: Component<TransportPickerModalProps> = (props) => {
  const baseSlots = () => playerStats()?.nurturingSlots ?? 1;

  const getBonusEntries = (zoidId: string): { key: string; label: string; multiplier: number; value: string }[] => {
    const bonus = TRANSPORT_ZOID_BONUSES[zoidId];
    if (!bonus) {return [];}
    return [
      { key: 'fragments', label: t('ui:nurturing_transport_label_fragments'), multiplier: bonus.fragmentMultiplier, value: formatPercent(bonus.fragmentMultiplier) },
      { key: 'reborn', label: t('ui:nurturing_transport_label_reborn'), multiplier: bonus.rebornBonusMultiplier, value: formatPercent(bonus.rebornBonusMultiplier) },
      { key: 'slots', label: t('ui:nurturing_transport_label_slots'), multiplier: bonus.extraSlots + 1, value: `${baseSlots() + bonus.extraSlots}` },
    ];
  };

  const handleSelect = (id: string | null) => {
    selectTransportZoid(id);
    props.onClose();
  };

  return (
    <div class="nurturing-picker-overlay" onClick={() => props.onClose()}>
      <div class="nurturing-picker" onClick={(e) => e.stopPropagation()}>
        <div class="nurturing-picker-header">
          <span class="nurturing-picker-title">{t('ui:nurturing_select_transport')}</span>
          <button class="nurturing-picker-close" onClick={() => props.onClose()}>✕</button>
        </div>

        <div class="nurturing-transport-grid">
          <div
            class={`nurturing-transport-card ${transportZoidId() === null ? 'nurturing-transport-card--active' : ''}`}
            onClick={() => handleSelect(null)}
          >
            <div class="nurturing-transport-card-none">✕</div>
            <span class="nurturing-transport-card-name">{t('ui:nurturing_transport_none_option')}</span>
            <div class="nurturing-transport-card-table">
              <span class="nurturing-transport-card-label">{t('ui:nurturing_transport_label_fragments')}</span>
              <span class="nurturing-transport-card-value">100%</span>
              <span class="nurturing-transport-card-label">{t('ui:nurturing_transport_label_reborn')}</span>
              <span class="nurturing-transport-card-value">100%</span>
              <span class="nurturing-transport-card-label">{t('ui:nurturing_transport_label_slots')}</span>
              <span class="nurturing-transport-card-value">{baseSlots()}</span>
            </div>
          </div>
          <For each={getAvailableTransportZoids()}>
            {(zoidId) => {
              const entries = () => getBonusEntries(zoidId);
              return (
                <div
                  class={`nurturing-transport-card ${transportZoidId() === zoidId ? 'nurturing-transport-card--active' : ''}`}
                  onClick={() => handleSelect(zoidId)}
                >
                  <img class="nurturing-transport-card-image" src={getZoidImage(zoidId)} alt={ZOID_LIST[zoidId]?.name ?? ''} />
                  <span class="nurturing-transport-card-name">{ZOID_LIST[zoidId]?.name ?? zoidId}</span>
                  <div class="nurturing-transport-card-table">
                    <For each={entries()}>
                      {(entry) => (
                        <>
                          <span class="nurturing-transport-card-label">{entry.label}</span>
                          <span class={`nurturing-transport-card-value ${bonusColorClass(entry.multiplier)}`}>{entry.value}</span>
                        </>
                      )}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default TransportPickerModal;
