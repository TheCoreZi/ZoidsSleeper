import { TICK_TIME } from '../constants';
import { CAMPAIGNS } from '../campaign/campaigns';
import { DungeonBattle } from '../dungeon/DungeonBattle';
import { DungeonSortieEvent } from '../dungeon/DungeonSortieEvent';
import {
  advanceLayer,
  DungeonPhase,
  dungeonRun,
  endDungeon,
  findNode,
  isPlayerDead,
  markNodeCompleted,
  selectNode,
  setDungeonPhase,
  startSortie,
} from '../dungeon/dungeonStore';
import { SortieNodeType } from '../dungeon/DungeonGraph';
import { t } from '../i18n';
import { DialogScript } from '../dialog/Dialog';
import type { City, Landmark, Route } from '../landmark';
import { ActionDuelPilot, ActionFightPilot, ActionPlayCutscene, ActionTalkToNPC, ActionVisitDepot, ActionVisitLab, getLandmarkById, getLandmarkHints, isLandmarkUnlocked, isRoute, ROUTES } from '../landmark';
import type { Dungeon } from '../landmark';
import { REGIONS } from '../map/Region';
import { Currency } from '../models/Currency';
import type { Pilot } from '../models/Pilot';
import { DEFAULT_PLAYER } from '../models/Player';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { ZoidResearchStatus } from '../models/Zoid';
import { loadCampaigns, markNpcTalked, checkCampaigns } from '../store/campaignStore';
import {
  BattleState,
  battleState,
  DEFAULT_DUEL_STATE,
  GamePhase,
  setBattleState,
  setEnemyZoid,
  setGamePhase,
  setPilotEnemyProgress,
  setPilotInfo,
  setPilotPlayerHealth,
  setPilotPlayerMaxHealth,
  setPilotZoidIds,
  setPlayerStats,
  setShowClickHint,
  setActiveDialog,
  setActiveLab,
  setActiveShop,
  emitRewardEvent,
  setDuelState,
  showPopup,
  setRewardEvents,
} from '../store/gameStore';
import { setCurrentLandmark } from '../store/landmarkStore';
import { addZoidToArmy, partyMaxHealth, setParty } from '../store/partyStore';
import { incrementPilotDefeats, loadStatistics } from '../store/statisticsStore';
import { loadInventory } from '../store/inventoryStore';
import { loadScanSetup } from '../store/scanStore';
import { addCurrency, loadWallet } from '../store/walletStore';
import { loadZoidData } from '../store/zoidDataStore';
import { loadZoidResearch, updateZoidResearch } from '../store/zoidResearchStore';
import { BaseBattle } from './BaseBattle';
import { Battle } from './Battle';
import { DuelBattle } from './DuelBattle';
import { GameLoop } from './GameLoop';
import { PilotBattle } from './PilotBattle';
import { Save } from './Save';

export class Game {
  battle: BaseBattle | null = null;
  hasSave = false;
  loop: GameLoop;
  save: Save;

  constructor() {
    this.save = new Save();
    const savedLandmark = this.loadSavedLandmark();
    this.loop = new GameLoop(TICK_TIME, () => this.gameTick());
    setCurrentLandmark(savedLandmark);
    setPlayerStats(DEFAULT_PLAYER);
    this.hasSave = this.loadSave();
    if (!this.hasSave) {
      loadCampaigns(CAMPAIGNS, {});
    }
    this.wireCityActions(savedLandmark);
    if (isRoute(savedLandmark)) {
      this.startBattle(savedLandmark);
    } else {
      setBattleState(BattleState.Idle);
      setEnemyZoid(null);
    }
  }

  changeLocation(landmark: Landmark): void {
    if (!isLandmarkUnlocked(landmark)) {
      const hints = getLandmarkHints(landmark);
      showPopup(new PopupMessage(hints.join('\n'), t('ui:locked'), PopupType.Defeat));
      return;
    }
    if (dungeonRun()) {
      this.endDungeonRun(false);
    }
    setCurrentLandmark(landmark);
    this.wireCityActions(landmark);
    if (isRoute(landmark)) {
      this.startBattle(landmark);
    } else {
      this.battle = null;
      setBattleState(BattleState.Idle);
      setEnemyZoid(null);
    }
    this.save.store();
  }

  completeIntro(zoidId: string): void {
    addZoidToArmy(zoidId);
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    setGamePhase(GamePhase.Playing);
    setShowClickHint(false);
    checkCampaigns();
    this.loop.start();
    this.save.store();
  }

