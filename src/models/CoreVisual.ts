import { Faction } from './Faction';
import type { ZoidSpecies } from './Zoid';
import { ZoidSize } from './Zoid';

export interface CoreVisualLayers {
  color: string;
  pattern: string;
  shape: string;
  sizePx: number;
}

const CORE_SIZE_PX: Record<ZoidSize, number> = {
  [ZoidSize.Colossal]: 72,
  [ZoidSize.XL]: 64,
  [ZoidSize.L]: 56,
  [ZoidSize.M]: 48,
  [ZoidSize.S]: 40,
  [ZoidSize.XS]: 32,
};

const CORE_COLORS: Record<Faction, string> = {
  [Faction.DarkArmy]: 'images/cores/color_dark_army.png',
  [Faction.GuylosEmpire]: 'images/cores/color_guylos.png',
  [Faction.HelicRepublic]: 'images/cores/color_helic.png',
  [Faction.Neutral]: 'images/cores/color_neutral.png',
  [Faction.NeoZenebas]: 'images/cores/color_neo.png',
  [Faction.ZenebasEmpire]: 'images/cores/color_zenebas.png',
};

const CORE_PATTERNS = [
  'images/cores/pattern_1.png',
  'images/cores/pattern_2.png',
  'images/cores/pattern_3.png',
  'images/cores/pattern_4.png',
];

const CORE_SHAPES = [
  'images/cores/shape_1.png',
  'images/cores/shape_2.png',
  'images/cores/shape_3.png',
];

export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCoreVisual(species: ZoidSpecies): CoreVisualLayers {
  const statsKey = `${species.attack}-${species.maxHealth}-${species.baseExp}-${species.scanRate}-${species.price}-${species.coreFragments}`;
  return {
    color: CORE_COLORS[species.faction],
    pattern: CORE_PATTERNS[hashString(species.id) % CORE_PATTERNS.length],
    shape: CORE_SHAPES[hashString(statsKey) % CORE_SHAPES.length],
    sizePx: CORE_SIZE_PX[species.size],
  };
}
