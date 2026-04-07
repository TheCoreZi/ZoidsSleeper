import { Show, type Component } from 'solid-js';
import { calculateScanRate } from '../game/Scan';
import { t } from '../i18n';
import { getZoidImage } from '../models/Zoid';
import { enemyZoid, showClickHint } from '../store/gameStore';
import { battleBackground } from '../store/landmarkStore';
import { getActiveDeviceId, getActiveScanMode, ScanMode } from '../store/scanStore';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerInfo from './PlayerInfo';
import RewardNumber from './RewardNumber';
import ScanToggle from './ScanToggle';

interface BattleScreenProps {
  onClick: () => void;
}

const BattleScreen: Component<BattleScreenProps> = (props) => {
  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{enemyZoid()?.name ?? t('ui:unknown')}</h2>
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
    </div>
  );
};

export default BattleScreen;
