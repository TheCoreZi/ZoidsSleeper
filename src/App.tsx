import { createMemo, createSignal, Match, onCleanup, onMount, Show, Switch, type Component } from 'solid-js';
import { Game } from './game/Game';
import WorldMap from './map/WorldMap';
import { PopupType } from './models/PopupMessage';
import { activeDialog, battleState, gamePhase, popupMessage, setActiveDialog } from './store/gameStore';
import DialogBox from './story/DialogBox';
import IntroSequence from './story/IntroSequence';
import BattleScreen from './ui/BattleScreen';
import IdleLandmarkScreen from './ui/IdleLandmarkScreen';
import SettingsMenu from './ui/SettingsMenu';
import PartyPanel from './ui/PartyPanel';
import WalletPanel from './ui/WalletPanel';
import CampaignPanel from './ui/CampaignPanel';
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
      <div class="app-header">
        <h1>Zoids Sleeper</h1>
        <SettingsMenu />
      </div>
      <Show when={activeDialog()}>
        <div class="dialog-overlay">
          <DialogBox script={activeDialog()!} onComplete={() => setActiveDialog(null)} />
        </div>
      </Show>
      <Show
        when={gamePhase() === 'playing'}
        fallback={<IntroSequence onComplete={(id) => game?.completeIntro(id)} />}
      >
        <div class="main-layout">
          <div class="left-column">
            <WalletPanel />
            <PartyPanel expanded={showParty()} onToggle={() => setShowParty((v) => !v)} />
          </div>
          <div class="battle-column">
            <Switch fallback={<IdleLandmarkScreen />}>
              <Match when={isPilotBattleMode()}>
                <PilotBattleScreen onClick={() => game?.battle?.clickAttack()} />
              </Match>
              <Match when={isFighting()}>
                <BattleScreen onClick={() => game?.battle?.clickAttack()} />
              </Match>
            </Switch>
          </div>
          <div class="map-column">
            <WorldMap onLocationChange={(l) => game?.changeLocation(l)} />
          </div>
          <div class="right-column">
            <CampaignPanel />
          </div>
        </div>
      </Show>
      <Show when={popupMessage()}>
        <div class={`popup-message ${popupMessage()!.type === PopupType.Defeat ? 'popup-defeat' : ''}`}>
          <h2>{popupMessage()!.title}</h2>
          <p>{popupMessage()!.content}</p>
        </div>
      </Show>
    </div>
  );
};

export default App;
