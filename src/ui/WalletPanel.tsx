import type { Component } from 'solid-js';
import { t } from '../i18n';
import { Currency } from '../models/Currency';
import { getCurrency } from '../store/walletStore';

const WalletPanel: Component = () => (
  <div class="wallet-panel">
    <h3 class="wallet-title">{t('ui:currency')}</h3>
    <div class="wallet-row">
      <img class="wallet-icon" src="images/items/Magnis.png" alt={t('ui:magnis')} />
      <span class="wallet-amount">{getCurrency(Currency.Magnis).toLocaleString()}</span>
    </div>
  </div>
);

export default WalletPanel;
