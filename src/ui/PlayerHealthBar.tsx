import type { Component } from 'solid-js';
import PlayerDamageNumber from './PlayerDamageNumber';

interface PlayerHealthBarProps {
  health: number;
  maxHealth: number;
  percent: number;
}

const PlayerHealthBar: Component<PlayerHealthBarProps> = (props) => {
  return (
    <div class="player-health-bar-wrapper">
      <div class="player-health-bar-container">
        <div class="player-health-bar-fill" style={{ width: `${props.percent}%` }} />
        <span class="player-health-bar-text">
          {props.health} / {props.maxHealth}
        </span>
      </div>
      <PlayerDamageNumber />
    </div>
  );
};

export default PlayerHealthBar;
