export const TerrainType = {
  Air: 'air',
  Land: 'land',
  Water: 'water',
} as const;

export type TerrainType = (typeof TerrainType)[keyof typeof TerrainType];

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  [TerrainType.Air]: '#c8e6ff',
  [TerrainType.Land]: '#8b6914',
  [TerrainType.Water]: '#2196f3',
};

export const TERRAIN_BONUS_TABLE: Record<TerrainType, Record<TerrainType, number>> = {
  [TerrainType.Air]: { [TerrainType.Air]: 1.00, [TerrainType.Land]: 0.10, [TerrainType.Water]: 0.10 },
  [TerrainType.Land]: { [TerrainType.Air]: 0.25, [TerrainType.Land]: 1.00, [TerrainType.Water]: 0.25 },
  [TerrainType.Water]: { [TerrainType.Air]: 0.25, [TerrainType.Land]: 0.00, [TerrainType.Water]: 1.00 },
};

export function getTerrainBorderStyle(terrainTypes: TerrainType[]): string {
  const sorted = [...terrainTypes].sort();
  const colors = sorted.map((t) => TERRAIN_COLORS[t]);
  if (colors.length === 1) {
    return colors[0];
  }
  const step = 100 / colors.length;
  const stops = colors.flatMap((c, i) => [`${c} ${step * i}%`, `${c} ${step * (i + 1)}%`]);
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

export function getTerrainBonus(routeTerrain: TerrainType, zoidTerrainTypes: TerrainType[]): number {
  return Math.max(...zoidTerrainTypes.map((t) => TERRAIN_BONUS_TABLE[routeTerrain][t]));
}