  endDungeonRun(victory: boolean): void {
    this.battle = null;
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    setPilotInfo(null);
    setPilotEnemyProgress({ current: 0, total: 0 });
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setPilotZoidIds([]);
    if (victory) {
      checkCampaigns();
      showPopup(new PopupMessage(t('ui:sortie_complete'), t('ui:victory'), PopupType.Victory));
    } else {
      showPopup(new PopupMessage(t('ui:sortie_failed'), t('ui:defeated'), PopupType.Defeat));
    }
    endDungeon();

  }

  enterDungeon(sortieEvent: DungeonSortieEvent): void {
    addCurrency(Currency.ZiMetal, -sortieEvent.entryCost);
    const maxHealth = DEFAULT_PLAYER.baseHealth + partyMaxHealth();
    startSortie(sortieEvent, maxHealth, maxHealth);
    this.battle = null;
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    setRewardEvents([]);
  }

  enterDuelBattle(pilot: Pilot): void {
    const battle = new DuelBattle(DEFAULT_PLAYER, pilot);
    battle.onDefeat = () => {
      this.endDuelBattle(new PopupMessage(t('ui:not_strong_enough', { name: t(`pilots:${pilot.id}`) }), t('ui:defeated'), PopupType.Defeat));
    };
    battle.onVictory = () => {
      addCurrency(Currency.Magnis, pilot.magnisReward);
      incrementPilotDefeats(pilot.id);
      checkCampaigns();
      this.endDuelBattle(new PopupMessage(t('ui:pilot_defeated', { name: t(`pilots:${pilot.id}`) }), t('ui:victory'), PopupType.Victory));
    };
    this.battle = battle;
    setBattleState(BattleState.DuelCombat);
  }

  enterPilotBattle(pilot: Pilot, unwinnable = false): void {
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    battle.onDefeat = () => {
      if (unwinnable) {
        incrementPilotDefeats(pilot.id);
        checkCampaigns();
      }
      this.endPilotBattle(new PopupMessage(t('ui:not_strong_enough', { name: t(`pilots:${pilot.id}`) }), t('ui:defeated'), PopupType.Defeat));
    };
    battle.onVictory = () => {
      addCurrency(Currency.Magnis, pilot.magnisReward);
      incrementPilotDefeats(pilot.id);
      checkCampaigns();
      this.endPilotBattle(new PopupMessage(t('ui:pilot_defeated', { name: t(`pilots:${pilot.id}`) }), t('ui:victory'), PopupType.Victory));
    };
    this.battle = battle;
    setBattleState(BattleState.PilotCombat);
  }

  selectDungeonNode(nodeId: string): void {
    const run = dungeonRun();
    if (!run) {return;}
    const node = findNode(run.graph, nodeId);
    if (!node) {return;}

    selectNode(nodeId);

    switch (node.type) {
      case SortieNodeType.Boss:
        this.startDungeonBoss();
        break;
      case SortieNodeType.Combat:
      case SortieNodeType.Elite:
        this.startDungeonCombat(run.config, node.type);
        break;
      case SortieNodeType.Event:
        setDungeonPhase(DungeonPhase.Event);
        break;
      case SortieNodeType.Supply:
        setDungeonPhase(DungeonPhase.Supply);
        break;
    }
  }

  ambushFromEvent(): void {
    const run = dungeonRun();
    if (!run) {return;}
    this.startDungeonCombat(run.config, SortieNodeType.Combat);
  }

  completeDungeonNode(): void {
    const run = dungeonRun();
    if (!run?.currentNodeId) {return;}
    markNodeCompleted(run.currentNodeId);
    const node = findNode(run.graph, run.currentNodeId);

    if (node?.type === SortieNodeType.Boss) {
      this.endDungeonRun(true);
      return;
    }

    if (isPlayerDead()) {
      this.endDungeonRun(false);
      return;
    }

    this.battle = null;
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    advanceLayer();
  }

  start(): void {
    if (this.hasSave) {
      setGamePhase(GamePhase.Playing);
      this.loop.start();
    } else {
      setGamePhase(GamePhase.Intro);
    }
  }

  stop(): void {
    this.loop.stop();
  }

  private endDuelBattle(popup: PopupMessage): void {
    setPilotInfo(null);
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setDuelState(DEFAULT_DUEL_STATE);
    this.battle = null;
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    showPopup(popup);

  }

