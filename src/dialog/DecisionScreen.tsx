import { For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import type { DialogChoice, DialogDecision } from './Dialog';
import './dialog.css';

interface DecisionScreenProps {
  decision: DialogDecision;
  onChoose: (choice: DialogChoice) => void;
}

const DecisionScreen: Component<DecisionScreenProps> = (props) => (
  <div class="decision-screen">
    <div class="decision-question">
      <Show when={props.decision.portrait}>
        <img class="dialog-portrait" src={props.decision.portrait} alt="" />
      </Show>
      <div class="decision-question-text">{t(props.decision.questionKey)}</div>
    </div>
    <Show when={props.decision.alertKey}>
      <div class="decision-alert">{t(props.decision.alertKey!)}</div>
    </Show>
    <div class="decision-grid">
      <For each={props.decision.choices}>
        {(choice) => (
          <div class="decision-card" onClick={() => props.onChoose(choice)}>
            <Show when={choice.image}>
              <img src={choice.image} alt={t(choice.labelKey)} />
            </Show>
            <div class="decision-card-label">{t(choice.labelKey)}</div>
          </div>
        )}
      </For>
    </div>
  </div>
);

export default DecisionScreen;
