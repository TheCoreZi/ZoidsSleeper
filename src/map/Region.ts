export interface Region {
  cityIds: string[];
  dungeonIds: string[];
  id: string;
  image: string;
  imageSize: { h: number; w: number };
  initialLandmark: string;
  name: string;
  routeIds: string[];
  subtitle: string;
  viewBox: { h: number; w: number; x: number; y: number };
}

export const REGIONS: Region[] = [
  {
    cityIds: ['abandoned_camp', 'arcobaleno_camp', 'gleam_village', 'wind_colony', 'wind_oasis'],
    dungeonIds: ['elmia_ruins'],
    id: 'south_europa',
    image: 'images/map/europa.png',
    imageSize: { h: 1024, w: 1536 },
    initialLandmark: 'gleam_village',
    name: 'Southern Europa',
    routeIds: ['bandit_trail', 'dustwind_trail', 'elmia_desert', 'gleam_outskirts', 'wind_road'],
    subtitle: 'Western Continent: Europa',
    viewBox: { h: 200, w: 300, x: 700, y: 750 },
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
