import { createSignal, For, Show, type Component } from 'solid-js';
import { getActiveScanRate } from '../game/Scan';
import { t } from '../i18n';
import { getUnlockedEnemies, type Route } from '../landmark';
import { getZoidImage } from '../models/Zoid';
import { resolveProbabilities } from '../utils/probabilityRandom';
import { enemyZoid, showClickHint } from '../store/gameStore';
import { battleBackground, currentLandmark, isOnRoute } from '../store/landmarkStore';
import { getActiveDeviceId, getActiveScanMode } from '../store/scanStore';
import { getZoidResearch } from '../store/zoidResearchStore';
import { ArchiveCard } from './ZiArchivePanel';
import './archive.css';
import './battle.css';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerInfo from './PlayerInfo';
import RewardNumber from './RewardNumber';
import ScanToggle from './ScanToggle';

interface BattleScreenProps {
  onClick: () => void;
}

function formatProbability(value: number): string {
  const percent = value * 100;
  if (percent >= 1) { return `${Math.round(percent)}%`; }
  const decimals = percent >= 0.1 ? 1 : 2;
  return `${percent.toFixed(decimals)}%`;
}

const BattleScreen: Component<BattleScreenProps> = (props) => {
  const [showInfo, setShowInfo] = createSignal(false);

  const scanRate = () => getActiveScanRate(getActiveScanMode(), getActiveDeviceId(), enemyZoid()?.id ?? null);

  const routeEnemies = () => {
    if (!isOnRoute()) { return []; }
    const route = currentLandmark() as Route;
    const resolved = resolveProbabilities(getUnlockedEnemies(route), (e) => e.probability);
    const grouped = new Map<string, number>();
    for (const entry of resolved) {
      const id = entry.item.blueprint.id;
      grouped.set(id, (grouped.get(id) ?? 0) + entry.probability);
    }
    return [...grouped.entries()].map(([id, probability]) => ({ id, probability }));
  };

  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <div class="enemy-header">
          <div />
          <h2 class="enemy-name">{enemyZoid()?.name ?? t('ui:unknown')}</h2>
          <Show when={isOnRoute()} fallback={<div />}>
            <button class="archive-button" onClick={() => setShowInfo(true)}>i</button>
          </Show>
        </div>
        <HealthBar />
        <div class={`battle-area bg-${battleBackground()}`} onClick={() => props.onClick()}>
          <Show when={scanRate() > 0}>
            <p class="scan-rate">
              {t('ui:scan_rate', { rate: scanRate() })}
            </p>
          </Show>
          {enemyZoid()?.id && (
            <img class="enemy-image" src={getZoidImage(enemyZoid()!.id)} alt={enemyZoid()!.name} />
          )}
          <DamageNumber />
          <RewardNumber />
          <div class="battle-bottom">
            <ScanToggle />
            <Show when={showClickHint()}>
              <p class="click-hint">{t('ui:click_hint')}</p>
            </Show>
          </div>
        </div>
      </div>
      <div class="divider" />
      <PlayerInfo />
      <Show when={showInfo()}>
        <div class="archive-overlay" onClick={() => setShowInfo(false)}>
          <div class="archive-panel" onClick={(e) => e.stopPropagation()}>
            <div class="archive-header">
              <span class="archive-title">{t('ui:route_enemies')}</span>
              <button class="archive-close" onClick={() => setShowInfo(false)}>✕</button>
            </div>
            <div class="archive-grid">
              <For each={routeEnemies()}>
                {(enemy) => (
                  <div class="route-enemy-wrapper">
                    <span class="route-enemy-probability">{formatProbability(enemy.probability)}</span>
                    <ArchiveCard id={enemy.id} status={getZoidResearch(enemy.id)} />
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default BattleScreen;
