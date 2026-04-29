import { createSignal } from 'solid-js';
import { TerrainType } from '../models/Terrain';

const [currentTerrain, setCurrentTerrain] = createSignal<TerrainType>(TerrainType.Land);

export { currentTerrain, setCurrentTerrain };
