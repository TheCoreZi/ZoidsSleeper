import type { Requirement } from '../requirement';
import { RouteKillRequirement } from '../requirement';
import type { Route } from './Route';

export const BattleBackground = { Desert: 'desert', Grass: 'grass' } as const;
export type BattleBackground = (typeof BattleBackground)[keyof typeof BattleBackground];

export const LandmarkType = { City: 'city', Dungeon: 'dungeon', Route: 'route' } as const;
export type LandmarkType = (typeof LandmarkType)[keyof typeof LandmarkType];

export interface Landmark {
  battleBackground: BattleBackground;
  id: string;
  name: string;
  requirements?: Requirement[];
  type: LandmarkType;
}

export function getLandmarkHints(landmark: Landmark): string[] {
  return landmark.requirements?.filter((r) => !r.isCompleted()).map((r) => r.hint()) ?? [];
}

export function isLandmarkUnlocked(landmark: Landmark): boolean {
  return landmark.requirements?.every((r) => r.isCompleted()) ?? true;
}

export function findRouteKillRequirement(landmarks: Landmark[], routeId: string): RouteKillRequirement | undefined {
  return landmarks
    .flatMap((l) => l.requirements ?? [])
    .find((r): r is RouteKillRequirement => r instanceof RouteKillRequirement && r.routeId === routeId);
}

export function isRoute(landmark: Landmark): landmark is Route {
  return landmark.type === LandmarkType.Route;
}
