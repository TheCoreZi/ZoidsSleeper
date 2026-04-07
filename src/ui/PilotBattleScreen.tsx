import { For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { getPilotImage } from '../models/Pilot';
import { getZoidImage } from '../models/Zoid';
import {
  enemyZoid,
  pilotEnemyProgress,
  pilotInfo,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
  pilotZoidIds,
  showClickHint,
} from '../store/gameStore';
import { battleBackground } from '../store/landmarkStore';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerHealthBar from './PlayerHealthBar';
import PlayerInfo from './PlayerInfo';

interface PilotBattleScreenProps {
  onClick: () => void;
}

const PilotBattleScreen: Component<PilotBattleScreenProps> = (props) => {
  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{enemyZoid()?.name ?? t('ui:unknown')}</h2>
        <HealthBar />
        <div class={`battle-area bg-${battleBackground()}`} onClick={() => props.onClick()}>
          {enemyZoid()?.id && (
            <img class="enemy-image" src={getZoidImage(enemyZoid()!.id, enemyZoid()!.imageOverride)} alt={enemyZoid()!.name} />
          )}
          <DamageNumber />
          <Show when={pilotInfo()}>
            <div class="pilot-portrait">
              <span class="pilot-name">{t(`pilots:${pilotInfo()!.id}`)}</span>
              <div class="pilot-portrait-row">
                <div class="pilot-zoid-roster">
                  <For each={pilotZoidIds()}>
                    {(id, index) => (
                      <img
                        class={index() < pilotEnemyProgress().current ? 'defeated' : ''}
                        src={getZoidImage(id)}
                        alt={id}
                      />
                    )}
                  </For>
                </div>
                <img src={getPilotImage(pilotInfo()!.id)} alt={pilotInfo()!.name} />
              </div>
            </div>
          </Show>
          <div class="battle-bottom">
            <Show when={showClickHint()}>
              <p class="click-hint">{t('ui:click_hint')}</p>
            </Show>
            <PlayerHealthBar
              health={pilotPlayerHealth()}
              maxHealth={pilotPlayerMaxHealth()}
              percent={pilotPlayerHealthPercent()}
            />
          </div>
        </div>
      </div>
      <div class="divider" />
      <PlayerInfo />
    </div>
  );
};

export default PilotBattleScreen;
