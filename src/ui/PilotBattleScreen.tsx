import { For, Show, type Component } from 'solid-js';
import { getPilotImage } from '../models/Pilot';
import { getZoidImage } from '../models/Zoid';
import {
  battleState,
  enemyZoid,
  pilotEnemyProgress,
  pilotInfo,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
  pilotZoidIds,
  showClickHint,
} from '../store/gameStore';
import { battleBackground } from '../store/routeStore';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerHealthBar from './PlayerHealthBar';
import PlayerInfo from './PlayerInfo';

interface PilotBattleScreenProps {
  onClick: () => void;
  onExit: () => void;
  onRetry: () => void;
}

const PilotBattleScreen: Component<PilotBattleScreenProps> = (props) => {
  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{enemyZoid()?.name ?? 'Unknown'}</h2>
        <HealthBar />
        <div class={`battle-area bg-${battleBackground()}`} onClick={() => props.onClick()}>
          {enemyZoid()?.id && (
            <img class="enemy-image" src={getZoidImage(enemyZoid()!.id)} alt={enemyZoid()!.name} />
          )}
          <DamageNumber />
          <Show when={pilotInfo()}>
            <div class="pilot-portrait">
              <span class="pilot-name">{pilotInfo()!.name}</span>
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
              <p class="click-hint">Click to shoot your pilot weapon</p>
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

      <Show when={battleState() === 'pilot-defeat'}>
        <div class="defeat-overlay">
          <div class="defeat-content">
            <h2>Defeated!</h2>
            <p>
              Defeated {pilotEnemyProgress().current} / {pilotEnemyProgress().total} Zoids
            </p>
            <button onClick={() => props.onRetry()}>Retry</button>
            <button onClick={() => props.onExit()}>Leave</button>
          </div>
        </div>
      </Show>

    </div>
  );
};

export default PilotBattleScreen;
