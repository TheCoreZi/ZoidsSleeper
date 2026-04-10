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
    <img
      class="wallet-indicator-icon"
      src="images/items/zi_metal.png"
      alt={t('ui:zi_metal')}
    />
    <span class="wallet-indicator-amount">
      {getCurrency(Currency.ZiMetal).toLocaleString()}
    </span>
  </div>
);

export default WalletIndicator;
