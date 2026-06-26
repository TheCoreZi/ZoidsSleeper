import { type Component, For, Show } from 'solid-js';
import { getEvolutionSources } from '../evolution/evolutionLookup';
import { t } from '../i18n';
import { getZoidLocations } from '../landmark';
import { FACTIONS, FACTION_THEMES } from '../models/Faction';
import {
  buildZoid,
  getOwnedZoidLevel,
  getZoidById,
  getZoidImage,
  getZoidName,
  ZoidResearchStatus,
} from '../models/Zoid';
import { playerStats } from '../store/gameStore';
import { party } from '../store/partyStore';
import { getSpeciesDefeats } from '../store/statisticsStore';
import { getZoidResearch } from '../store/zoidResearchStore';
import './archive.css';
import { EvolutionHintView } from './EvolutionHintView';

export interface ZoidDetailModalProps {
  id: string;
  onClose: () => void;
  status: ZoidResearchStatus;
}

const MACH_KMH = 1234.8;

function formatSpeed(speed: number): string {
  if (speed >= MACH_KMH) {return `Mach ${(speed / MACH_KMH).toFixed(1)}`;}
  return `${speed} km/h`;
}

const ZoidDetailModal: Component<ZoidDetailModalProps> = (props) => {
  const zoid = () => getZoidById(props.id);
  const faction = () => FACTIONS[zoid().faction];
  const factionTheme = () => FACTION_THEMES[zoid().faction];
  const locations = () => getZoidLocations(props.id);
  const isRevealed = () => props.status !== ZoidResearchStatus.Seen;
  const isCreated = () => props.status === ZoidResearchStatus.Created;
  const ownedZoid = () => party().zoids.find((z) => z.id === props.id);
  const ownedLevel = () => { const oz = ownedZoid(); return oz ? getOwnedZoidLevel(oz) : null; };
  const currentAtk = () => { const oz = ownedZoid(); const lv = ownedLevel(); return oz && lv ? buildZoid({ id: props.id, level: lv, rebornBonusPercent: oz.rebornBonusPercent }).attack : null; };
  const currentHp = () => { const oz = ownedZoid(); const lv = ownedLevel(); return oz && lv ? buildZoid({ id: props.id, level: lv, rebornBonusPercent: oz.rebornBonusPercent }).maxHealth : null; };
  const atkAt100 = () => { const oz = ownedZoid(); return buildZoid({ id: props.id, level: 100, rebornBonusPercent: oz?.rebornBonusPercent }).attack; };
  const hpAt100 = () => { const oz = ownedZoid(); return buildZoid({ id: props.id, level: 100, rebornBonusPercent: oz?.rebornBonusPercent }).maxHealth; };

  const evolvesFrom = () => getEvolutionSources(props.id);
  const evolvesInto = () => zoid().evolutions ?? [];

  const isEvoRevealed = (zoidId: string) => {
    const status = getZoidResearch(zoidId);
    return status != null && status !== ZoidResearchStatus.Seen;
  };

  const evoImageClass = (zoidId: string, flipped = false) => {
    const base = 'archive-detail-evo-img';
    const classes = [base];
    if (flipped) {classes.push(`${base}--flipped`);}
    if (!isEvoRevealed(zoidId)) {classes.push(`${base}--silhouette`);}
    return classes.join(' ');
  };

  const evoName = (zoidId: string) =>
    isEvoRevealed(zoidId) ? getZoidName(zoidId) : '???';

  const imageClass = () => {
    switch (props.status) {
      case ZoidResearchStatus.Seen: return 'archive-detail-image archive-detail-image--seen';
      case ZoidResearchStatus.Scanned: return 'archive-detail-image archive-detail-image--scanned';
      default: return 'archive-detail-image';
    }
  };

  const statRow = (label: string, value: string | number | undefined) => (
    <div class="archive-detail-stat">
      <span class="archive-detail-stat-label">{label}</span>
      <span class="archive-detail-stat-value">{isRevealed() && value != null ? value : '???'}</span>
    </div>
  );

  return (
    <div class="archive-detail-overlay" onClick={() => props.onClose()}>
      <div
        class="archive-detail"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--detail-accent': factionTheme().accent,
          '--detail-border': factionTheme().border,
          '--detail-deep-bg': factionTheme().deepBg,
          '--detail-panel-bg': factionTheme().panelBg,
        }}
      >
        <div class="archive-detail-header">
          <span class="archive-detail-name">{getZoidName(props.id)}</span>
          <button class="archive-close" onClick={() => props.onClose()}>✕</button>
        </div>

        <div class="archive-detail-body">
          <div class="archive-detail-meta">
            <img class="archive-detail-faction" src={faction().image} alt={t(`factions:${zoid().faction}`)} />
            <span class={`archive-detail-status archive-detail-status--${props.status}`}>{t(`ui:archive_status_${props.status}`)}</span>
          </div>

          <div class="archive-detail-image-col">
            <div class="archive-detail-image-wrapper">
              <img class={imageClass()} src={getZoidImage(props.id)} alt={getZoidName(props.id)} />
            </div>
            <Show when={isRevealed()} fallback={<p class="archive-detail-desc">???</p>}>
              <p class="archive-detail-desc">{t(`zoids:${props.id}_desc`)}</p>
            </Show>
          </div>

          <div class="archive-detail-specs">
            <span class="archive-detail-section-title">{t('ui:archive_specs')}</span>
            <div class="archive-detail-stats-col">
              {statRow(t('ui:faction'), t(`factions:${zoid().faction}`))}
              <Show when={zoid().type}>
                {statRow(t('ui:archive_type'), t(`zoids:type_${zoid().type}`))}
              </Show>
              {statRow(t('ui:archive_size'), t(`ui:size_${zoid().size}`))}
              <Show when={zoid().speed != null}>
                {statRow(t('ui:archive_speed'), formatSpeed(zoid().speed!))}
              </Show>
              <Show when={zoid().weight != null}>
                {statRow(t('ui:archive_weight'), `${zoid().weight} t`)}
              </Show>
              <Show when={zoid().length != null}>
                {statRow(t('ui:archive_length'), `${zoid().length} m`)}
              </Show>
              <Show when={zoid().height != null}>
                {statRow(t('ui:archive_height'), `${zoid().height} m`)}
              </Show>
              <Show when={zoid().width != null}>
                {statRow(t('ui:archive_width'), `${zoid().width} m`)}
              </Show>
            </div>
          </div>

          <Show when={isRevealed()}>
            <div class="archive-detail-row2">
              <div>
                <span class="archive-detail-section-title">{t('ui:archive_stats')}</span>
                <div class="archive-detail-stats-grid">
                  <div class="archive-detail-stats-col">
                    {statRow(t('ui:stat_base_attack'), zoid().attack)}
                    {statRow(t('ui:stat_base_hp'), zoid().maxHealth)}
                    <Show when={isCreated() && currentAtk() != null}>
                      {statRow(t('ui:stat_attack'), currentAtk()!)}
                      {statRow(t('ui:stat_hp'), currentHp()!)}
                      {statRow(t('ui:stat_attack_100'), atkAt100())}
                      {statRow(t('ui:stat_hp_100'), hpAt100())}
                    </Show>
                  </div>
                  <div class="archive-detail-stats-col">
                    {statRow(t('ui:archive_defeated'), getSpeciesDefeats(props.id))}
                    <Show when={isCreated()}>
                      {statRow(t('ui:archive_deployed'), ownedZoid()?.copies ?? 1)}
                      {statRow(t('ui:archive_times_nurtured'), ownedZoid()!.rebornCount ?? 0)}
                      {statRow(t('ui:archive_research_bonus'), `${ownedZoid()!.rebornBonusPercent ?? 0}%`)}
                    </Show>
                    {statRow(t('ui:stat_core_fragments'), zoid().coreFragments)}
                  </div>
                </div>
              </div>
              <div class="archive-detail-section">
                <span class="archive-detail-section-title">{t('ui:archive_terrains')}</span>
                <Show when={isRevealed()} fallback={<span class="archive-detail-section-value">???</span>}>
                  <div class="archive-detail-terrains">
                    <For each={zoid().terrainTypes}>
                      {(ter) => <img class="archive-detail-terrain-icon" src={`images/icons/${ter}.png`} alt={t(`ui:terrain_${ter}`)} title={t(`ui:terrain_${ter}`)} />}
                    </For>
                  </div>
                </Show>
              </div>
            </div>
          </Show>

          <Show when={isRevealed() && playerStats()?.evolvingEnabled && (evolvesFrom().length > 0 || evolvesInto().length > 0)}>
            <div class="archive-detail-evo">
              <span class="archive-detail-section-title">{t('ui:archive_evolution')}</span>
              <For each={evolvesFrom()}>
                {(source) => (
                  <div class="archive-detail-evo-chain">
                    <div class="archive-detail-evo-zoid">
                      <div class="archive-detail-evo-img-wrapper"><img class={evoImageClass(source.sourceId)} src={getZoidImage(source.sourceId)} alt={evoName(source.sourceId)} /></div>
                      <span>{evoName(source.sourceId)}</span>
                    </div>
                    <div class="archive-detail-evo-arrow">
                      <span class="archive-detail-evo-condition">
                        <EvolutionHintView hints={source.evolution.hint()} />
                      </span>
                      <span class="archive-detail-evo-arrow-line"><span class="archive-detail-evo-arrow-icon">→</span></span>
                    </div>
                    <div class="archive-detail-evo-zoid">
                      <div class="archive-detail-evo-img-wrapper"><img class={evoImageClass(props.id, true)} src={getZoidImage(props.id)} alt={evoName(props.id)} /></div>
                      <span>{evoName(props.id)}</span>
                    </div>
                  </div>
                )}
              </For>
              <Show when={evolvesInto().length > 0}>
                <div class="archive-detail-evo-chain">
                  <div class="archive-detail-evo-zoid">
                    <img class={evoImageClass(props.id, true)} src={getZoidImage(props.id)} alt={evoName(props.id)} />
                    <span>{evoName(props.id)}</span>
                  </div>
                  <div class="archive-detail-evo-targets">
                    <For each={evolvesInto()}>
                      {(evo) => (
                        <div class="archive-detail-evo-target-row">
                          <div class="archive-detail-evo-arrow">
                            <span class="archive-detail-evo-condition">
                              <EvolutionHintView hints={evo.hint()} />
                            </span>
                            <span class="archive-detail-evo-arrow-line"><span class="archive-detail-evo-arrow-icon">→</span></span>
                          </div>
                          <div class="archive-detail-evo-zoid">
                            <div class="archive-detail-evo-img-wrapper"><img class={evoImageClass(evo.targetId)} src={getZoidImage(evo.targetId)} alt={evoName(evo.targetId)} /></div>
                            <span>{evoName(evo.targetId)}</span>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          <div class="archive-detail-row3">
            <span class="archive-detail-section-title">{t('ui:locations')}</span>
            <Show when={locations().length > 0} fallback={<span class="archive-detail-section-value">???</span>}>
              <div class="archive-detail-locations">
                <For each={locations()}>
                  {(locId) => <span class="archive-detail-location">• {t(`locations:${locId}`)}</span>}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoidDetailModal;
