export interface TransportZoidBonus {
  extraSlots: number;
  fragmentMultiplier: number;
  rebornBonusMultiplier: number;
}

export const NO_TRANSPORT_BONUS: TransportZoidBonus = {
  extraSlots: 0,
  fragmentMultiplier: 1,
  rebornBonusMultiplier: 1,
};

export const TRANSPORT_ZOID_BONUSES: Record<string, TransportZoidBonus> = {
  gustav: {
    extraSlots: 0,
    fragmentMultiplier: 1.25,
    rebornBonusMultiplier: 1,
  },
  gustav_mc: {
    extraSlots: 0,
    fragmentMultiplier: 0.5,
    rebornBonusMultiplier: 1.5,
  },
};
