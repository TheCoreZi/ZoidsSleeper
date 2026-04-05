import { getRouteKills } from '../store/statisticsStore';
import type { Requirement } from './Requirement';

export class RouteKillRequirement implements Requirement {
  requiredValue: number;
  routeId: string;
  routeName?: string;

  constructor(routeId: string, requiredKills: number) {
    this.requiredValue = requiredKills;
    this.routeId = routeId;
  }

  hint(): string {
    return `Defeat ${this.requiredValue} zoids on ${this.routeName ?? this.routeId}`;
  }

  isCompleted(): boolean {
    return this.progress() >= this.requiredValue;
  }

  progress(): number {
    return getRouteKills(this.routeId);
  }
}
