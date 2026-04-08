import { For, type Component } from 'solid-js';
import { playerDamageEvents, setPlayerDamageEvents } from '../store/gameStore';

const PlayerDamageNumber: Component = () => {
  const handleAnimationEnd = (id: number) => {
    setPlayerDamageEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div class="player-damage-numbers">
      <For each={playerDamageEvents()}>
        {(event) => (
          <span
            class="player-damage-number"
            onAnimationEnd={() => handleAnimationEnd(event.id)}
          >
            -{event.amount}
          </span>
        )}
      </For>
    </div>
  );
};

export default PlayerDamageNumber;
