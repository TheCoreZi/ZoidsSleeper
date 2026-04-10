export const Currency = { Magnis: 'magnis', ZiMetal: 'zi_metal' } as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export type CurrencyReward = Partial<Record<Currency, number>>;

export function calculateMagnisReward(baseReward: number): number {
  const deviation = Math.floor(Math.random() * 51) - 25;
  return Math.max(1, Math.floor(baseReward + deviation));
}
