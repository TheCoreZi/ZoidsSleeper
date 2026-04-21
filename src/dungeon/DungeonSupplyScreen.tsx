import { type Component, For } from 'solid-js';
import { t } from '../i18n';
import { applySupply, dungeonRun } from './dungeonStore';
import type { SupplyOption } from './DungeonSupply';
import { SupplyCostType, SupplyType } from './DungeonSupply';
import './dungeon.css';

interface Props {
  onComplete: () => void;
}

function benefitText(option: SupplyOption): string {
  switch (option.type) {
    case SupplyType.AttackBuff:
      return `+${option.value}% ATK`;
    case SupplyType.Heal:
      return `+${option.value}% HP`;
  }
}

function costText(option: SupplyOption): string {
  switch (option.costType) {
    case SupplyCostType.AttackDebuff:
      return `-${option.costValue}% ATK`;
    case SupplyCostType.Damage:
      return `-${option.costValue}% HP`;
  }
}

const DungeonSupplyScreen: Component<Props> = (props) => {
  function handleSupply(option: SupplyOption): void {
    applySupply(option);
    props.onComplete();
  }

  return (
    <div class="dungeon-supply-screen">
      <h2 class="supply-title">{t('dungeon:node_supply')}</h2>
      <div class="supply-options">
        <For each={dungeonRun()?.config.supplyOptions ?? []}>
          {(option) => (
            <button class="supply-option-btn" onClick={() => handleSupply(option)}>
              <span class="supply-option-label">{t(option.labelKey)}</span>
              <span class="supply-option-effects">
                (<span class="effect-positive">{benefitText(option)}</span>{' '}
                <span class="effect-negative">{costText(option)}</span>)
              </span>
            </button>
          )}
        </For>
      </div>
      <button class="supply-skip-btn" onClick={() => props.onComplete()}>
        {t('dungeon:supply_skip')}
      </button>
    </div>
  );
};

export default DungeonSupplyScreen;
