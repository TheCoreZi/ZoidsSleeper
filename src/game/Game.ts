import { TICK_TIME } from '../constants';
import { REGIONS } from '../map/Region';
import type { City } from '../models/City';
import { getCity } from '../models/City';
import { ActionFightPilot, ActionTalkToNPC } from '../models/CityAction';
import type { Landmark } from '../models/Landmark';
import { isRoute } from '../models/Landmark';
import type { Pilot } from '../models/Pilot';
import { getLandmarkHints, isLandmarkUnlocked } from '../models/Requirement';
import { type Route, getRoute, ROUTES } from '../models/Route';
import { DEFAULT_PLAYER } from '../models/Player';
import { PopupMessage, PopupType } from '../models/PopupMessage';
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
  setPopupMessage,
} from '../store/gameStore';
import { setCurrentLandmark } from '../store/landmarkStore';
import { setParty } from '../store/partyStore';
import { loadStatistics } from '../store/statisticsStore';
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
      setPopupMessage(new PopupMessage(hints.join('\n'), 'Locked', PopupType.Defeat));
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
    this.loop.start();
    this.save.store();
  }

  enterPilotBattle(pilot: Pilot): void {
    const battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    battle.onDefeat = () => this.endPilotBattle(new PopupMessage(`You're not strong enough to defeat ${pilot.name}. Upgrade your army and come back!`, 'Defeated!', PopupType.Defeat));
    battle.onVictory = () => this.endPilotBattle(new PopupMessage(`${pilot.name} has been defeated!`, 'Victory!', PopupType.Victory));
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
        action.onExecute = () => setActiveDialog(action.script);
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
      if (data.routeKills) {
        loadStatistics(data.routeKills);
      }
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
