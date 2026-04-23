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
        <div class="faction-panel-header">
          <h3 class="faction-panel-title">{t('ui:faction')}</h3>
          <button
            class="faction-panel-info"
            onClick={() => setShowBonus(true)}
            title={t('ui:faction_bonus_table')}
          >
            ℹ
          </button>
        </div>
        <div class="faction-panel-content">
          <img
            class="faction-panel-image"
            src={factionData().image}
            alt={t(`factions:${props.faction}`)}
          />
          <span class="faction-panel-name">{t(`factions:${props.faction}`)}</span>
        </div>
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
