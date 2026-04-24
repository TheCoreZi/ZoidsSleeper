import { createMemo, createSignal } from 'solid-js';
import type { BattleBackground, City, Dungeon, Landmark, Route } from '../landmark';
import { getCity, getDungeon, getRoute, isRoute, ROUTES } from '../landmark';
import type { Region } from '../map/Region';
import { REGIONS } from '../map/Region';

const [currentLandmark, setCurrentLandmark] = createSignal<Landmark>(ROUTES[0]);
const [currentRegion, setCurrentRegion] = createSignal<Region>(REGIONS[0]);

const battleBackground = createMemo<BattleBackground>(() => currentLandmark().battleBackground);
const isOnRoute = createMemo(() => isRoute(currentLandmark()));
const landmarkBackground = createMemo<string | undefined>(() => {
  const landmark = currentLandmark();
  return isRoute(landmark) ? undefined : `images/towns/${landmark.id}.jpg`;
});

function isVisible(landmark: Landmark): boolean {
  return !landmark.devOnly || import.meta.env.DEV;
}

function citiesForRegion(region: Region): City[] {
  return region.cityIds.map((id) => getCity(id)).filter((c): c is City => c !== undefined && isVisible(c));
}

function dungeonsForRegion(region: Region): Dungeon[] {
  return region.dungeonIds.map((id) => getDungeon(id)).filter((d): d is Dungeon => d !== undefined && isVisible(d));
}

function routesForRegion(region: Region): Route[] {
  return region.routeIds.map((id) => getRoute(id)).filter((r): r is Route => r !== undefined && isVisible(r));
}

export {
  battleBackground,
  citiesForRegion,
  currentLandmark,
  currentRegion,
  dungeonsForRegion,
  isOnRoute,
  landmarkBackground,
  routesForRegion,
  setCurrentLandmark,
  setCurrentRegion,
};
