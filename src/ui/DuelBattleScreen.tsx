import { Show, type Component } from 'solid-js';
import {
  DUEL_GAUGE_GOOD_ZONE,
  DUEL_GAUGE_OK_ZONE,
  DUEL_GAUGE_PERFECT_ZONE,
  DUEL_GAUGE_PHASE_DURATION,
  DUEL_TAPPING_PHASE_DURATION,
} from '../constants';
import { t } from '../i18n';
import { getPilotImage } from '../models/Pilot';
import { getZoidImage } from '../models/Zoid';
import {
  DuelTurnPhase,
  duelState,
  enemyZoid,
  pilotInfo,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
} from '../store/gameStore';
import { battleBackground } from '../store/landmarkStore';
import DamageNumber from './DamageNumber';
import HealthBar from './HealthBar';
import PlayerDamageNumber from './PlayerDamageNumber';
import PlayerHealthBar from './PlayerHealthBar';
import PlayerInfo from './PlayerInfo';
import './battle.css';
import './duel-battle.css';

interface DuelBattleScreenProps {
  onClick: () => void;
}

const CIRCLE_RADIUS = 10;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const TimerCircle: Component<{ duration: number; isEnemy: boolean; remaining: number }> = (props) => {
  const progress = () => Math.max(0, props.remaining / props.duration);
  const dashOffset = () => CIRCLE_CIRCUMFERENCE * (1 - progress());
  const seconds = () => Math.max(0, Math.ceil(props.remaining / 1000));

  return (
    <div class="duel-timer-circle">
      <svg viewBox="0 0 24 24">
        <circle class="duel-timer-bg" cx="12" cy="12" r={CIRCLE_RADIUS} />
        <circle
          class={`duel-timer-fill ${props.isEnemy ? 'enemy' : ''}`}
          cx="12"
          cy="12"
          r={CIRCLE_RADIUS}
          stroke-dasharray={String(CIRCLE_CIRCUMFERENCE)}
          stroke-dashoffset={String(dashOffset())}
        />
      </svg>
      <span class="duel-timer-text">{seconds()}</span>
    </div>
  );
};

const GUN_IMAGE = 'images/gauge/gun.png';

const PowerGauge: Component<{ fill: number; isEnemy: boolean; max: number }> = (props) => {
  const normalized = () => (props.max > 0 ? Math.min(1, props.fill / props.max) : 0);
  const clip = () => `inset(0 0 0 ${(1 - normalized()) * 100}%)`;
  const maskUrl = () => `url(${GUN_IMAGE})`;

  return (
    <div class={`power-gauge-container ${props.isEnemy ? 'enemy' : ''}`}>
      <img class="power-gauge-img-base" src={GUN_IMAGE} alt="" />
      <div
        class="power-gauge-fill"
        style={{
          '-webkit-mask-image': maskUrl(),
          'clip-path': clip(),
          'mask-image': maskUrl(),
        }}
      />
      <span class="power-gauge-text">{Math.floor(props.fill)}</span>
    </div>
  );
};

const AttackGauge: Component<{ position: number }> = (props) => {
  const okLeft = () => `${(0.5 - DUEL_GAUGE_OK_ZONE / 2) * 100}%`;
  const okWidth = () => `${DUEL_GAUGE_OK_ZONE * 100}%`;
  const goodLeft = () => `${(0.5 - DUEL_GAUGE_GOOD_ZONE / 2) * 100}%`;
  const goodWidth = () => `${DUEL_GAUGE_GOOD_ZONE * 100}%`;
  const perfectLeft = () => `${(0.5 - DUEL_GAUGE_PERFECT_ZONE / 2) * 100}%`;
  const perfectWidth = () => `${DUEL_GAUGE_PERFECT_ZONE * 100}%`;

  return (
    <div class="attack-gauge-container">
      <div class="attack-gauge-zone attack-gauge-zone-ok" style={{ left: okLeft(), width: okWidth() }} />
      <div class="attack-gauge-zone attack-gauge-zone-good" style={{ left: goodLeft(), width: goodWidth() }} />
      <div class="attack-gauge-zone attack-gauge-zone-perfect" style={{ left: perfectLeft(), width: perfectWidth() }} />
      <div class="attack-gauge-center" />
      <div class="attack-gauge-indicator" style={{ left: `${props.position * 100}%` }} />
    </div>
  );
};

const DuelBattleScreen: Component<DuelBattleScreenProps> = (props) => {
  const state = duelState;
  const isTapping = () => state().turnPhase === DuelTurnPhase.PlayerTapping;
  const isGauge = () => state().turnPhase === DuelTurnPhase.PlayerAiming;
  const isCountdown = () => state().turnPhase === DuelTurnPhase.AimDelay;
  const isPlayerAttack = () => state().turnPhase === DuelTurnPhase.PlayerAttack;
  const isEnemyAttack = () => state().turnPhase === DuelTurnPhase.EnemyAttack;
  const showGauges = () => isTapping() || isGauge() || isPlayerAttack();

  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{enemyZoid()?.name ?? t('ui:unknown')}</h2>
        <HealthBar />
        <div class={`battle-area bg-${battleBackground()}`} onClick={() => props.onClick()}>
          <div class="duel-arena">
            <Show when={state().playerZoid}>
              {(pz) => (
                <div class="duel-zoid-left">
                  <img src={getZoidImage(pz().id)} alt={pz().name} />
                  <span class="duel-zoid-label">{pz().name}</span>
                </div>
              )}
            </Show>
            <Show when={enemyZoid()}>
              {(ez) => (
                <div class="duel-zoid-right">
                  <img src={getZoidImage(ez().id, ez().imageOverride)} alt={ez().name} />
                  <span class="duel-zoid-label">{ez().name}</span>
                </div>
              )}
            </Show>
          </div>
          <Show when={isPlayerAttack()}>
            <div class="duel-projectile player" />
          </Show>
          <Show when={isEnemyAttack()}>
            <div class="duel-projectile enemy" />
          </Show>
          <div class="duel-damage-right">
            <DamageNumber />
          </div>
          <div class="duel-damage-left">
            <PlayerDamageNumber />
          </div>
          <Show when={pilotInfo()}>
            <div class="pilot-portrait">
              <span class="pilot-name">{t(`pilots:${pilotInfo()!.id}`)}</span>
              <div class="pilot-portrait-row">
                <img src={getPilotImage(pilotInfo()!.id)} alt={pilotInfo()!.name} />
              </div>
            </div>
          </Show>
          <Show when={isCountdown()}>
            <div class="duel-countdown-overlay">
              <span class="duel-countdown-text">{t('ui:aim')}</span>
            </div>
          </Show>
          <Show when={showGauges()}>
            <div class="duel-gauges-panel">
              <TimerCircle
                duration={isTapping() ? DUEL_TAPPING_PHASE_DURATION : DUEL_GAUGE_PHASE_DURATION}
                isEnemy={false}
                remaining={isTapping() ? state().currentPhaseTimer : state().aimTimeRemaining}
              />
              <Show when={isTapping()}>
                <PowerGauge fill={state().powerCharged} isEnemy={!state().isPlayerTurn} max={state().powerMax} />
              </Show>
              <Show when={isGauge() || isPlayerAttack()}>
                <AttackGauge position={state().aimIndicatorPosition} />
              </Show>
            </div>
          </Show>
          <div class="battle-bottom">
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

export default DuelBattleScreen;
