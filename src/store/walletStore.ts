import { createSignal } from 'solid-js';
import { calculateMagnisReward, Currency, type CurrencyReward } from '../models/Currency';

const [wallet, setWallet] = createSignal<Record<Currency, number>>({
  [Currency.Magnis]: 0,
  [Currency.ZiMetal]: 0,
});

function addCurrency(currency: Currency, amount: number): void {
  setWallet((prev) => ({ ...prev, [currency]: (prev[currency] ?? 0) + amount }));
}

function getCurrency(currency: Currency): number {
  return wallet()[currency] ?? 0;
}

function loadWallet(data: Record<string, number>): void {
  setWallet({
    [Currency.Magnis]: data[Currency.Magnis] ?? 0,
    [Currency.ZiMetal]: data[Currency.ZiMetal] ?? 0,
  });
}

export interface GrantedReward {
  magnis: number;
  ziMetal: number;
}

function grantCurrencyReward(reward: CurrencyReward, multiplier = 1, includeZiMetal = false): GrantedReward {
  const magnis = calculateMagnisReward(reward.magnis ?? 0) * multiplier;
  addCurrency(Currency.Magnis, magnis);
  let ziMetal = 0;
  if (includeZiMetal) {
    ziMetal = (reward.zi_metal ?? 0) * multiplier;
    if (ziMetal > 0) {addCurrency(Currency.ZiMetal, ziMetal);}
  }
  return { magnis, ziMetal };
}

export { addCurrency, getCurrency, grantCurrencyReward, loadWallet, wallet };
