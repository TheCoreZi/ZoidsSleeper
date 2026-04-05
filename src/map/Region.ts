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
    cityIds: ['abandoned-camp', 'gleam-village'],
    id: 'south-europa',
    image: 'images/map/europa.png',
    imageSize: { h: 1024, w: 1536 },
    initialLandmark: 'gleam-village',
    name: 'Southern Europa',
    routeIds: ['gleam-outskirts'],
    subtitle: 'Western Continent: Europa',
    viewBox: { h: 524, w: 700, x: 400, y: 500 },
  },
];

export function getRegion(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
