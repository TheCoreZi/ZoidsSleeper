export interface Region {
  cityIds: string[];
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
    cityIds: ['abandoned-camp', 'gleam-village', 'wind-colony'],
    id: 'south-europa',
    image: 'images/map/europa.png',
    imageSize: { h: 1024, w: 1536 },
    initialLandmark: 'gleam-village',
    name: 'Southern Europa',
    routeIds: ['gleam-outskirts', 'wind-road'],
    subtitle: 'Western Continent: Europa',
    viewBox: { h: 200, w: 300, x: 700, y: 750 },
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
