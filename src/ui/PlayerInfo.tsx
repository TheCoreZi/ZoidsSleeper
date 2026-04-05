import { Show, type Component } from 'solid-js';
import { calculateClickAttack } from '../models/Player';
import { playerStats } from '../store/gameStore';
import { currentLandmark, isOnRoute } from '../store/landmarkStore';
import { partyAttack } from '../store/partyStore';

const PlayerInfo: Component = () => {
  return (
    <div class="player-info">
      <Show when={isOnRoute()}>
        <span class="route-label">{currentLandmark().name}</span>
      </Show>
      <div class="player-stats-row">
        <div class="player-stat">
          <span class="player-stat-label">Total Zoids Attack</span>
          <span class="player-stat-value">{partyAttack()}</span>
        </div>
        <div class="player-stat">
          <span class="player-stat-label">Manual Attack</span>
          <span class="player-stat-value">{playerStats() ? calculateClickAttack(playerStats()!) : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
