import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { getFactionBonus } from '../models/Faction';
import { experienceForLevel, MAX_LEVEL } from '../models/LevelType';
import { getOwnedZoidLevel, getZoidById, getZoidImage, buildZoid, type OwnedZoid } from '../models/Zoid';
import { isMissionCompleted } from '../store/campaignStore';
import { playerStats } from '../store/gameStore';
import { party, selectCommanderZoid } from '../store/partyStore';
import './party.css';

const StatOption = {
  Attack: 'attack',
  Attack100: 'attack_100',
  BaseAttack: 'base_attack',
  BaseHp: 'base_hp',
  Experience: 'experience',
  Hp: 'hp',
  Hp100: 'hp_100',
} as const;

type StatOption = typeof StatOption[keyof typeof StatOption];

const STAT_OPTIONS: StatOption[] = [
  StatOption.Attack, StatOption.Hp, StatOption.Attack100, StatOption.Hp100,
  StatOption.BaseAttack, StatOption.BaseHp, StatOption.Experience,
];

function statLabel(key: StatOption): string {
  return t(`ui:stat_${key}`);
}

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
  const bonusMultiplier = getFactionBonus(playerStats()?.faction ?? 'neutral', getZoidById(zoid.id).faction);
  switch (stat) {
    case StatOption.Attack: return buildZoid({ bonusMultiplier, id: zoid.id, level }).attack;
    case StatOption.Attack100: return buildZoid({ bonusMultiplier, id: zoid.id, level: 100 }).attack;
    case StatOption.BaseAttack: return getZoidById(zoid.id).attack;
    case StatOption.BaseHp: return getZoidById(zoid.id).maxHealth;
    case StatOption.Experience: return zoid.experience;
    case StatOption.Hp: return buildZoid({ bonusMultiplier, id: zoid.id, level }).maxHealth;
    case StatOption.Hp100: return buildZoid({ bonusMultiplier, id: zoid.id, level: 100 }).maxHealth;
  }
}

interface PartyPanelProps {
  expanded: boolean;
  onToggle: () => void;
}

const PartyPanel: Component<PartyPanelProps> = (props) => {
  const [selectedStat, setSelectedStat] = createSignal<StatOption>(StatOption.Attack);
  const isDuelUnlocked = createMemo(() => isMissionCompleted('sleeper_commander', 'find_van_oasis'));
  const commanderZoidId = createMemo(() => {
    const zoids = party().zoids;
    if (zoids.length <= 1 || !isDuelUnlocked()) {return null;}
    return party().commanderZoidId;
  });

  return (
    <div class="party-panel">
      <h3 class="party-title" onClick={() => props.onToggle()}>{t('ui:zoids_army')}</h3>
      <Show when={props.expanded}>
        <select
          class="party-stat-select"
          value={selectedStat()}
          onChange={(e) => setSelectedStat(e.currentTarget.value as StatOption)}
        >
          <For each={STAT_OPTIONS}>
            {(value) => <option value={value}>{statLabel(value)}</option>}
          </For>
        </select>
        <div class="party-list">
          <For each={party().zoids}>
            {(zoid) => {
              const level = () => getOwnedZoidLevel(zoid);
              const isCommander = () => zoid.id === commanderZoidId();
              return (
                <div
                  class="party-row"
                  classList={{ 'party-row-selected': isCommander() }}
                  onClick={() => isDuelUnlocked() && selectCommanderZoid(zoid.id)}
                >
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
                    <span class="party-row-level">{t('ui:lv')}{level()}</span>
                    <Show when={isCommander()}>
                      <span class="party-row-commander-badge">{t('ui:commander_badge')}</span>
                    </Show>
                  </div>
                  <span class="party-row-stat">{getStatValue(zoid, selectedStat()).toLocaleString()}</span>
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
