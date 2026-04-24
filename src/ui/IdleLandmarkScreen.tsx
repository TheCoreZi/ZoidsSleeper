import { For, Show, type Component } from 'solid-js';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import '../dungeon/dungeon.css';
import { t } from '../i18n';
import { Currency } from '../models/Currency';
import type { BossPreview } from '../dungeon/DungeonSortieConfig';
import { getZoidResearch } from '../store/zoidResearchStore';
import type { City, CityAction } from '../landmark';
import { ActionDuelPilot, ActionVisitDepot, ActionVisitLab, isCityActionVisible } from '../landmark';
import { currentLandmark, landmarkBackground } from '../store/landmarkStore';
import { getCurrency } from '../store/walletStore';
import './duel-battle.css';

const IdleLandmarkScreen: Component = () => {
  const visibleActions = () => ((currentLandmark() as City).actions ?? []).filter(isCityActionVisible);
  const isShopAction = (a: CityAction) => a instanceof ActionVisitDepot || a instanceof ActionVisitLab;
  const depotActions = () => visibleActions().filter(isShopAction);
  const otherActions = () => visibleActions().filter((a) => !isShopAction(a) && !(a instanceof DungeonSortieEvent));
  const sortieAction = () => visibleActions().find((a): a is DungeonSortieEvent => a instanceof DungeonSortieEvent);
  const canAffordSortie = () => {
    const action = sortieAction();
    return action ? getCurrency(Currency.ZiMetal) >= action.entryCost : false;
  };

  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{t(`locations:${currentLandmark().id}`)}</h2>
        <div
          class="battle-area"
          style={{ 'background-image': `url('${landmarkBackground()}')`, 'background-size': 'cover' }}
        >
          <Show when={sortieAction()}>
            {(action) => (
              <div class="sortie-button-container">
                <button class="sortie-btn" disabled={!canAffordSortie()} onClick={() => action().execute()}>
                  <span>{t('ui:begin_sortie')}</span>
                  <span class="sortie-cost">
                    <img class="sortie-cost-icon" src="images/items/zi_metal.png" alt="Zi Metal" />
                    {action().entryCost.toLocaleString()}
                  </span>
                </button>
                <div class="sortie-boss-section">
                  <span class="dungeon-boss-title">{t('dungeon:possible_bosses')}</span>
                  <For each={action().getPossibleBosses()}>
                    {(preview: BossPreview) => (
                      <img
                        class={`sortie-boss-img${preview.isZoid && !getZoidResearch(preview.id) ? ' boss-silhouette' : ''}`}
                        src={preview.imageUrl}
                        alt={preview.label}
                      />
                    )}
                  </For>
                </div>
              </div>
            )}
          </Show>
          <div class="city-depot-actions">
            <For each={depotActions()}>
              {(action) => (
                <button class="city-action-btn" onClick={() => action.execute()}>
                  {action.getLabel()}
                </button>
              )}
            </For>
          </div>
          <div class="city-actions">
            <For each={otherActions()}>
              {(action) => (
                <button
                  class={action instanceof ActionDuelPilot ? 'duel-btn' : 'city-action-btn'}
                  onClick={() => action.execute()}
                >
                  {action.getLabel()}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleLandmarkScreen;
