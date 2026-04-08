import type { Component } from 'solid-js';
import { t } from '../i18n';
import { Currency } from '../models/Currency';
import { getCurrency } from '../store/walletStore';

const WalletIndicator: Component = () => (
  <div class="wallet-indicator">
    <img
      class="wallet-indicator-icon"
      src="images/items/magnis.png"
      alt={t('ui:magnis')}
    />
    <span class="wallet-indicator-amount">
      {getCurrency(Currency.Magnis).toLocaleString()}
    </span>
  </div>
);

export default WalletIndicator;
