import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import { ZoidResearchStatus } from '../models/Zoid';
import { getZoidResearch } from '../store/zoidResearchStore';
import ZoidDetailModal from './ZoidDetailModal';
import { t } from '../i18n';
import { getFactionBonus } from '../models/Faction';
import { experienceForLevel, MAX_LEVEL } from '../models/LevelType';
import { getOwnedZoidLevel, getZoidById, getZoidImage, getZoidName, buildZoid, type OwnedZoid } from '../models/Zoid';
import { DateStat, NameStat, NumericStat, type ZoidDisplayStat } from '../models/ZoidDisplayStat';
import { isMissionCompleted } from '../store/campaignStore';
import { playerStats } from '../store/gameStore';
import { party, selectCommanderZoid } from '../store/partyStore';
import { SORT_CYCLE, type SortDirection, StatOption } from './StatSort';
import StatSortBar from './StatSortBar';
import './party.css';

const PARTY_STAT_OPTIONS: StatOption[] = [
  StatOption.Name, StatOption.DateObtained, StatOption.Attack, StatOption.Hp, StatOption.Attack100, StatOption.Hp100,
  StatOption.BaseAttack, StatOption.BaseHp, StatOption.Experience,
];

function getExpProgress(zoid: OwnedZoid): number {
  const level = getOwnedZoidLevel(zoid);
  const { levelType } = getZoidById(zoid.id);
  const currentXp = experienceForLevel(level, levelType);
  const nextXp = experienceForLevel(level + 1, levelType);
  const range = nextXp - currentXp;
  return range <= 0 ? 100 : ((zoid.experience - currentXp) / range) * 100;
}

function getStatValue(zoid: OwnedZoid, stat: StatOption): ZoidDisplayStat {
  const level = getOwnedZoidLevel(zoid);
  const bonusMultiplier = getFactionBonus(playerStats()?.faction ?? 'neutral', getZoidById(zoid.id).faction);
  const built = () => buildZoid({ bonusMultiplier, id: zoid.id, level, rebornBonusPercent: zoid.rebornBonusPercent });
  switch (stat) {
    case StatOption.Attack: return new NumericStat(built().attack);
    case StatOption.Attack100: return new NumericStat(buildZoid({ bonusMultiplier, id: zoid.id, level: 100, rebornBonusPercent: zoid.rebornBonusPercent }).attack);
    case StatOption.BaseAttack: return new NumericStat(getZoidById(zoid.id).attack);
    case StatOption.BaseHp: return new NumericStat(getZoidById(zoid.id).maxHealth);
    case StatOption.DateObtained: return new DateStat(zoid.dateObtained ?? 0);
    case StatOption.Experience: return new NumericStat(zoid.experience);
    case StatOption.Hp: return new NumericStat(built().maxHealth);
    case StatOption.Hp100: return new NumericStat(buildZoid({ bonusMultiplier, id: zoid.id, level: 100, rebornBonusPercent: zoid.rebornBonusPercent }).maxHealth);
    case StatOption.CoreFragments: return new NumericStat(getZoidById(zoid.id).coreFragments);
    case StatOption.Name: return new NameStat(getZoidName(zoid.id), built().attack, built().maxHealth);
  }
}

interface PartyPanelProps {
  expanded: boolean;
  onToggle: () => void;
}

const PartyPanel: Component<PartyPanelProps> = (props) => {
  const [selectedStat, setSelectedStat] = createSignal<StatOption>(StatOption.Name);
  const [sortDirection, setSortDirection] = createSignal<SortDirection>('none');
  const [detailZoidId, setDetailZoidId] = createSignal<string | null>(null);
  const isDuelUnlocked = createMemo(() => isMissionCompleted('sleeper_commander', 'find_van_oasis'));
  const commanderZoidId = createMemo(() => {
    const zoids = party().zoids;
    if (zoids.length <= 1 || !isDuelUnlocked()) {return null;}
    return party().commanderZoidId;
  });
  const sortedZoids = createMemo(() => {
    const dir = sortDirection();
    const zoids = party().zoids;
    if (dir === 'none') {return zoids;}
    const stat = selectedStat();
    return [...zoids].sort((a, b) => {
      const cmp = getStatValue(a, stat).compare(getStatValue(b, stat));
      return dir === 'desc' ? -cmp : cmp;
    });
  });

  return (
    <div class="party-panel">
      <h3 class="party-title" onClick={() => props.onToggle()}>{t('ui:zoids_army')}</h3>
      <Show when={props.expanded}>
        <StatSortBar
          options={PARTY_STAT_OPTIONS}
          selectedStat={selectedStat}
          onStatChange={(s) => { setSelectedStat(s); setSortDirection('none'); }}
          sortDirection={sortDirection}
          onSortToggle={() => setSortDirection(d => SORT_CYCLE[(SORT_CYCLE.indexOf(d) + 1) % SORT_CYCLE.length])}
        />
        <div class="party-list">
          <For each={sortedZoids()}>
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
                    <img class="party-row-image" src={getZoidImage(zoid.id)} alt={getZoidName(zoid.id)} />
                    <Show when={level() < MAX_LEVEL}>
                      <div class="party-row-xp-bar">
                        <div class="party-row-xp-fill" style={{ width: `${getExpProgress(zoid)}%` }} />
                      </div>
                    </Show>
                  </div>
                  <div class="party-row-info">
                    <span class="party-row-name">{getZoidName(zoid.id)}</span>
                    <span class="party-row-level">{t('ui:lv')}{level()}</span>
                    <Show when={isCommander()}>
                      <span class="party-row-commander-badge">{t('ui:commander_badge')}</span>
                    </Show>
                  </div>
                  <span class="party-row-stat">{getStatValue(zoid, selectedStat()).display()}</span>
                  <button class="party-row-info-btn" onClick={(e) => { e.stopPropagation(); setDetailZoidId(zoid.id); }} title="Info">i</button>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
      <Show when={detailZoidId()}>
        {(id) => (
          <ZoidDetailModal
            id={id()}
            onClose={() => setDetailZoidId(null)}
            status={getZoidResearch(id()) ?? ZoidResearchStatus.Created}
          />
        )}
      </Show>
    </div>
  );
};

export default PartyPanel;
