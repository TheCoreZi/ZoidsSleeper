import { type Component, createSignal, For } from 'solid-js';
import { t } from '../i18n';
import type { ConsumableItem } from '../item';
import { Currency } from '../models/Currency';
import { getCurrency } from '../store/walletStore';

export interface ShopData {
  items: ConsumableItem[];
}

interface ShopPanelProps {
  onBuy: (item: ConsumableItem, amount: number) => void;
  onClose: () => void;
  shop: ShopData;
}

const ShopPanel: Component<ShopPanelProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [amount, setAmount] = createSignal(1);

  const selectedItem = () => props.shop.items[selectedIndex()];
  const totalPrice = () => selectedItem().price * amount();
  const canAfford = () => getCurrency(Currency.Magnis) >= totalPrice();
  const maxAffordable = () => {
    const price = selectedItem().price;
    return price > 0 ? Math.floor(getCurrency(Currency.Magnis) / price) : 0;
  };

  function buy(): void {
    if (canAfford() && amount() > 0) {
      props.onBuy(selectedItem(), amount());
    }
  }

  return (
    <div class="shop-overlay" onClick={() => props.onClose()}>
      <div class="shop-panel" onClick={(e) => e.stopPropagation()}>
        <div class="shop-header">
          <span class="shop-title">{t('ui:depot')}</span>
          <button class="shop-close" onClick={() => props.onClose()}>✕</button>
        </div>
        <div class="shop-wallet">
          <img class="shop-wallet-icon" src="images/items/Magnis.png" alt="Magnis" />
          <span class="shop-wallet-amount">{getCurrency(Currency.Magnis).toLocaleString()}</span>
        </div>
        <div class="shop-items">
          <For each={props.shop.items}>
            {(item, index) => (
              <button
                class={`shop-item ${selectedIndex() === index() ? 'shop-item-selected' : ''}`}
                onClick={() => { setSelectedIndex(index()); setAmount(1); }}
              >
                <img class="shop-item-icon" src={`images/items/${item.id}.png`} alt={t(`items:${item.id}.name`)} />
                <div class="shop-item-info">
                  <span class="shop-item-name">{t(`items:${item.id}.name`)}</span>
                  <span class="shop-item-desc">{t(`items:${item.id}.description`)}</span>
                </div>
                <div class="shop-item-price">
                  <img class="shop-price-icon" src="images/items/Magnis.png" alt="" />
                  <span>{item.price.toLocaleString()}</span>
                </div>
              </button>
            )}
          </For>
        </div>
        <div class="shop-buy-section">
          <div class="shop-amount-row">
            <button class="shop-amount-btn" onClick={() => setAmount((a) => Math.max(1, a - 1))}>−</button>
            <span class="shop-amount-value">{amount()}</span>
            <button class="shop-amount-btn" onClick={() => setAmount((a) => a + 1)}>+</button>
            <button class="shop-amount-btn" onClick={() => setAmount((a) => a + 10)}>+10</button>
            <button class="shop-amount-btn" onClick={() => setAmount(Math.max(1, maxAffordable()))}>{t('ui:max')}</button>
          </div>
          <div class="shop-total-row">
            <span class="shop-total-label">{t('ui:total')}:</span>
            <img class="shop-price-icon" src="images/items/Magnis.png" alt="" />
            <span class={`shop-total-value ${canAfford() ? '' : 'shop-no-funds'}`}>
              {totalPrice().toLocaleString()}
            </span>
          </div>
          <button
            class="shop-buy-btn"
            disabled={!canAfford() || amount() <= 0}
            onClick={buy}
          >
            {t('ui:buy')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPanel;
