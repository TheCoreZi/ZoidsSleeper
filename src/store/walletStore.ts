import { createSignal } from 'solid-js';
import { Currency } from '../models/Currency';

const [wallet, setWallet] = createSignal<Record<Currency, number>>({
  [Currency.Magnis]: 0,
});

function addCurrency(currency: Currency, amount: number): void {
  setWallet((prev) => ({ ...prev, [currency]: (prev[currency] ?? 0) + amount }));
}

function getCurrency(currency: Currency): number {
  return wallet()[currency] ?? 0;
}

function loadWallet(data: Record<string, number>): void {
  setWallet({ [Currency.Magnis]: data[Currency.Magnis] ?? 0 });
}

export { addCurrency, getCurrency, loadWallet, wallet };
