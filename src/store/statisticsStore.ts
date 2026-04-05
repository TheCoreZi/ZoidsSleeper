import { createSignal } from 'solid-js';

const [pilotDefeats, setPilotDefeats] = createSignal<Record<string, number>>({});
const [routeKills, setRouteKills] = createSignal<Record<string, number>>({});

function getPilotDefeats(pilotId: string): number {
  return pilotDefeats()[pilotId] ?? 0;
}

function getRouteKills(routeId: string): number {
  return routeKills()[routeId] ?? 0;
}

function incrementPilotDefeats(pilotId: string): void {
  setPilotDefeats((prev) => ({ ...prev, [pilotId]: (prev[pilotId] ?? 0) + 1 }));
}

function incrementRouteKills(routeId: string): void {
  setRouteKills((prev) => ({ ...prev, [routeId]: (prev[routeId] ?? 0) + 1 }));
}

function loadStatistics(routeKillsData: Record<string, number>, pilotDefeatsData: Record<string, number>): void {
  setPilotDefeats(pilotDefeatsData);
  setRouteKills(routeKillsData);
}

export { getPilotDefeats, getRouteKills, incrementPilotDefeats, incrementRouteKills, loadStatistics, pilotDefeats, routeKills };
