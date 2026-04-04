import { createMemo, createSignal, onCleanup, onMount, Show, type Component } from 'solid-js';
import { Game } from './game/Game';
import { battleState, victoryMessage } from './store/gameStore';
import BattleScreen from './ui/BattleScreen';
import PartyPanel from './ui/PartyPanel';
import PilotBattleScreen from './ui/PilotBattleScreen';

const App: Component = () => {
  let game: Game;
  const [showParty, setShowParty] = createSignal(true);

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
      <div class="main-layout">
        <div class="left-column">
          <PartyPanel expanded={showParty()} onToggle={() => setShowParty((v) => !v)} />
        </div>
        <div class="battle-column">
          <Show
            when={isPilotBattleMode()}
            fallback={<BattleScreen onClick={() => game?.battle.clickAttack()} />}
          >
            <PilotBattleScreen
              onClick={() => game?.pilotBattle?.clickAttack()}
              onExit={() => game?.exitPilotBattle()}
              onRetry={() => game?.pilotBattle?.restart()}
            />
          </Show>
          <Show when={victoryMessage()}>
            <div class="victory-popup">
              <h2>Pilot Defeated!</h2>
              <p>{victoryMessage()}</p>
            </div>
          </Show>
        </div>
        <div class="right-column" />
      </div>
    </div>
  );
};

export default App;
