import { createSignal, For, Show, type Component } from 'solid-js';
import { experienceForLevel, MAX_LEVEL } from '../models/LevelType';
import { getOwnedZoidLevel, getZoidById, getZoidImage, resolveZoid, type OwnedZoid } from '../models/Zoid';
import { party } from '../store/partyStore';

type StatOption = 'attack' | 'attack-100' | 'base-attack' | 'base-hp' | 'experience' | 'hp' | 'hp-100';

const STAT_LABELS: Record<StatOption, string> = {
  'attack': 'Current Attack',
  'attack-100': 'Attack at Lv 100',
  'base-attack': 'Base Attack',
  'base-hp': 'Base HP',
  'experience': 'Experience',
  'hp': 'Current HP',
  'hp-100': 'HP at Lv 100',
};

function getExpProgress(zoid: OwnedZoid): number {
  const level = getOwnedZoidLevel(zoid);
  const { levelType } = getZoidById(zoid.id);
  const currentXp = experienceForLevel(level, levelType);
  const nextXp = experienceForLevel(level + 1, levelType);
  const range = nextXp - currentXp;
  return range <= 0 ? 100 : ((zoid.experience - currentXp) / range) * 100;
}

function getStatValue(zoid: OwnedZoid, stat: StatOption): number {
  const level = getOwnedZoidLevel(zoid);
  switch (stat) {
    case 'attack': return resolveZoid({ id: zoid.id, level }).attack;
    case 'attack-100': return resolveZoid({ id: zoid.id, level: 100 }).attack;
    case 'base-attack': return getZoidById(zoid.id).attack;
    case 'base-hp': return getZoidById(zoid.id).maxHealth;
    case 'experience': return zoid.experience;
    case 'hp': return resolveZoid({ id: zoid.id, level }).maxHealth;
    case 'hp-100': return resolveZoid({ id: zoid.id, level: 100 }).maxHealth;
  }
}

interface PartyPanelProps {
  expanded: boolean;
  onToggle: () => void;
}

const PartyPanel: Component<PartyPanelProps> = (props) => {
  const [selectedStat, setSelectedStat] = createSignal<StatOption>('attack');

  return (
    <div class="party-panel">
      <h3 class="party-title" onClick={() => props.onToggle()}>Zoids Army</h3>
      <Show when={props.expanded}>
        <select
          class="party-stat-select"
          value={selectedStat()}
          onChange={(e) => setSelectedStat(e.currentTarget.value as StatOption)}
        >
          <For each={Object.entries(STAT_LABELS)}>
            {([value, label]) => <option value={value}>{label}</option>}
          </For>
        </select>
        <div class="party-list">
          <For each={party()}>
            {(zoid) => {
              const level = () => getOwnedZoidLevel(zoid);
              return (
                <div class="party-row">
                  <div class="party-row-image-col">
                    <img class="party-row-image" src={getZoidImage(zoid.id)} alt={getZoidById(zoid.id).name} />
                    <Show when={level() < MAX_LEVEL}>
                      <div class="party-row-xp-bar">
                        <div class="party-row-xp-fill" style={{ width: `${getExpProgress(zoid)}%` }} />
                      </div>
                    </Show>
                  </div>
                  <div class="party-row-info">
                    <span class="party-row-name">{getZoidById(zoid.id).name}</span>
                    <span class="party-row-level">Lv.{level()}</span>
                  </div>
                  <span class="party-row-stat">{getStatValue(zoid, selectedStat())}</span>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default PartyPanel;
