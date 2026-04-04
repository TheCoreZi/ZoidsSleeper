import type { OwnedZoid } from './Zoid';

const PILOT_BONUS = 1.5;

export function awardExperience(party: OwnedZoid[], xpGain: number): OwnedZoid[] {
  return party.map((z) => ({ ...z, experience: z.experience + xpGain }));
}

export function calculateExperienceGain(enemyBaseExp: number, enemyLevel: number, isPilotBattle: boolean, multiplier = 1): number {
  const pilotBonus = isPilotBattle ? PILOT_BONUS : 1;
  return Math.floor(enemyBaseExp * enemyLevel * pilotBonus * multiplier / 9);
}
