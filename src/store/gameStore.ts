import { createMemo, createSignal } from 'solid-js';
import type { PlayerStats } from '../models/Player';
import type { PopupMessage } from '../models/PopupMessage';
import type { DialogScript } from '../story/Dialog';
import type { ShopData } from '../ui/ShopPanel';
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

export interface RewardEvent {
  amount: number;
  id: number;
}

const [battleState, setBattleState] = createSignal<BattleState>('fighting');
const [gamePhase, setGamePhase] = createSignal<GamePhase>('playing');
const [damageEvents, setDamageEvents] = createSignal<DamageEvent[]>([]);
const [enemyZoid, setEnemyZoid] = createSignal<ZoidInstance | null>(null);
const [rewardEvents, setRewardEvents] = createSignal<RewardEvent[]>([]);
const [pilotEnemyProgress, setPilotEnemyProgress] = createSignal({ current: 0, total: 0 });
const [pilotInfo, setPilotInfo] = createSignal<PilotInfo | null>(null);
const [pilotPlayerHealth, setPilotPlayerHealth] = createSignal(0);
const [pilotPlayerMaxHealth, setPilotPlayerMaxHealth] = createSignal(0);
const [pilotZoidIds, setPilotZoidIds] = createSignal<string[]>([]);
const [playerStats, setPlayerStats] = createSignal<PlayerStats | null>(null);
const [showClickHint, setShowClickHint] = createSignal(true);
const [activeDialog, setActiveDialog] = createSignal<DialogScript | null>(null);
const [activeShop, setActiveShop] = createSignal<ShopData | null>(null);
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
  activeDialog,
  activeShop,
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
  rewardEvents,
  setActiveDialog,
  setActiveShop,
  setBattleState,
  setDamageEvents,
  setGamePhase,
  setEnemyZoid,
  setPilotEnemyProgress,
  setPilotInfo,
  setPilotPlayerHealth,
  setRewardEvents,
  setPilotPlayerMaxHealth,
  setPilotZoidIds,
  setPlayerStats,
  setShowClickHint,
  popupMessage,
  setPopupMessage,
  showClickHint,
};
