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
    image: 'images/map/south_europa.png',
    imageSize: { h: 1024, w: 1536 },
    initialLandmark: 'gleam_village',
    name: 'Southern Europa',
    routeIds: ['bandit_trail', 'dustwind_trail', 'elmia_desert', 'gleam_outskirts', 'wind_road'],
    subtitle: 'Western Continent: Europa',
    viewBox: { h: 290, w: 430, x: 250, y: 240 },
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
