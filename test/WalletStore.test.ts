import { beforeEach, describe, expect, it } from 'vitest';
import { Currency } from '../src/models/Currency';
import { addCurrency, getCurrency, loadWallet } from '../src/store/walletStore';

describe('WalletStore', () => {
  beforeEach(() => {
    loadWallet({});
  });

  it('should start with 0 magnis', () => {
    expect(getCurrency(Currency.Magnis)).toBe(0);
  });

  it('should add currency', () => {
    addCurrency(Currency.Magnis, 50);

    expect(getCurrency(Currency.Magnis)).toBe(50);
  });

  it('should accumulate currency', () => {
    addCurrency(Currency.Magnis, 30);
    addCurrency(Currency.Magnis, 20);

    expect(getCurrency(Currency.Magnis)).toBe(50);
  });

  it('should load wallet from saved data', () => {
    loadWallet({ magnis: 100 });

    expect(getCurrency(Currency.Magnis)).toBe(100);
  });

  it('should add to loaded values', () => {
    loadWallet({ magnis: 100 });

    addCurrency(Currency.Magnis, 50);

    expect(getCurrency(Currency.Magnis)).toBe(150);
  });
});
