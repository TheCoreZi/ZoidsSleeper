import type { Component } from 'solid-js';
import { calculateClickAttack } from '../models/Player';
import { playerStats } from '../store/gameStore';
import { partyAttack } from '../store/partyStore';

const PlayerInfo: Component = () => {
  return (
    <div class="player-info">
      <div class="player-stat">
        <span class="player-stat-label">Total Zoids Attack</span>
        <span class="player-stat-value">{partyAttack()}</span>
      </div>
      <div class="player-stat">
        <span class="player-stat-label">Manual Attack</span>
        <span class="player-stat-value">{playerStats() ? calculateClickAttack(playerStats()!) : 0}</span>
      </div>
    </div>
  );
};

export default PlayerInfo;
