import { createSignal } from 'solid-js';
import { incrementClickAttack } from './gameStore';

const [dungeonCompletions, setDungeonCompletions] = createSignal<Record<string, number>>({});
const [pilotDefeats, setPilotDefeats] = createSignal<Record<string, number>>({});
const [routeKills, setRouteKills] = createSignal<Record<string, number>>({});

function getDungeonCompletions(dungeonId: string): number {
  return dungeonCompletions()[dungeonId] ?? 0;
}

function getPilotDefeats(pilotId: string): number {
  return pilotDefeats()[pilotId] ?? 0;
}

function getRouteKills(routeId: string): number {
  return routeKills()[routeId] ?? 0;
}

function incrementDungeonCompletions(dungeonId: string): void {
  setDungeonCompletions((prev) => ({ ...prev, [dungeonId]: (prev[dungeonId] ?? 0) + 1 }));
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

function loadStatistics(
  dungeonCompletionsData: Record<string, number>,
  pilotDefeatsData: Record<string, number>,
  routeKillsData: Record<string, number>
): void {
  setDungeonCompletions(dungeonCompletionsData);
  setPilotDefeats(pilotDefeatsData);
  setRouteKills(routeKillsData);
}

export { dungeonCompletions, getDungeonCompletions, getPilotDefeats, getRouteKills, incrementDungeonCompletions, incrementPilotDefeats, incrementRouteKills, loadStatistics, pilotDefeats, routeKills };
