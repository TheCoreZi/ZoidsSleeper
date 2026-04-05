import { Show, type Component } from 'solid-js';
import { CITIES } from '../models/City';
import { calculateClickAttack } from '../models/Player';
import { findRouteKillRequirement } from '../models/Requirement';
import { playerStats } from '../store/gameStore';
import { currentLandmark, isOnRoute } from '../store/landmarkStore';
import { partyAttack } from '../store/partyStore';
import { getRouteKills } from '../store/statisticsStore';

const PlayerInfo: Component = () => {
  const pendingKillReq = () => {
    const req = findRouteKillRequirement(CITIES, currentLandmark().id);
    return req && !req.isCompleted() ? req : null;
  };

  return (
    <div class="player-info">
      <Show when={isOnRoute()}>
        <div class="player-stats-row">
          <span class="player-stat-label">{currentLandmark().name}</span>
          <Show
            when={pendingKillReq()}
            fallback={<span class="player-stat-label">Zoids Defeated: <span class="player-stat-value">{getRouteKills(currentLandmark().id)}</span></span>}
          >
            {(req) => <span class="player-stat-label">Zoids Fights Completed: <span class="player-stat-value">{req().progress()}/{req().requiredValue}</span></span>}
          </Show>
        </div>
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
