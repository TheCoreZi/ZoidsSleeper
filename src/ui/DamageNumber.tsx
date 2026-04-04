import { For, type Component } from 'solid-js';
import { damageEvents, setDamageEvents } from '../store/gameStore';

const DamageNumber: Component = () => {
  const handleAnimationEnd = (id: number) => {
    setDamageEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div class="damage-numbers">
      <For each={damageEvents()}>
        {(event) => (
          <span
            class={`damage-number damage-${event.source}`}
            onAnimationEnd={() => handleAnimationEnd(event.id)}
          >
            -{event.amount}
          </span>
        )}
      </For>
    </div>
  );
};

export default DamageNumber;
