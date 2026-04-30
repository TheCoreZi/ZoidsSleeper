import { type Component, createMemo, For, Show } from 'solid-js';
import { t } from '../i18n';
import { Currency } from '../models/Currency';
import { ZOID_LIST, ZoidResearchStatus } from '../models/Zoid';
import { isMissionCompleted } from '../store/campaignStore';
import { playerStats } from '../store/gameStore';
import { party } from '../store/partyStore';
import { getZoidDataCount } from '../store/zoidDataStore';
import { getCurrency } from '../store/walletStore';
import { ArchiveCard } from './ZiArchivePanel';
import './lab.css';

interface LabPanelProps {
  labId: string;
  onBuy: (zoidId: string) => void;
  onClose: () => void;
}

const LabPanel: Component<LabPanelProps> = (props) => {
  const availableZoids = createMemo(() =>
    Object.keys(ZOID_LIST)
      .filter((id) => getZoidDataCount(id) > 0)
      .map((id) => ({ data: ZOID_LIST[id], id }))
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
  );

  return (
    <div class="archive-overlay" onClick={() => props.onClose()}>
      <div class="archive-panel lab-panel" onClick={(e) => e.stopPropagation()}>
        <div class="archive-header">
          <span class="archive-title">{t(`locations:${props.labId}`)}</span>
          <div class="lab-wallet">
            <img class="shop-wallet-icon" src="images/items/magnis.png" alt="Magnis" />
            <span>{getCurrency(Currency.Magnis).toLocaleString()}</span>
          </div>
          <button class="archive-close" onClick={() => props.onClose()}>
            ✕
          </button>
        </div>
        <Show
          when={availableZoids().length > 0}
          fallback={<p class="archive-empty">{t('ui:lab_empty')}</p>}
        >
          <div class="archive-grid">
            <For each={availableZoids()}>
              {(entry) => {
                const isFirstFree = () => party().zoids.length === 1 && !isMissionCompleted('sleeper_commander', 'grow_army');
                const isDeployed = () => party().zoids.some((z) => z.id === entry.id) && !playerStats()?.reinforcementsEnabled;
                const canAfford = () => isFirstFree() || getCurrency(Currency.Magnis) >= entry.data.price;
                const isDisabled = () => isDeployed() || !canAfford();
                return (
                  <ArchiveCard
                    class="lab-card"
                    disabled={isDisabled()}
                    id={entry.id}
                    onClick={() => props.onBuy(entry.id)}
                    showTooltip={false}
                    status={ZoidResearchStatus.Created}
                  >
                    <Show when={isDeployed()}>
                      <div class="lab-card-price">
                        <span>{t('ui:deployed')}</span>
                      </div>
                    </Show>
                    <Show when={!isDeployed()}>
                      <Show when={isFirstFree()} fallback={
                        <div class="lab-card-price">
                          <img class="shop-price-icon" src="images/items/magnis.png" alt="" />
                          <span>{entry.data.price.toLocaleString()}</span>
                        </div>
                      }>
                        <div class="lab-card-price">
                          <span>{t('ui:free')}</span>
                        </div>
                      </Show>
                    </Show>
                    <span class="lab-card-zdata">Z-Data: {getZoidDataCount(entry.id)}</span>
                  </ArchiveCard>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default LabPanel;
