import { For, type Component } from 'solid-js';
import { getZoidById, getZoidImage } from '../models/Zoid';
import { STARTER_DESCRIPTIONS } from './introScript';

interface StarterSelectProps {
  onSelect: (zoidId: string) => void;
}

const STARTER_IDS = ['garius', 'glidoler', 'elephantus'];

const StarterSelect: Component<StarterSelectProps> = (props) => (
  <div class="starter-select">
    <h2 class="starter-heading">Choose your Zoid</h2>
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
              <div class="starter-card-desc">{STARTER_DESCRIPTIONS[id]}</div>
              <button type="button" onClick={() => props.onSelect(id)}>
                Choose
              </button>
            </div>
          );
        }}
      </For>
    </div>
  </div>
);

export default StarterSelect;
