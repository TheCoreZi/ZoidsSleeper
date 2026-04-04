import { TICK_TIME } from '../constants';
import { randomPilot } from '../models/Pilot';
import { DEFAULT_PLAYER } from '../models/Player';
import { getRoute, ROUTES } from '../models/Route';
import {
  battleState,
  setBattleState,
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
import { setParty } from '../store/partyStore';
import { setCurrentRoute } from '../store/routeStore';
import { Battle } from './Battle';
import { GameLoop } from './GameLoop';
import { PilotBattle } from './PilotBattle';
import { Save } from './Save';

export class Game {
  battle: Battle;
  hasSave = false;
  hasSeenPilotBattle = false;
  loop: GameLoop;
  pilotBattle: PilotBattle | null = null;
  save: Save;

  constructor() {
    this.save = new Save();
    const savedRoute = this.loadSavedRoute();
    this.battle = new Battle(DEFAULT_PLAYER, savedRoute);
    this.battle.onPilotEncounter = () => this.enterPilotBattle();
    this.loop = new GameLoop(TICK_TIME, () => this.gameTick());
    setCurrentRoute(savedRoute);
    setPlayerStats(DEFAULT_PLAYER);
    this.hasSave = this.loadSave();
  }

  completeIntro(zoidId: string): void {
    setParty([{ experience: 0, id: zoidId }]);
    this.battle.spawnEnemy();
    setBattleState('fighting');
    setGamePhase('playing');
    this.loop.start();
    this.save.store(this);
  }

  enterPilotBattle(): void {
    this.hasSeenPilotBattle = true;
    setShowClickHint(false);
    const pilot = randomPilot();
    this.pilotBattle = new PilotBattle(DEFAULT_PLAYER, pilot);
    setPilotInfo({ id: pilot.id, name: pilot.name });
    setBattleState('pilot-fighting');
  }

  exitPilotBattle(): void {
    this.pilotBattle = null;
    setPilotInfo(null);
    setPilotEnemyProgress({ current: 0, total: 0 });
    setPilotPlayerHealth(0);
    setPilotPlayerMaxHealth(0);
    setPilotZoidIds([]);
    setBattleState('fighting');
    this.battle.spawnEnemy();
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

  private gameTick(): void {
    switch (battleState()) {
      case 'fighting':
        this.battle.gameTick();
        break;
      case 'pilot-fighting':
        this.pilotBattle?.gameTick();
        break;
      case 'pilot-victory':
        this.handlePilotVictory();
        break;
    }
    this.save.gameTick(this);
  }

  private handlePilotVictory(): void {
    const name = this.pilotBattle?.pilot.name ?? 'Pilot';
    this.exitPilotBattle();
    setVictoryMessage(`${name} has been defeated!`);
    setTimeout(() => setVictoryMessage(null), 3000);
  }

  private loadSave(): boolean {
    const data = this.save.load();
    if (data) {
      if (data.hasSeenPilotBattle) {
        this.hasSeenPilotBattle = true;
        setShowClickHint(false);
      }
      if (data.enemyHealth > 0) {
        this.battle.enemy.health = data.enemyHealth;
        this.battle['syncToStore']();
      }
      if (data.party?.length) {
        setParty(data.party);
      }
      return true;
    }
    return false;
  }

  private loadSavedRoute() {
    const data = this.save.load();
    return getRoute(data?.routeNumber ?? 1) ?? ROUTES[0];
  }
}
