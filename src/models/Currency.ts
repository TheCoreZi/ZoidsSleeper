export const Currency = { Magnis: 'magnis' } as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export function calculateMagnisReward(baseReward: number): number {
  const deviation = Math.floor(Math.random() * 51) - 25;
  return Math.max(1, Math.floor(baseReward + deviation));
}
