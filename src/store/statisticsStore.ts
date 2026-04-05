import { createSignal } from 'solid-js';

const [routeKills, setRouteKills] = createSignal<Record<string, number>>({});

function getRouteKills(routeId: string): number {
  return routeKills()[routeId] ?? 0;
}

function incrementRouteKills(routeId: string): void {
  setRouteKills((prev) => ({ ...prev, [routeId]: (prev[routeId] ?? 0) + 1 }));
}

function loadStatistics(data: Record<string, number>): void {
  setRouteKills(data);
}

export { getRouteKills, incrementRouteKills, loadStatistics, routeKills };
