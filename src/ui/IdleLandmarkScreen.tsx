import { For, Show, type Component } from 'solid-js';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import '../dungeon/dungeon.css';
import { t } from '../i18n';
import { Currency } from '../models/Currency';
import type { City, CityAction } from '../landmark';
import { ActionVisitDepot, ActionVisitLab, isCityActionVisible } from '../landmark';
import { currentLandmark, landmarkBackground } from '../store/landmarkStore';
import { getCurrency } from '../store/walletStore';

const IdleLandmarkScreen: Component = () => {
  const visibleActions = () => ((currentLandmark() as City).actions ?? []).filter(isCityActionVisible);
  const isShopAction = (a: CityAction) => a instanceof ActionVisitDepot || a instanceof ActionVisitLab;
  const depotActions = () => visibleActions().filter(isShopAction);
  const otherActions = () => visibleActions().filter((a) => !isShopAction(a) && !(a instanceof DungeonSortieEvent));
  const sortieAction = () => visibleActions().find((a): a is DungeonSortieEvent => a instanceof DungeonSortieEvent);
  const canAffordSortie = () => {
    const action = sortieAction();
    return action ? getCurrency(Currency.Magnis) >= action.entryCost : false;
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
                    <img class="sortie-cost-icon" src="images/items/magnis.png" alt="Magnis" />
                    {action().entryCost.toLocaleString()}
                  </span>
                </button>
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
                <button class="city-action-btn" onClick={() => action.execute()}>
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
