import { createSignal, For, type Component, Show, Switch, Match } from 'solid-js';
import { changeLocale, currentLocale, t } from '../i18n';
import { Save } from '../game/Save';
import DevCampaignTools from './DevCampaignTools';

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
];

type MenuView = 'dev-campaign' | 'language' | 'main';

const SettingsMenu: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [showImportDialog, setShowImportDialog] = createSignal(false);
  const [showResetDialog, setShowResetDialog] = createSignal(false);
  const [view, setView] = createSignal<MenuView>('main');
  let fileInputRef: HTMLInputElement | undefined;

  const close = () => { setIsOpen(false); setView('main'); };
  const toggle = () => { if (isOpen()) { close(); } else { setIsOpen(true); } };

  return (<>
    <div class="settings-menu">
      <button class="settings-gear" onClick={toggle} title={t('ui:settings')}>
        <img class="settings-gear-icon" src="images/icons/gear-solid-full.svg" width="20" height="20" alt="Settings" />
      </button>
      <Show when={isOpen()}>
        <div class="settings-dropdown">
          <div class="settings-dropdown-header">
            <Show when={view() !== 'main'}>
              <button class="settings-back" onClick={() => setView('main')}>◂</button>
            </Show>
            <span class="settings-section-title">
              {view() === 'main' ? t('ui:settings') : view() === 'dev-campaign' ? 'Dev: Campaign' : t('ui:language')}
            </span>
            <button class="settings-close" onClick={close}>✕</button>
          </div>
          <Switch>
            <Match when={view() === 'main'}>
              <button class="settings-menu-option" onClick={() => setView('language')}>
                <span class="settings-menu-icon">🌐</span>
                {t('ui:language')}
              </button>
              <button class="settings-menu-option" onClick={() => { Save.exportSave(); close(); }}>
                <span class="settings-menu-icon">💾</span>
                {t('ui:download_save')}
              </button>
              <button class="settings-menu-option" onClick={() => { close(); setShowImportDialog(true); }}>
                <span class="settings-menu-icon">📂</span>
                {t('ui:load_game')}
              </button>
              <button class="settings-menu-option settings-menu-option--danger" onClick={() => { close(); setShowResetDialog(true); }}>
                <span class="settings-menu-icon">🗑️</span>
                {t('ui:reset_game')}
              </button>
              <Show when={import.meta.env.DEV}>
                <button class="settings-menu-option" onClick={() => setView('dev-campaign')}>
                  <span class="settings-menu-icon">🔧</span>
                  Dev: Campaign
                </button>
              </Show>
            </Match>
            <Match when={view() === 'language'}>
              <For each={LANGUAGES}>
                {(lang) => (
                  <button
                    class={`settings-lang-option ${currentLocale() === lang.code ? 'active' : ''}`}
                    onClick={() => { changeLocale(lang.code); close(); }}
                  >
                    <span class="settings-menu-icon">{lang.flag}</span>
                    {lang.label}
                  </button>
                )}
              </For>
            </Match>
            <Match when={view() === 'dev-campaign'}>
              <DevCampaignTools />
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
    <Show when={showResetDialog()}>
      <div class="reset-overlay" onClick={() => setShowResetDialog(false)}>
        <div class="reset-dialog" onClick={(e) => e.stopPropagation()}>
          <p class="reset-dialog-title">{t('ui:reset_game')}</p>
          <p class="reset-dialog-message">{t('ui:reset_confirm')}</p>
          <div class="reset-dialog-actions">
            <button class="reset-dialog-cancel" onClick={() => setShowResetDialog(false)}>{t('ui:cancel')}</button>
            <button class="reset-dialog-confirm" onClick={() => Save.reset()}>{t('ui:reset_game')}</button>
          </div>
        </div>
      </div>
    </Show>
    <input
      type="file"
      accept=".txt"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={async (e) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
          const ok = await Save.importSave(file);
          if (!ok) {
            // eslint-disable-next-line no-alert
            alert(t('ui:load_error'));
          }
        }
        setShowImportDialog(false);
      }}
    />
    <Show when={showImportDialog()}>
      <div class="reset-overlay" onClick={() => setShowImportDialog(false)}>
        <div class="reset-dialog" onClick={(e) => e.stopPropagation()}>
          <p class="reset-dialog-title">{t('ui:load_game')}</p>
          <p class="reset-dialog-message">{t('ui:load_confirm')}</p>
          <div class="reset-dialog-actions">
            <button class="reset-dialog-cancel" onClick={() => setShowImportDialog(false)}>{t('ui:cancel')}</button>
            <button class="reset-dialog-confirm" onClick={() => fileInputRef?.click()}>{t('ui:load_game')}</button>
          </div>
        </div>
      </div>
    </Show>
  </>
  );
};

export default SettingsMenu;
