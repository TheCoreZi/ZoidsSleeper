import { For, type Component } from 'solid-js';
import { t } from '../i18n';
import { getZoidById, getZoidImage } from '../models/Zoid';

interface StarterSelectProps {
  onSelect: (zoidId: string) => void;
}

const STARTER_IDS = ['garius', 'glidoler', 'elephantus'];

const StarterSelect: Component<StarterSelectProps> = (props) => (
  <div class="starter-select">
    <h2 class="starter-heading">{t('ui:choose_your_zoid')}</h2>
    <div class="starter-grid">
      <For each={STARTER_IDS}>
        {(id) => {
          const zoid = getZoidById(id);
          return (
            <div class="starter-card" onClick={() => props.onSelect(id)}>
              <img src={getZoidImage(id)} alt={zoid.name} />
              <div class="starter-card-name">{zoid.name}</div>
              <div class="starter-card-stats">
                ATK {zoid.attack} / HP {zoid.maxHealth}
              </div>
              <div class="starter-card-desc">{t(`zoids:${id}_desc`)}</div>
              <button type="button" onClick={() => props.onSelect(id)}>
                {t('ui:choose')}
              </button>
            </div>
          );
        }}
      </For>
    </div>
  </div>
);

export default StarterSelect;
