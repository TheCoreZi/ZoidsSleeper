import { createMemo, createSignal } from 'solid-js';
import type { PlayerStats } from '../models/Player';
import type { PopupMessage } from '../models/PopupMessage';
import type { ZoidInstance } from '../models/Zoid';

export type BattleState = 'fighting' | 'idle' | 'pilot-fighting' | 'victory';
export type GamePhase = 'intro' | 'playing';
export type DamageSource = 'auto' | 'click';

export interface DamageEvent {
  amount: number;
  id: number;
  source: DamageSource;
  timestamp: number;
}

export interface PilotInfo {
  id: string;
  name: string;
}

const [battleState, setBattleState] = createSignal<BattleState>('fighting');
const [gamePhase, setGamePhase] = createSignal<GamePhase>('playing');
const [damageEvents, setDamageEvents] = createSignal<DamageEvent[]>([]);
const [enemyZoid, setEnemyZoid] = createSignal<ZoidInstance | null>(null);
const [pilotEnemyProgress, setPilotEnemyProgress] = createSignal({ current: 0, total: 0 });
const [pilotInfo, setPilotInfo] = createSignal<PilotInfo | null>(null);
const [pilotPlayerHealth, setPilotPlayerHealth] = createSignal(0);
const [pilotPlayerMaxHealth, setPilotPlayerMaxHealth] = createSignal(0);
const [pilotZoidIds, setPilotZoidIds] = createSignal<string[]>([]);
const [playerStats, setPlayerStats] = createSignal<PlayerStats | null>(null);
const [showClickHint, setShowClickHint] = createSignal(true);
const [popupMessage, setPopupMessage] = createSignal<PopupMessage | null>(null);

const enemyHealthPercent = createMemo(() => {
  const enemy = enemyZoid();
  return enemy ? Math.floor((enemy.health / enemy.maxHealth) * 100) : 0;
});

const pilotPlayerHealthPercent = createMemo(() => {
  const max = pilotPlayerMaxHealth();
  return max > 0 ? Math.floor((pilotPlayerHealth() / max) * 100) : 0;
});

export {
  battleState,
  damageEvents,
  enemyHealthPercent,
  enemyZoid,
  gamePhase,
  pilotEnemyProgress,
  pilotInfo,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
  pilotZoidIds,
  playerStats,
  setBattleState,
  setDamageEvents,
  setGamePhase,
  setEnemyZoid,
  setPilotEnemyProgress,
  setPilotInfo,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
  setPilotZoidIds,
  setPlayerStats,
  setShowClickHint,
  popupMessage,
  setPopupMessage,
  showClickHint,
};
