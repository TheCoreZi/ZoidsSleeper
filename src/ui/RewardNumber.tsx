import { For, type Component } from 'solid-js';
import { rewardEvents, setRewardEvents } from '../store/gameStore';

const RewardNumber: Component = () => {
  const handleAnimationEnd = (id: number) => {
    setRewardEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div class="reward-numbers">
      <For each={rewardEvents()}>
        {(event) => (
          <span
            class="reward-number"
            onAnimationEnd={() => handleAnimationEnd(event.id)}
          >
            +{event.amount} <img class="reward-icon" src="images/items/magnis.png" alt="Magnis" />
          </span>
        )}
      </For>
    </div>
  );
};

export default RewardNumber;
