import { For, type Component } from 'solid-js';
import { t } from '../i18n';
import type { City } from '../landmark';
import { ActionVisitDepot, isCityActionVisible } from '../landmark';
import { currentLandmark, landmarkBackground } from '../store/landmarkStore';

const IdleLandmarkScreen: Component = () => {
  const visibleActions = () => ((currentLandmark() as City).actions ?? []).filter(isCityActionVisible);
  const depotActions = () => visibleActions().filter((a) => a instanceof ActionVisitDepot);
  const otherActions = () => visibleActions().filter((a) => !(a instanceof ActionVisitDepot));

  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{t(`locations:${currentLandmark().id}`)}</h2>
        <div
          class="battle-area"
          style={{ 'background-image': `url('${landmarkBackground()}')`, 'background-size': 'cover' }}
        >
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
