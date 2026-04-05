import { getRoute } from './Route';
import { getRouteKills } from '../store/statisticsStore';
import type { Landmark } from './Landmark';

export interface Requirement {
  hint(): string;
  isCompleted(): boolean;
  progress(): number;
  requiredValue: number;
}

export class RouteKillRequirement implements Requirement {
  requiredValue: number;
  routeId: string;

  constructor(routeId: string, requiredKills: number) {
    this.requiredValue = requiredKills;
    this.routeId = routeId;
  }

  hint(): string {
    const name = getRoute(this.routeId)?.name ?? this.routeId;
    return `Defeat ${this.requiredValue} zoids on ${name}`;
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getRouteKills(this.routeId);
  }
}

export function findRouteKillRequirement(landmarks: Landmark[], routeId: string): RouteKillRequirement | undefined {
  return landmarks
    .flatMap((l) => l.requirements ?? [])
    .find((r): r is RouteKillRequirement => r instanceof RouteKillRequirement && r.routeId === routeId);
}

export function getLandmarkHints(landmark: Landmark): string[] {
  return landmark.requirements?.filter((r) => !r.isCompleted()).map((r) => r.hint()) ?? [];
}

export function isLandmarkUnlocked(landmark: Landmark): boolean {
  return landmark.requirements?.every((r) => r.isCompleted()) ?? true;
}
