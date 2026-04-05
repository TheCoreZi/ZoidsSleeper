import { TICK_TIME } from '../constants';
import { REGIONS } from '../map/Region';
import { getCity } from '../models/City';
import type { Landmark } from '../models/Landmark';
import { isRoute } from '../models/Landmark';
import { type Route, getRoute, ROUTES } from '../models/Route';
import { randomPilot } from '../models/Pilot';
import { DEFAULT_PLAYER } from '../models/Player';
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
  setVictoryMessage,
} from '../store/gameStore';
import { currentLandmark, setCurrentLandmark } from '../store/landmarkStore';
import { setParty } from '../store/partyStore';
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
    if (isRoute(savedLandmark)) {
      this.startBattle(savedLandmark);
    } else {
      setBattleState('idle');
      setEnemyZoid(null);
    }
  }

  changeLocation(landmark: Landmark): void {
    setCurrentLandmark(landmark);
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

  enterPilotBattle(): void {
    const pilot = randomPilot();
    this.battle = new PilotBattle(DEFAULT_PLAYER, pilot);
    setPilotInfo({ id: pilot.id, name: pilot.name });
    setBattleState('pilot-fighting');
  }

  exitPilotBattle(): void {
    setPilotInfo(null);
    setPilotEnemyProgress({ current: 0, total: 0 });
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setPilotZoidIds([]);
    const landmark = currentLandmark();
    if (isRoute(landmark)) {
      this.startBattle(landmark);
    } else {
      this.battle = null;
      setBattleState('idle');
      setEnemyZoid(null);
    }
  }

  retryPilotBattle(): void {
    (this.battle as PilotBattle)?.restart();
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

  private startBattle(route: Route): void {
    const battle = new Battle(DEFAULT_PLAYER, route);
    battle.onPilotEncounter = () => this.enterPilotBattle();
    this.battle = battle;
    setBattleState('fighting');
  }

  private gameTick(): void {
    switch (battleState()) {
      case 'fighting':
      case 'pilot-fighting':
        this.battle?.gameTick();
        break;
      case 'pilot-victory':
        this.handlePilotVictory();
        break;
    }
    this.save.gameTick();
  }

  private handlePilotVictory(): void {
    const name = (this.battle as PilotBattle)?.pilot.name ?? 'Pilot';
    this.exitPilotBattle();
    setVictoryMessage(`${name} has been defeated!`);
    setTimeout(() => setVictoryMessage(null), 3000);
  }

  private loadSave(): boolean {
    const data = this.save.load();
    if (data) {
      setShowClickHint(false);
      if (data.party?.length) {
        setParty(data.party);
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
