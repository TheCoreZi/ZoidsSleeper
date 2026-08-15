import { createMemo, createSignal, Show, type Component } from 'solid-js';
import { Save, type SaveData } from '../game/Save';
import { changeLocale, currentLocale, t } from '../i18n';
import { ALL_FACTIONS, Faction, FACTIONS } from '../models/Faction';
import { DEFAULT_PLAYER_NAME } from '../models/Player';
import { getZoidImage, getZoidName } from '../models/Zoid';
import { CommunityFooter, MigrationNotice } from './SiteInformation';
import './home.css';

interface HomeScreenProps {
  save: SaveData | null;
  onContinue: () => void;
  onNewGame: () => void;
}

const HomeScreen: Component<HomeScreenProps> = (props) => {
  const [showLanguageMenu, setShowLanguageMenu] = createSignal(false);
  const [showLoadGameConfirmation, setShowLoadGameConfirmation] = createSignal(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = createSignal(false);
  const faction = createMemo(() => getSavedFaction(props.save));
  const commanderId = createMemo(() => props.save?.party?.commanderZoidId);
  let fileInputRef: HTMLInputElement | undefined;

  const startNewGame = (): void => {
    if (props.save) {
      setShowNewGameConfirmation(true);
      return;
    }
    props.onNewGame();
  };

  const startLoadGame = (): void => {
    if (props.save) {
      setShowLoadGameConfirmation(true);
      return;
    }
    fileInputRef?.click();
  };

  return (
    <main class="home-screen">
      <header class="home-header">
        <div class="game-title-bar">
          <h1 class="game-title">Zoids Sleeper</h1>
        </div>
        <div class="home-languages">
          <button
            aria-expanded={showLanguageMenu()}
            aria-haspopup="menu"
            aria-label={t('ui:language')}
            class="home-language-toggle"
            onClick={() => setShowLanguageMenu((visible) => !visible)}
            title={t('ui:language')}
          >
            🌐
          </button>
          <Show when={showLanguageMenu()}>
            <div class="home-language-dropdown" role="menu">
              <button
                classList={{ active: currentLocale() === 'en', 'home-language': true }}
                onClick={() => { changeLocale('en'); setShowLanguageMenu(false); }}
                role="menuitem"
              >
                <span class="home-language-flag">🇺🇸</span>
                English
              </button>
              <button
                classList={{ active: currentLocale() === 'es', 'home-language': true }}
                onClick={() => { changeLocale('es'); setShowLanguageMenu(false); }}
                role="menuitem"
              >
                <span class="home-language-flag">🇪🇸</span>
                Español
              </button>
            </div>
          </Show>
        </div>
      </header>
      <section class="home-content">
        <div class="home-intro">
          <h2 class="home-tagline">{t('ui:home_tagline')}</h2>
          <p class="home-description">{t('ui:home_description')}</p>
        </div>
        <Show when={props.save}>
          <article
            class="home-save-card"
          >
            <img
              alt={t(`factions:${faction()}`)}
              class="home-faction-icon home-save-icon"
              src={FACTIONS[faction()].image}
              title={t(`factions:${faction()}`)}
            />
            <div class="home-save-main">
              <div class="home-commander">
                <Show when={commanderId()} keyed>
                  {(id) => (
                    <img
                      alt={t('ui:home_commander', { name: getZoidName(id) })}
                      class="home-commander-icon home-save-icon"
                      src={getZoidImage(id)}
                      title={t('ui:home_commander', { name: getZoidName(id) })}
                    />
                  )}
                </Show>
                <Show when={props.save?.playerStats?.organoidId === 'beacon'}>
                  <img
                    alt={t('organoids:beacon')}
                    class="home-beacon-icon home-save-icon"
                    src="images/characters/beacon_full.png"
                    title={t('organoids:beacon')}
                  />
                </Show>
              </div>
              <div class="home-save-data">
                <span class="home-save-label">{t('ui:home_saved_game')}</span>
                <h3>{props.save?.playerStats?.name ?? DEFAULT_PLAYER_NAME}</h3>
                <div class="home-save-details">
                  <span>{t(`locations:${props.save?.landmarkId}`)}</span>
                  <span>{t('ui:home_zoid_count', { count: props.save?.party?.zoids.length ?? 0 })}</span>
                </div>
              </div>
            </div>
            <button class="home-primary-action" onClick={() => props.onContinue()}>
              {t('ui:continue')}
            </button>
          </article>
        </Show>
        <div class="home-actions">
          <button class="home-new-game" onClick={startNewGame}>
            {t('ui:home_new_game')}
          </button>
          <button class="home-load-game" onClick={startLoadGame}>
            <span aria-hidden="true">📂</span>
            {t('ui:load_game')}
          </button>
        </div>
      </section>
      <MigrationNotice />
      <CommunityFooter />
      <input
        accept=".txt"
        class="home-save-file"
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          if (file && !await Save.importSave(file)) {
            // eslint-disable-next-line no-alert
            alert(t('ui:load_error'));
          }
        }}
        ref={fileInputRef}
        type="file"
      />
      <Show when={showLoadGameConfirmation()}>
        <div class="home-confirmation-overlay" onClick={() => setShowLoadGameConfirmation(false)}>
          <div
            aria-labelledby="home-load-game-title"
            aria-modal="true"
            class="home-confirmation"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2 id="home-load-game-title">{t('ui:load_game')}</h2>
            <p>{t('ui:load_confirm')}</p>
            <div class="home-confirmation-actions">
              <button onClick={() => setShowLoadGameConfirmation(false)}>{t('ui:cancel')}</button>
              <button
                class="home-confirm-load-game"
                onClick={() => { setShowLoadGameConfirmation(false); fileInputRef?.click(); }}
              >
                {t('ui:load_game')}
              </button>
            </div>
          </div>
        </div>
      </Show>
      <Show when={showNewGameConfirmation()}>
        <div class="home-confirmation-overlay" onClick={() => setShowNewGameConfirmation(false)}>
          <div
            aria-labelledby="home-new-game-title"
            aria-modal="true"
            class="home-confirmation"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2 id="home-new-game-title">{t('ui:home_new_game')}</h2>
            <p>{t('ui:home_new_game_confirm')}</p>
            <div class="home-confirmation-actions">
              <button onClick={() => setShowNewGameConfirmation(false)}>{t('ui:cancel')}</button>
              <button class="home-confirm-new-game" onClick={() => props.onNewGame()}>{t('ui:home_new_game')}</button>
            </div>
          </div>
        </div>
      </Show>
    </main>
  );
};

function getSavedFaction(save: SaveData | null): Faction {
  const faction = save?.playerStats?.faction;
  return ALL_FACTIONS.includes(faction as Faction) ? faction as Faction : Faction.Neutral;
}

export default HomeScreen;
