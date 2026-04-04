import type { Component } from 'solid-js';
import { enemyHealthPercent, enemyZoid } from '../store/gameStore';

const HealthBar: Component = () => {
  return (
    <div class="health-bar-container">
      <div class="health-bar-fill" style={{ width: `${enemyHealthPercent()}%` }} />
      <span class="health-bar-text">
        {enemyZoid()?.health ?? 0} / {enemyZoid()?.maxHealth ?? 0}
      </span>
    </div>
  );
};

export default HealthBar;