  private endPilotBattle(popup: PopupMessage): void {
    setPilotInfo(null);
    setPilotEnemyProgress({ current: 0, total: 0 });
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setPilotZoidIds([]);
    this.battle = null;
    setBattleState(BattleState.Idle);
    setEnemyZoid(null);
    showPopup(popup);

  }

  private gameTick(): void {
    switch (battleState()) {
      case BattleState.DuelCombat:
      case BattleState.DungeonBoss:
      case BattleState.DungeonCombat:
      case BattleState.WildCombat:
      case BattleState.PilotCombat:
        this.battle?.gameTick();
        break;
    }
    this.save.gameTick();
  }

  private startDungeonBoss(): void {
    const run = dungeonRun();
    if (!run) {return;}
    const boss = run.bossPilot;
    const battle = new PilotBattle(
      DEFAULT_PLAYER,
      boss,
      run.playerHealth,
      run.playerMaxHealth
    );
    battle.onVictory = () => {
      addCurrency(Currency.Magnis, boss.magnisReward);
      emitRewardEvent(boss.magnisReward, 'magnis');
      incrementPilotDefeats(boss.id);
      this.completeDungeonNode();
    };
    battle.onDefeat = () => {
      this.endDungeonRun(false);
    };
    this.battle = battle;
    setBattleState(BattleState.DungeonBoss);
    setDungeonPhase(DungeonPhase.Boss);
  }

  private startDungeonCombat(config: DungeonSortieEvent, nodeType: SortieNodeType): void {
    const battle = new DungeonBattle(DEFAULT_PLAYER, config, nodeType);
    battle.onNodeComplete = () => this.completeDungeonNode();
    battle.onDefeat = () => {
      this.endDungeonRun(false);
    };
    this.battle = battle;
    setBattleState(BattleState.DungeonCombat);
    setDungeonPhase(DungeonPhase.Combat);
  }

  private startBattle(route: Route): void {
    this.battle = new Battle(DEFAULT_PLAYER, route);
    setBattleState(BattleState.WildCombat);
  }

  private wireCityActions(landmark: Landmark): void {
    const city = landmark as City | Dungeon;
    city.actions?.forEach((action) => {
      if (action instanceof ActionDuelPilot) {
        action.onExecute = () => this.enterDuelBattle(action.pilot);
      } else if (action instanceof DungeonSortieEvent) {
        action.onExecute = () => this.enterDungeon(action);
      } else if (action instanceof ActionFightPilot) {
        action.onExecute = () => this.enterPilotBattle(action.pilot, action.unwinnable);
      } else if (action instanceof ActionPlayCutscene) {
        action.onExecute = () => {
          setActiveDialog(new DialogScript(action.cutscene.toDialogScript().lines, action.reward));
        };
      } else if (action instanceof ActionTalkToNPC) {
        action.onExecute = () => {
          markNpcTalked(action.npcId);
          setActiveDialog(action.script);
        };
      } else if (action instanceof ActionVisitDepot) {
        action.onExecute = () => setActiveShop({ items: action.items });
      } else if (action instanceof ActionVisitLab) {
        action.onExecute = () => setActiveLab({ labId: action.labId });
      }
    });
  }

  private loadSave(): boolean {
    const data = this.save.load();
    if (data) {
      setShowClickHint(false);
      if (data.party?.zoids?.length) {
        setParty(data.party);
      }
      if (data.routeKills || data.pilotDefeats) {
        loadStatistics(data.routeKills ?? {}, data.pilotDefeats ?? {});
      }
      if (data.inventory) {
        loadInventory(data.inventory);
      }
      if (data.wallet) {
        loadWallet(data.wallet);
      }
      if (data.zoidData) {
        loadZoidData(data.zoidData);
      }
      if (data.playerStats) {
        setPlayerStats({ ...data.playerStats, attackMult: data.playerStats.attackMult ?? 1 });
      }
      if (data.scanSetup) {
        loadScanSetup(data.scanSetup);
      }
      if (data.zoidResearch) {
        loadZoidResearch(data.zoidResearch);
      }
      data.party?.zoids.forEach((z) => updateZoidResearch(z.id, ZoidResearchStatus.Created));
      loadCampaigns(CAMPAIGNS, data.campaigns ?? {});
      return true;
    }
    return false;
  }

  private loadSavedLandmark(): Landmark {
    const data = this.save.load();
    const id = data?.landmarkId ?? REGIONS[0].initialLandmark;
    return getLandmarkById(id) ?? ROUTES[0];
  }
}
