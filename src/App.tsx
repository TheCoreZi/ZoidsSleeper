import {
  type Component,
  createMemo,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import DungeonBattleScreen from './dungeon/DungeonBattleScreen';
import DungeonEventScreen from './dungeon/DungeonEventScreen';
import DungeonMapScreen from './dungeon/DungeonMapScreen';
import DungeonSupplyScreen from './dungeon/DungeonSupplyScreen';
import { DungeonPhase, dungeonPhase, isDungeonActive } from './dungeon/dungeonStore';
import { Game } from './game/Game';
import { t } from './i18n';
import WorldMap from './map/WorldMap';
import { PopupMessage, PopupType } from './models/PopupMessage';
import {
  activeDialog,
  activeLab,
  activeShop,
  BattleState,
  battleState,
  GamePhase,
  gamePhase,
  popupMessage,
  dequeueDialog,
  setActiveDialog,
  setActiveLab,
  setActiveShop,
  setPopupMessage,
} from './store/gameStore';
import DialogBox from './story/DialogBox';
import IntroSequence from './story/IntroSequence';
import BattleScreen from './ui/BattleScreen';
import CampaignPanel from './ui/CampaignPanel';
import IdleLandmarkScreen from './ui/IdleLandmarkScreen';
import PartyPanel from './ui/PartyPanel';
import PilotBattleScreen from './ui/PilotBattleScreen';
import SettingsMenu from './ui/SettingsMenu';
import LabPanel from './ui/LabPanel';
import ShopPanel from './ui/ShopPanel';
import SuppliesPanel from './ui/SuppliesPanel';
import ZiArchivePanel from './ui/ZiArchivePanel';
import WalletIndicator from './ui/WalletPanel';
import { Currency } from './models/Currency';
import { getZoidImage, ZOID_LIST } from './models/Zoid';
import { buyItem } from './store/inventoryStore';
import { grantReward } from './reward';
import { checkCampaigns } from './store/campaignStore';
import { addZoidToArmy } from './store/partyStore';
import { addCurrency, getCurrency } from './store/walletStore';
import { decrementZoidData } from './store/zoidDataStore';

const App: Component = () => {
  let game: Game;
  const [showParty, setShowParty] = createSignal(true);
  const [showArchive, setShowArchive] = createSignal(false);
  const [showSupplies, setShowSupplies] = createSignal(false);

  const isFighting = createMemo(
    () => battleState() === BattleState.WildCombat
  );
  const isDungeonCombat = createMemo(() => battleState() === BattleState.DungeonCombat);
  const isDungeonBoss = createMemo(() => battleState() === BattleState.DungeonBoss);
  const isDungeonEvent = createMemo(() => isDungeonActive() && dungeonPhase() === DungeonPhase.Event);
  const isDungeonMap = createMemo(() => isDungeonActive() && dungeonPhase() === DungeonPhase.Map);
  const isDungeonSupply = createMemo(() => isDungeonActive() && dungeonPhase() === DungeonPhase.Supply);
  const isPilotBattleMode = createMemo(() =>
    battleState() === BattleState.PilotCombat
  );

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
        <div class="game-title-bar">
          <h1 class="game-title">Zoids Sleeper</h1>
        </div>
        <div class="header-buttons">
          <button
            class="archive-button"
            onClick={() => { setShowArchive((v) => !v); setShowSupplies(false); }}
            title={t('ui:zi_archive')}
          >
            <img
              class="archive-button-icon"
              src="images/icons/book-solid.svg"
              width="20"
              height="20"
              alt="Zi-Archive"
            />
          </button>
          <button
            class="supplies-button"
            onClick={() => { setShowSupplies((v) => !v); setShowArchive(false); }}
            title={t('ui:supplies')}
          >
            <img
              class="supplies-button-icon"
              src="images/icons/box-solid.svg"
              width="20"
              height="20"
              alt="Supplies"
            />
          </button>
          <SettingsMenu />
        </div>
      </div>
      <Show when={activeLab()}>
        <LabPanel
          labId={activeLab()!.labId}
          onBuy={(zoidId) => {
            const zoid = ZOID_LIST[zoidId];
            if (getCurrency(Currency.Magnis) >= zoid.price) {
              addCurrency(Currency.Magnis, -zoid.price);
              decrementZoidData(zoidId);
              addZoidToArmy(zoidId);
              checkCampaigns();
              setPopupMessage(new PopupMessage(zoid.name, t('ui:new_zoid'), PopupType.Item, getZoidImage(zoidId)));
              setTimeout(() => setPopupMessage(null), 3000);
            }
          }}
          onClose={() => setActiveLab(null)}
        />
      </Show>
      <Show when={activeShop()}>
        <ShopPanel
          shop={activeShop()!}
          onBuy={(item, amount) => buyItem(item.id, amount)}
          onClose={() => setActiveShop(null)}
        />
      </Show>
      <Show when={showArchive()}>
        <ZiArchivePanel onClose={() => setShowArchive(false)} />
      </Show>
      <Show when={showSupplies()}>
        <SuppliesPanel onClose={() => setShowSupplies(false)} />
      </Show>
      <Show when={activeDialog()}>
        <div class="dialog-overlay">
          <DialogBox
            script={activeDialog()!}
            onComplete={() => {
              const dialog = activeDialog();
              if (dialog?.reward) {grantReward(dialog.reward);}
              checkCampaigns();
              setActiveDialog(dequeueDialog() ?? null);
            }}
          />
        </div>
      </Show>
      <Show
        when={gamePhase() === GamePhase.Playing}
        fallback={
          <IntroSequence onComplete={(id) => game?.completeIntro(id)} />
        }
      >
        <WalletIndicator />
        <div class="main-layout">
          <div class="left-column">
            <PartyPanel
              expanded={showParty()}
              onToggle={() => setShowParty((v) => !v)}
            />
          </div>
          <div class="battle-column">
            <Switch fallback={<IdleLandmarkScreen />}>
              <Match when={isDungeonMap()}>
                <DungeonMapScreen
                  onNodeSelect={(nodeId) => game?.selectDungeonNode(nodeId)}
                  onRetreat={() => game?.endDungeonRun(false)}
                />
              </Match>
              <Match when={isDungeonEvent()}>
                <DungeonEventScreen
                  onAmbush={() => game?.ambushFromEvent()}
                  onComplete={() => game?.completeDungeonNode()}
                />
              </Match>
              <Match when={isDungeonSupply()}>
                <DungeonSupplyScreen
                  onComplete={() => game?.completeDungeonNode()}
                />
              </Match>
              <Match when={isDungeonCombat()}>
                <DungeonBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                />
              </Match>
              <Match when={isDungeonBoss()}>
                <PilotBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                />
              </Match>
              <Match when={isPilotBattleMode()}>
                <PilotBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                />
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
        <div
          class={`popup-message ${popupMessage()!.type === PopupType.Defeat ? 'popup-defeat' : popupMessage()!.type === PopupType.Item ? 'popup-item' : ''}`}
        >
          <Show when={popupMessage()!.image}>
            <img
              class="popup-message-img"
              src={popupMessage()!.image}
              alt=""
            />
          </Show>
          <div>
            <h2>{popupMessage()!.title}</h2>
            <p>{popupMessage()!.content}</p>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default App;
