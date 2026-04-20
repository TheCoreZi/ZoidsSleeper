import { createSignal, For, Show, type Component } from 'solid-js';
import { calculateScanRate } from '../game/Scan';
import { t } from '../i18n';
import type { Route } from '../landmark';
import { getZoidImage } from '../models/Zoid';
import { enemyZoid, showClickHint } from '../store/gameStore';
import { battleBackground, currentLandmark, isOnRoute } from '../store/landmarkStore';
import { getActiveDeviceId, getActiveScanMode, ScanMode } from '../store/scanStore';
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

const BattleScreen: Component<BattleScreenProps> = (props) => {
  const [showInfo, setShowInfo] = createSignal(false);

  const routeEnemies = () => {
    if (!isOnRoute()) { return []; }
    const route = currentLandmark() as Route;
    return [...new Map(route.enemies.map((e) => [e.id, e])).values()];
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
          <Show when={getActiveScanMode() !== ScanMode.Off && getActiveDeviceId() && enemyZoid() && calculateScanRate(enemyZoid()!.id, getActiveDeviceId()!) > 0}>
            <p class="scan-rate">
              {t('ui:scan_rate', { rate: calculateScanRate(enemyZoid()!.id, getActiveDeviceId()!) })}
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
                {(enemy) => <ArchiveCard id={enemy.id} status={getZoidResearch(enemy.id)} />}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default BattleScreen;
