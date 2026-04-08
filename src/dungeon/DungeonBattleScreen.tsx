import { type Component, Show } from 'solid-js';
import { calculateScanRate } from '../game/Scan';
import { t } from '../i18n';
import { getZoidImage } from '../models/Zoid';
import {
  enemyZoid,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
} from '../store/gameStore';
import { battleBackground } from '../store/landmarkStore';
import { getActiveDeviceId, getActiveScanMode, ScanMode } from '../store/scanStore';
import DamageNumber from '../ui/DamageNumber';
import HealthBar from '../ui/HealthBar';
import PlayerHealthBar from '../ui/PlayerHealthBar';
import PlayerInfo from '../ui/PlayerInfo';
import ScanToggle from '../ui/ScanToggle';

interface Props {
  onClick: () => void;
}

const DungeonBattleScreen: Component<Props> = (props) => {
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
          <div class="battle-bottom">
            <ScanToggle />
            <PlayerHealthBar
              health={pilotPlayerHealth()}
              maxHealth={pilotPlayerMaxHealth()}
              percent={pilotPlayerHealthPercent()}
            />
          </div>
        </div>
      </div>
      <div class="divider" />
      <PlayerInfo />
    </div>
  );
};

export default DungeonBattleScreen;
