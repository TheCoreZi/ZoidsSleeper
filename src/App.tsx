import { createMemo, createSignal, Match, onCleanup, onMount, Show, Switch, type Component } from 'solid-js';
import { Game } from './game/Game';
import WorldMap from './map/WorldMap';
import { battleState, gamePhase, victoryMessage } from './store/gameStore';
import IntroSequence from './story/IntroSequence';
import BattleScreen from './ui/BattleScreen';
import IdleLandmarkScreen from './ui/IdleLandmarkScreen';
import PartyPanel from './ui/PartyPanel';
import PilotBattleScreen from './ui/PilotBattleScreen';

const App: Component = () => {
  let game: Game;
  const [showParty, setShowParty] = createSignal(true);

  const isFighting = createMemo(() => battleState() === 'fighting' || battleState() === 'victory');
  const isPilotBattleMode = createMemo(() => battleState().startsWith('pilot-'));

  onMount(() => {
    game = new Game();
    game.start();
  });

  onCleanup(() => {
    game?.stop();
  });

  return (
    <div class="app">
      <h1>Zoids Sleeper</h1>
      <Show
        when={gamePhase() === 'playing'}
        fallback={<IntroSequence onComplete={(id) => game?.completeIntro(id)} />}
      >
        <div class="main-layout">
          <div class="left-column">
            <PartyPanel expanded={showParty()} onToggle={() => setShowParty((v) => !v)} />
          </div>
          <div class="battle-column">
            <Switch fallback={<IdleLandmarkScreen />}>
              <Match when={isPilotBattleMode()}>
                <PilotBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                  onExit={() => game?.exitPilotBattle()}
                  onRetry={() => game?.retryPilotBattle()}
                />
              </Match>
              <Match when={isFighting()}>
                <BattleScreen onClick={() => game?.battle?.clickAttack()} />
              </Match>
            </Switch>
            <Show when={victoryMessage()}>
              <div class="victory-popup">
                <h2>Pilot Defeated!</h2>
                <p>{victoryMessage()}</p>
              </div>
            </Show>
          </div>
          <div class="map-column">
            <WorldMap onLocationChange={(l) => game?.changeLocation(l)} />
          </div>
          <div class="right-column" />
        </div>
      </Show>
    </div>
  );
};

export default App;
