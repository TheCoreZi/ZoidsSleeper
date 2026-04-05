import type { Requirement } from './Requirement';
import type { Route } from './Route';

export const BattleBackground = { Desert: 'desert', Grass: 'grass' } as const;
export type BattleBackground = (typeof BattleBackground)[keyof typeof BattleBackground];

export const LandmarkType = { City: 'city', Route: 'route' } as const;
export type LandmarkType = (typeof LandmarkType)[keyof typeof LandmarkType];

export interface Landmark {
  battleBackground: BattleBackground;
  id: string;
  name: string;
  requirements?: Requirement[];
  type: LandmarkType;
}

export function isRoute(landmark: Landmark): landmark is Route {
  return landmark.type === LandmarkType.Route;
}
