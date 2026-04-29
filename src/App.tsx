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
  playerStats,
  popupMessage,
  dequeueDialog,
  setActiveDialog,
  setActiveLab,
  setActiveShop,
  showPopup,
} from './store/gameStore';
import type { DialogDecision } from './dialog/Dialog';
import DialogBox from './dialog/DialogBox';
import DecisionScreen from './dialog/DecisionScreen';
import IntroSequence from './story/IntroSequence';
import BattleScreen from './ui/BattleScreen';
import CampaignPanel from './ui/CampaignPanel';
import IdleLandmarkScreen from './ui/IdleLandmarkScreen';
import PartyPanel from './ui/PartyPanel';
import DuelBattleScreen from './ui/DuelBattleScreen';
import FactionPanel from './ui/FactionPanel';
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
import { checkCampaigns, isMissionCompleted } from './store/campaignStore';
import { addZoidToArmy, party } from './store/partyStore';
import { addCurrency, getCurrency } from './store/walletStore';
import { decrementZoidData } from './store/zoidDataStore';

const App: Component = () => {
  let game: Game;
  const [activeDecision, setActiveDecision] = createSignal<DialogDecision | null>(null);
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
  const isDuelBattleMode = createMemo(() => battleState() === BattleState.DuelCombat);
  const isPilotBattleMode = createMemo(() => battleState() === BattleState.PilotCombat);
  const isWildBossCombat = createMemo(() => battleState() === BattleState.WildBossCombat);

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
            const isFirstFree = party().zoids.length === 1 && !isMissionCompleted('sleeper_commander', 'grow_army');
            const price = isFirstFree ? 0 : zoid.price;
            if (getCurrency(Currency.Magnis) >= price) {
              const isNew = !party().zoids.some((z) => z.id === zoidId);
              addCurrency(Currency.Magnis, -price);
              decrementZoidData(zoidId);
              addZoidToArmy(zoidId);
              checkCampaigns();
              if (isNew) {
                showPopup(new PopupMessage(zoid.name, t('ui:new_zoid'), PopupType.Item, getZoidImage(zoidId)));
              }
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
      <Show when={activeDecision()} keyed>
        {(decision) => (
          <div class="dialog-overlay">
            <DecisionScreen
              decision={decision}
              onChoose={(choice) => {
                choice.onChoose?.();
                checkCampaigns();
                setActiveDecision(null);
                setActiveDialog(choice.followUp);
              }}
            />
          </div>
        )}
      </Show>
      <Show when={activeDialog()} keyed>
        {(dialog) => (
          <div class="dialog-overlay">
            <DialogBox
              script={dialog}
              onComplete={() => {
                if (dialog.reward) {grantReward(dialog.reward);}
                checkCampaigns();
                if (dialog.decision) {
                  setActiveDialog(null);
                  setActiveDecision(dialog.decision);
                } else {
                  setActiveDialog(dequeueDialog() ?? null);
                }
              }}
            />
          </div>
        )}
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
            <Show when={import.meta.env.DEV && playerStats()}>
              <FactionPanel faction={playerStats()!.faction} />
            </Show>
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
              <Match when={isWildBossCombat()}>
                <DungeonBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                />
              </Match>
              <Match when={isDungeonBoss()}>
                <PilotBattleScreen
                  onClick={() => game?.battle?.clickAttack()}
                />
              </Match>
              <Match when={isDuelBattleMode()}>
                <DuelBattleScreen
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
            <WorldMap onLocationChange={(l) => game?.changeLocation(l)} />
          </div>
          <div class="right-column">
            <CampaignPanel />
          </div>
        </div>
      </Show>
      <Show when={popupMessage()} keyed>
        {(popup) => (
          <div class={`popup-message popup-${popup.type}`}>
            <Show when={popup.image}>
              <img
                class="popup-message-img"
                src={popup.image}
                alt=""
              />
            </Show>
            <div>
              <h2>{popup.title}</h2>
              <p>{popup.content}</p>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default App;
