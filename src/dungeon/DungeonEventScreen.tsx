import { type Component, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { applyEventOutcome, currentEvent } from './dungeonStore';
import { DungeonEventOutcome, EventOutcomeType, RewardOutcome } from './DungeonEventOutcome';
import type { DungeonEventChoice } from './DungeonEventOutcome';
import './dungeon.css';

interface Props {
  onAmbush: () => void;
  onComplete: () => void;
}

const DungeonEventScreen: Component<Props> = (props) => {
  const [chosenOutcome, setChosenOutcome] = createSignal<DungeonEventOutcome | null>(null);

  function handleChoice(choice: DungeonEventChoice): void {
    applyEventOutcome(choice);
    setChosenOutcome(choice.outcome);
    const isAmbush = choice.outcome.type === EventOutcomeType.Ambush;
    setTimeout(() => {
      setChosenOutcome(null);
      if (isAmbush) {
        props.onAmbush();
      } else {
        props.onComplete();
      }
    }, 2000);
  }

  return (
    <div class="dungeon-event-screen">
      <Show when={currentEvent()}>
        {(event) => (
          <>
            <div class="event-description">
              <p>{t(event().descriptionKey)}</p>
            </div>
            <Show when={!chosenOutcome()} fallback={
              <div class="event-outcome">
                <p>{t(chosenOutcome()!.descriptionKey)}</p>
                <Show when={chosenOutcome() instanceof RewardOutcome}>
                  <span class="event-reward">
                    +{(chosenOutcome() as RewardOutcome).value}
                    <img class="event-reward-icon" src={`images/items/${(chosenOutcome() as RewardOutcome).itemId}.png`} alt={(chosenOutcome() as RewardOutcome).itemId} />
                  </span>
                </Show>
              </div>
            }>
              <div class="event-choices">
                <For each={event().choices}>
                  {(choice) => (
                    <button class="event-choice-btn" onClick={() => handleChoice(choice)}>
                      {t(choice.labelKey)}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
};

export default DungeonEventScreen;
