import { createMemo, createSignal } from 'solid-js';
import type { Faction } from '../models/Faction';
import type { PlayerStats } from '../models/Player';
import type { PopupMessage } from '../models/PopupMessage';
import type { DialogScript } from '../dialog/Dialog';
import type { ShopData } from '../ui/ShopPanel';
import type { CustomizedZoid, SpawnedZoid } from '../models/Zoid';

export const BattleState = {
  DuelCombat: 'duel-combat',
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
  currency: string;
  id: number;
}

export const DuelTurnPhase = {
  EnemyAttack: 'enemy-attack',
  AimDelay: 'gauge-countdown',
  PlayerAttack: 'player-attack',
  PlayerAiming: 'player-gauge',
  PlayerTapping: 'player-tapping',
} as const;
export type DuelTurnPhase = (typeof DuelTurnPhase)[keyof typeof DuelTurnPhase];

export interface DuelBattleState {
  aimIndicatorPosition: number;
  aimTimeRemaining: number;
  isPlayerTurn: boolean;
  currentPhaseTimer: number;
  playerZoid: CustomizedZoid | null;
  powerCharged: number;
  powerMax: number;
  turnPhase: DuelTurnPhase;
}

export const DEFAULT_DUEL_STATE: DuelBattleState = {
  aimIndicatorPosition: 0,
  aimTimeRemaining: 0,
  isPlayerTurn: true,
  currentPhaseTimer: 0,
  playerZoid: null,
  powerCharged: 0,
  powerMax: 0,
  turnPhase: DuelTurnPhase.PlayerTapping,
};

const [battleState, setBattleState] = createSignal<BattleState>(BattleState.WildCombat);
const [gamePhase, setGamePhase] = createSignal<GamePhase>(GamePhase.Playing);
const [damageEvents, setDamageEvents] = createSignal<DamageEvent[]>([]);
const [duelState, setDuelState] = createSignal<DuelBattleState>(DEFAULT_DUEL_STATE);
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
const popupQueue: PopupMessage[] = [];

function clearCurrentPopup(): void {
  const next = popupQueue.shift();
  if (next) {
    setPopupMessage(next);
    setTimeout(clearCurrentPopup, 3000);
  } else {
    setPopupMessage(null);
  }
}

function showPopup(popup: PopupMessage): void {
  if (popupMessage()) {
    popupQueue.push(popup);
  } else {
    setPopupMessage(popup);
    setTimeout(clearCurrentPopup, 3000);
  }
}

function incrementClickAttack(amount = 1): void {
  setPlayerStats((prev) => prev ? { ...prev, clickAttack: prev.clickAttack + amount } : prev);
}

function setPlayerFaction(faction: Faction): void {
  setPlayerStats((prev) => prev ? { ...prev, faction } : prev);
}

let rewardIdCounter = 0;

function emitRewardEvent(amount: number, currency: string): void {
  if (amount <= 0) {return;}
  setRewardEvents((prev) => [...prev.slice(-4), { amount, currency, id: rewardIdCounter++ }]);
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
  duelState,
  emitRewardEvent,
  enemyHealthPercent,
  enemyZoid,
  enqueueDialog,
  gamePhase,
  incrementClickAttack,
  pilotEnemyProgress,
  pilotInfo,
  pilotPlayerHealth,
  pilotPlayerHealthPercent,
  pilotPlayerMaxHealth,
  pilotZoidIds,
  playerDamageEvents,
  playerStats,
  popupMessage,
  rewardEvents,
  setActiveDialog,
  setActiveLab,
  setActiveShop,
  setBattleState,
  setDamageEvents,
  setDuelState,
  setEnemyZoid,
  setGamePhase,
  setPilotEnemyProgress,
  setPilotInfo,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
  setPilotZoidIds,
  setPlayerDamageEvents,
  setPlayerFaction,
  setPlayerStats,
  showPopup,
  setRewardEvents,
  setShowClickHint,
  showClickHint,
};
