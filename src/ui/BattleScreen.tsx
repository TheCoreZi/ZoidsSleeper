import { Show, type Component } from 'solid-js';
import { getZoidImage } from '../models/Zoid';
import { enemyZoid, showClickHint } from '../store/gameStore';
import { battleBackground } from '../store/routeStore';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerInfo from './PlayerInfo';

interface BattleScreenProps {
  onClick: () => void;
}

const BattleScreen: Component<BattleScreenProps> = (props) => {
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
          <div class="battle-bottom">
            <Show when={showClickHint()}>
              <p class="click-hint">Click to shoot your pilot weapon</p>
            </Show>
          </div>
        </div>
      </div>
      <div class="divider" />
      <PlayerInfo />
    </div>
  );
};

export default BattleScreen;
