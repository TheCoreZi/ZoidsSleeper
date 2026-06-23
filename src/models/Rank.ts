export const Rank = {
  Cadet: 'cadet',
  Captain: 'captain',
  Civilian: 'civilian',
  Colonel: 'colonel',
  Corporal: 'corporal',
  Lieutenant: 'lieutenant',
  Major: 'major',
  Recruit: 'recruit',
  Sergeant: 'sergeant',
} as const;

export type Rank = (typeof Rank)[keyof typeof Rank];

export const RANK_ORDER: Rank[] = [
  Rank.Civilian,
  Rank.Recruit,
  Rank.Cadet,
  Rank.Corporal,
  Rank.Sergeant,
  Rank.Lieutenant,
  Rank.Captain,
  Rank.Major,
  Rank.Colonel,
];

export function getRankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

export function isPromotion(current: Rank, next: Rank): boolean {
  return getRankIndex(next) > getRankIndex(current);
}
