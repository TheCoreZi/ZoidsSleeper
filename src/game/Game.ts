import { TICK_TIME } from '../constants';
import { CAMPAIGNS } from '../campaign/campaigns';
import { t } from '../i18n';
import type { City, Landmark, Route } from '../landmark';
import { Currency } from '../models/Currency';
import type { Pilot } from '../models/Pilot';
import { ActionFightPilot, ActionTalkToNPC, ActionVisitDepot, getCity, getLandmarkHints, getRoute, isLandmarkUnlocked, isRoute, ROUTES } from '../landmark';
import { REGIONS } from '../map/Region';
import { DEFAULT_PLAYER } from '../models/Player';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { loadCampaigns, markNpcTalked, checkCampaigns } from '../store/campaignStore';
import {
  battleState,
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
  setActiveShop,
  setPopupMessage,
} from '../store/gameStore';
import { setCurrentLandmark } from '../store/landmarkStore';
import { setParty } from '../store/partyStore';
import { incrementPilotDefeats, loadStatistics } from '../store/statisticsStore';
import { loadInventory } from '../store/inventoryStore';
import { addCurrency, loadWallet } from '../store/walletStore';
import { BaseBattle } from './BaseBattle';
import { Battle } from './Battle';
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
      setBattleState('idle');
      setEnemyZoid(null);
    }
  }

  changeLocation(landmark: Landmark): void {
    if (!isLandmarkUnlocked(landmark)) {
      const hints = getLandmarkHints(landmark);
      setPopupMessage(new PopupMessage(hints.join('\n'), t('ui:locked'), PopupType.Defeat));
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }
    setCurrentLandmark(landmark);
    this.wireCityActions(landmark);
    if (isRoute(landmark)) {
      this.startBattle(landmark);
    } else {
      this.battle = null;
      setBattleState('idle');
      setEnemyZoid(null);
    }
    this.save.store();
  }

  completeIntro(zoidId: string): void {
    setParty([{ experience: 0, id: zoidId }]);
    setBattleState('idle');
    setEnemyZoid(null);
    setGamePhase('playing');
    setShowClickHint(false);
    checkCampaigns();
    this.loop.start();
    this.save.store();
  }

  enterPilotBattle(pilot: Pilot): void {
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    battle.onDefeat = () => this.endPilotBattle(new PopupMessage(t('ui:not_strong_enough', { name: t(`pilots:${pilot.id}`) }), t('ui:defeated'), PopupType.Defeat));
    battle.onVictory = () => {
      addCurrency(Currency.Magnis, pilot.magnisReward);
      incrementPilotDefeats(pilot.id);
      checkCampaigns();
      this.endPilotBattle(new PopupMessage(t('ui:pilot_defeated', { name: t(`pilots:${pilot.id}`) }), t('ui:victory'), PopupType.Victory));
    };
    this.battle = battle;
    setPilotInfo({ id: pilot.id, name: pilot.name });
    setBattleState('pilot-fighting');
  }

  start(): void {
    if (this.hasSave) {
      setGamePhase('playing');
      this.loop.start();
    } else {
      setGamePhase('intro');
    }
  }

  stop(): void {
    this.loop.stop();
  }

  private endPilotBattle(popup: PopupMessage): void {
    setPilotInfo(null);
    setPilotEnemyProgress({ current: 0, total: 0 });
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setPilotZoidIds([]);
    this.battle = null;
    setBattleState('idle');
    setEnemyZoid(null);
    setPopupMessage(popup);
    setTimeout(() => setPopupMessage(null), 3000);
  }

  private gameTick(): void {
    switch (battleState()) {
      case 'fighting':
      case 'pilot-fighting':
        this.battle?.gameTick();
        break;
    }
    this.save.gameTick();
  }

  private startBattle(route: Route): void {
    this.battle = new Battle(DEFAULT_PLAYER, route);
    setBattleState('fighting');
  }

  private wireCityActions(landmark: Landmark): void {
    const city = landmark as City;
    city.actions?.forEach((action) => {
      if (action instanceof ActionFightPilot) {
        action.onExecute = () => this.enterPilotBattle(action.pilot);
      } else if (action instanceof ActionTalkToNPC) {
        action.onExecute = () => {
          markNpcTalked(action.npcId);
          setActiveDialog(action.script);
          checkCampaigns();
        };
      } else if (action instanceof ActionVisitDepot) {
        action.onExecute = () => setActiveShop({ items: action.items });
      }
    });
  }

  private loadSave(): boolean {
    const data = this.save.load();
    if (data) {
      setShowClickHint(false);
      if (data.party?.length) {
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
      loadCampaigns(CAMPAIGNS, data.campaigns ?? {});
      return true;
    }
    return false;
  }

  private loadSavedLandmark(): Landmark {
    const data = this.save.load();
    const id = data?.landmarkId ?? REGIONS[0].initialLandmark;
    return getRoute(id) ?? getCity(id) ?? ROUTES[0];
  }
}
