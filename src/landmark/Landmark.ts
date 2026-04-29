import type { Requirement } from '../requirement';
import { RouteKillRequirement } from '../requirement';
import { TerrainType } from '../models/Terrain';
import type { Route } from './Route';

export const BattleBackground = { Air: 'air', Desert: 'desert', Dirt: 'dirt', Forest: 'forest', Grass: 'grass', Plain: 'plain', Rock: 'rock', Ruin: 'ruin', Water: 'water' } as const;
export type BattleBackground = (typeof BattleBackground)[keyof typeof BattleBackground];

export const BattleBackgroundTerrain: Record<BattleBackground, TerrainType> = {
  [BattleBackground.Air]: TerrainType.Air,
  [BattleBackground.Desert]: TerrainType.Land,
  [BattleBackground.Dirt]: TerrainType.Land,
  [BattleBackground.Forest]: TerrainType.Land,
  [BattleBackground.Grass]: TerrainType.Land,
  [BattleBackground.Plain]: TerrainType.Land,
  [BattleBackground.Rock]: TerrainType.Land,
  [BattleBackground.Ruin]: TerrainType.Land,
  [BattleBackground.Water]: TerrainType.Water,
};

export const LandmarkType = { City: 'city', Dungeon: 'dungeon', Route: 'route' } as const;
export type LandmarkType = (typeof LandmarkType)[keyof typeof LandmarkType];

export interface Landmark {
  battleBackground: BattleBackground;
  devOnly?: boolean;
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
