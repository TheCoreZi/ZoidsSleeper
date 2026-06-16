import { type Component, For } from 'solid-js';
import type { EvolutionHint, EvolutionHintLine } from '../evolution/EvolutionHint';
import { FactionHint, ItemHint, SeparatorHint, StatHint } from '../evolution/EvolutionHint';
import { t } from '../i18n';
import type { Faction } from '../models/Faction';
import { FACTIONS } from '../models/Faction';

function renderHint(hint: EvolutionHint) {
  if (hint instanceof StatHint) { return <span>{t(`ui:${hint.prefix}`)} ≥ {hint.threshold}</span>; }
  if (hint instanceof FactionHint) { return <img class="archive-detail-evo-item-img" src={FACTIONS[hint.faction as Faction].image} alt={t(`factions:${hint.faction}`)} />; }
  if (hint instanceof ItemHint) { return <img class="archive-detail-evo-item-img" src={`images/items/${hint.itemId}.png`} alt={t(`items:${hint.itemId}.name`)} />; }
  if (hint instanceof SeparatorHint) { return <span>{hint.text}</span>; }
}

export const EvolutionHintView: Component<{ hints: EvolutionHintLine[] }> = (props) => (
  <For each={props.hints}>
    {(line) => (
      <div class="archive-detail-evo-hint-line">
        <For each={line}>
          {(h) => renderHint(h)}
        </For>
      </div>
    )}
  </For>
);
