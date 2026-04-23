import { type Component, createSignal, Show } from 'solid-js';
import { t } from '../i18n';
import { FACTIONS, type Faction } from '../models/Faction';
import FactionBonusPopup from './FactionBonusPopup';
import './faction.css';

interface FactionPanelProps {
  faction: Faction;
}

const FactionPanel: Component<FactionPanelProps> = (props) => {
  const [showBonus, setShowBonus] = createSignal(false);
  const factionData = () => FACTIONS[props.faction];

  return (
    <>
      <div class="faction-panel">
        <span class="faction-panel-label">{t('ui:faction')}:</span>
        <img
          class="faction-panel-image"
          src={factionData().image}
          alt={t(`factions:${props.faction}`)}
        />
        <span class="faction-panel-name">{t(`factions:${props.faction}`)}</span>
        <button
          class="faction-panel-info"
          onClick={() => setShowBonus(true)}
          title={t('ui:faction_bonus_table')}
        >
          ℹ
        </button>
      </div>
      <Show when={showBonus()}>
        <FactionBonusPopup
          currentFaction={props.faction}
          onClose={() => setShowBonus(false)}
        />
      </Show>
    </>
  );
};

export default FactionPanel;
