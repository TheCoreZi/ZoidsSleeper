import { type Component, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { applyEventOutcome, currentEvent } from './dungeonStore';
import { AttackBuffOutcome, EventOutcomeType, ItemRewardOutcome, PilotAmbushOutcome, RewardOutcome, WildAmbushOutcome } from './DungeonEventOutcome';
import type { DungeonEventChoice, DungeonEventOutcome } from './DungeonEventOutcome';
import './dungeon.css';

interface Props {
  onAmbush: () => void;
  onComplete: () => void;
  onPilotAmbush: (pilotId: string) => void;
  onWildAmbush: (zoidData: WildAmbushOutcome['zoidData']) => void;
}

const DungeonEventScreen: Component<Props> = (props) => {
  const [chosenOutcome, setChosenOutcome] = createSignal<DungeonEventOutcome | null>(null);

  function handleChoice(choice: DungeonEventChoice): void {
    const resolved = choice.resolveOutcome();
    applyEventOutcome(resolved);
    setChosenOutcome(resolved);
    const isAmbush = resolved.type === EventOutcomeType.Ambush;
    const isPilotAmbush = resolved.type === EventOutcomeType.PilotAmbush;
    const isWildAmbush = resolved.type === EventOutcomeType.WildAmbush;
    setTimeout(() => {
      setChosenOutcome(null);
      if (isAmbush) {
        props.onAmbush();
      } else if (isPilotAmbush) {
        props.onPilotAmbush((resolved as PilotAmbushOutcome).pilotId);
      } else if (isWildAmbush) {
        props.onWildAmbush((resolved as WildAmbushOutcome).zoidData);
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
                <Show when={chosenOutcome() instanceof AttackBuffOutcome}>
                  <span class="event-reward">
                    {t('dungeon:buff_attack', { value: `+${(chosenOutcome() as AttackBuffOutcome).value}` })}
                  </span>
                </Show>
                <Show when={chosenOutcome() instanceof ItemRewardOutcome}>
                  <span class="event-reward">
                    x{(chosenOutcome() as ItemRewardOutcome).amount}
                    <img class="event-reward-icon" src={`images/items/${(chosenOutcome() as ItemRewardOutcome).itemId}.png`} alt={(chosenOutcome() as ItemRewardOutcome).itemId} />
                  </span>
                </Show>
                <Show when={chosenOutcome()?.type === EventOutcomeType.Damage}>
                  <span class="event-reward">
                    {t('dungeon:buff_hp', { value: `-${chosenOutcome()!.value}` })}
                  </span>
                </Show>
                <Show when={chosenOutcome()?.type === EventOutcomeType.Heal}>
                  <span class="event-reward">
                    {t('dungeon:buff_hp', { value: `+${chosenOutcome()!.value}` })}
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
