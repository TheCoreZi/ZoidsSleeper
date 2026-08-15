import type { Component } from 'solid-js';
import { Save } from '../game/Save';
import { t } from '../i18n';
import './site-information.css';

export const DISCORD_URL = 'https://discord.gg/cKtVt9XjZz';

export const CommunityFooter: Component = () => (
  <footer class="community-footer">
    <div class="community-footer-copy">
      <p>{t('ui:community_disclaimer_creator')}</p>
      <p>{t('ui:community_disclaimer_rights')}</p>
      <p>{t('ui:community_disclaimer_affiliation')}</p>
    </div>
    <a
      class="community-footer-discord"
      href={DISCORD_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        aria-hidden="true"
        alt=""
        class="community-footer-discord-icon"
        src="images/icons/discord.svg"
      />
      {t('ui:join_discord')}
    </a>
  </footer>
);

export const MigrationNotice: Component = () => (
  <aside class="migration-notice" role="status">
    <p class="migration-notice-message">{t('ui:domain_migration_notice')}</p>
    <button class="migration-notice-download" onClick={() => Save.exportSave()}>
      {t('ui:download_save')}
    </button>
  </aside>
);
