import { createMemo, createSignal } from 'solid-js';
import type { PlayerStats } from '../models/Player';
import type { PopupMessage } from '../models/PopupMessage';
import type { DialogScript } from '../story/Dialog';
import type { ShopData } from '../ui/ShopPanel';
import type { SpawnedZoid } from '../models/Zoid';

export const BattleState = {
  DungeonBoss: 'dungeon-boss',
  DungeonCombat: 'dungeon-combat',
  Idle: 'idle',
  PilotCombat: 'pilot-combat',
  WildCombat: 'wild-combat',
} as const;
export type BattleState = (typeof BattleState)[keyof typeof BattleState];

export const GamePhase = {
  Intro: 'intro',
  Playing: 'playing',
} as const;
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];
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

const [battleState, setBattleState] = createSignal<BattleState>(BattleState.WildCombat);
const [gamePhase, setGamePhase] = createSignal<GamePhase>(GamePhase.Playing);
const [damageEvents, setDamageEvents] = createSignal<DamageEvent[]>([]);
const [enemyZoid, setEnemyZoid] = createSignal<SpawnedZoid | null>(null);
const [rewardEvents, setRewardEvents] = createSignal<RewardEvent[]>([]);
const [pilotEnemyProgress, setPilotEnemyProgress] = createSignal({ current: 0, total: 0 });
const [pilotInfo, setPilotInfo] = createSignal<PilotInfo | null>(null);
const [playerDamageEvents, setPlayerDamageEvents] = createSignal<DamageEvent[]>([]);
const [pilotPlayerHealth, setPilotPlayerHealth] = createSignal(0);
const [pilotPlayerMaxHealth, setPilotPlayerMaxHealth] = createSignal(0);
const [pilotZoidIds, setPilotZoidIds] = createSignal<{ id: string; imageOverride?: string }[]>([]);
const [playerStats, setPlayerStats] = createSignal<PlayerStats | null>(null);
const [showClickHint, setShowClickHint] = createSignal(true);
const [activeDialog, setActiveDialog] = createSignal<DialogScript | null>(null);
const [dialogQueue, setDialogQueue] = createSignal<DialogScript[]>([]);

function dequeueDialog(): DialogScript | undefined {
  const queue = dialogQueue();
  if (queue.length === 0) {return undefined;}
  const [next, ...rest] = queue;
  setDialogQueue(rest);
  return next;
}

function enqueueDialog(script: DialogScript): void {
  if (!activeDialog()) {
    setActiveDialog(script);
  } else {
    setDialogQueue((q) => [...q, script]);
  }
}
export interface LabData {
  labId: string;
}

const [activeLab, setActiveLab] = createSignal<LabData | null>(null);
const [activeShop, setActiveShop] = createSignal<ShopData | null>(null);
const [popupMessage, setPopupMessage] = createSignal<PopupMessage | null>(null);

function incrementClickAttack(amount = 1): void {
  setPlayerStats((prev) => prev ? { ...prev, clickAttack: prev.clickAttack + amount } : prev);
}

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
  activeLab,
  activeShop,
  battleState,
  damageEvents,
  dequeueDialog,
  enqueueDialog,
  enemyHealthPercent,
  enemyZoid,
  gamePhase,
  incrementClickAttack,
  pilotEnemyProgress,
  pilotInfo,
  playerDamageEvents,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
  pilotZoidIds,
  playerStats,
  rewardEvents,
  setActiveDialog,
  setActiveLab,
  setActiveShop,
  setBattleState,
  setDamageEvents,
  setGamePhase,
  setEnemyZoid,
  setPlayerDamageEvents,
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
