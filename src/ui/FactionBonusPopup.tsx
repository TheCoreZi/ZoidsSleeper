import { type Component, For, Show } from 'solid-js';
import { t } from '../i18n';
import { type Faction, ALL_FACTIONS, FACTION_BONUS_TABLE, FACTIONS } from '../models/Faction';
import './faction.css';

interface FactionBonusPopupProps {
  currentFaction: Faction;
  onClose: () => void;
}

function bonusCellClass(value: number): string {
  if (value > 1) {return 'faction-bonus-cell--positive';}
  if (value < 1) {return 'faction-bonus-cell--negative';}
  return 'faction-bonus-cell--neutral';
}

function formatBonus(value: number): string {
  return `x${value.toFixed(2)}`;
}

const FactionBonusPopup: Component<FactionBonusPopupProps> = (props) => (
  <div class="faction-bonus-overlay" onClick={() => props.onClose()}>
    <div class="faction-bonus-panel" onClick={(e) => e.stopPropagation()}>
      <div class="faction-bonus-header">
        <span class="faction-bonus-title">{t('ui:faction_bonus_table')}</span>
        <button class="faction-bonus-close" onClick={() => props.onClose()}>
          ✕
        </button>
      </div>
      <div class="faction-bonus-table-wrapper">
        <table class="faction-bonus-table">
          <thead>
            <tr>
              <th class="faction-bonus-corner">
                <span class="faction-bonus-corner-col">{t('ui:faction_zoid_origin')} →</span>
                <span class="faction-bonus-corner-row">↓ {t('ui:faction')}</span>
              </th>
              <For each={ALL_FACTIONS}>
                {(faction) => (
                  <th style={{ color: FACTIONS[faction].color }}>
                    <div class="faction-bonus-col-icons">
                      <Show when={FACTIONS[faction].image}>
                        <img
                          class="faction-bonus-header-image"
                          src={FACTIONS[faction].image}
                          alt={t(`factions:${faction}`)}
                        />
                      </Show>
                      <img
                        class="faction-bonus-header-zoid"
                        src="images/zoids/molga.png"
                        alt=""
                      />
                    </div>
                    {t(`factions:${faction}`)}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={ALL_FACTIONS}>
              {(playerFaction) => (
                <tr classList={{ 'faction-bonus-current-row': playerFaction === props.currentFaction }}>
                  <td
                    class="faction-bonus-row-header"
                    style={{ color: FACTIONS[playerFaction].color }}
                  >
                    <div class="faction-bonus-row-content">
                      <Show when={FACTIONS[playerFaction].image}>
                        <img
                          class="faction-bonus-row-image"
                          src={FACTIONS[playerFaction].image}
                          alt={t(`factions:${playerFaction}`)}
                        />
                      </Show>
                      <span>{t(`factions:${playerFaction}`)}</span>
                    </div>
                  </td>
                  <For each={ALL_FACTIONS}>
                    {(zoidFaction) => {
                      const bonus = FACTION_BONUS_TABLE[playerFaction][zoidFaction];
                      return (
                        <td class={bonusCellClass(bonus)}>
                          {formatBonus(bonus)}
                        </td>
                      );
                    }}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default FactionBonusPopup;
