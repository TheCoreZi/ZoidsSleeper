import { createSignal } from 'solid-js';
import { incrementClickAttack } from './gameStore';

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
  const previousKills = getRouteKills(routeId);
  setRouteKills((prev) => ({ ...prev, [routeId]: previousKills + 1 }));
  if ((previousKills + 1) % 200 === 0) {
    incrementClickAttack();
  }
}

function loadStatistics(routeKillsData: Record<string, number>, pilotDefeatsData: Record<string, number>): void {
  setPilotDefeats(pilotDefeatsData);
  setRouteKills(routeKillsData);
}

export { getPilotDefeats, getRouteKills, incrementPilotDefeats, incrementRouteKills, loadStatistics, pilotDefeats, routeKills };
