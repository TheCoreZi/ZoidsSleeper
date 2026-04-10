import { For, type Component } from 'solid-js';
import { rewardEvents, setRewardEvents } from '../store/gameStore';

const RewardNumber: Component = () => {
  const handleAnimationEnd = (id: number) => {
    setRewardEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div class="reward-numbers">
      <For each={rewardEvents()}>
        {(event, index) => (
          <span
            class={`reward-number reward-${event.currency}`}
            style={{ 'animation-delay': `${index() * 0.15}s` }}
            onAnimationEnd={() => handleAnimationEnd(event.id)}
          >
            +{event.amount} <img class="reward-icon" src={`images/items/${event.currency}.png`} alt={event.currency} />
          </span>
        )}
      </For>
    </div>
  );
};

export default RewardNumber;
