import { createMemo, createSignal } from 'solid-js';
import type { BattleBackground, City, Landmark, Route } from '../landmark';
import { getCity, getRoute, isRoute, ROUTES } from '../landmark';
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

function citiesForRegion(region: Region): City[] {
  return region.cityIds.map((id) => getCity(id)).filter((c): c is City => c !== undefined);
}

function routesForRegion(region: Region): Route[] {
  return region.routeIds.map((id) => getRoute(id)).filter((r): r is Route => r !== undefined);
}

export {
  battleBackground,
  citiesForRegion,
  currentLandmark,
  currentRegion,
  isOnRoute,
  landmarkBackground,
  routesForRegion,
  setCurrentLandmark,
  setCurrentRegion,
};
