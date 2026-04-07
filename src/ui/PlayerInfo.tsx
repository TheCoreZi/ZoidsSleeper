import { Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { CITIES, findRouteKillRequirement } from '../landmark';
import { playerStats } from '../store/gameStore';
import { currentLandmark, isOnRoute } from '../store/landmarkStore';
import { partyAttack } from '../store/partyStore';
import { getRouteKills } from '../store/statisticsStore';

const PlayerInfo: Component = () => {
  const pendingKillReq = () => {
    const req = findRouteKillRequirement(CITIES, currentLandmark().id);
    return req && !req.isCompleted() ? req : null;
  };

  return (
    <div class="player-info">
      <Show when={isOnRoute()}>
        <div class="player-stats-row">
          <span class="player-stat-label">{t(`locations:${currentLandmark().id}`)}</span>
          <Show
            when={pendingKillReq()}
            fallback={<span class="player-stat-label">{t('ui:zoids_defeated')}: <span class="player-stat-value">{getRouteKills(currentLandmark().id)}</span></span>}
          >
            {(req) => <span class="player-stat-label">{t('ui:fights_completed')}: <span class="player-stat-value">{req().progress()}/{req().requiredValue}</span></span>}
          </Show>
        </div>
      </Show>
      <div class="player-stats-row">
        <div class="player-stat">
          <span class="player-stat-label">{t('ui:total_attack')}</span>
          <span class="player-stat-value">{partyAttack()}</span>
        </div>
        <div class="player-stat">
          <span class="player-stat-label">{t('ui:manual_attack')}</span>
          <span class="player-stat-value">{playerStats()?.clickAttack ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
