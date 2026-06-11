import type { Drop } from '../item/Drop';
import { AttackEvolution, CompoundEvolution, HealthEvolution, LevelEvolution } from '../evolution';
import type { EvolutionRule, OwnedZoidStats } from '../evolution';
import { ZiDataDrop } from '../item/ZiDataDrop';
import { Faction, getFactionBonus } from './Faction';
import { LevelType, levelFromExperience } from './LevelType';
import { TerrainType, getTerrainBonus } from './Terrain';

export const ZoidSize = {
  Colossal: 'colossal',
  XL: 'xl',
  L: 'l',
  M: 'm',
  S: 's',
  XS: 'xs',
  XXS: 'xxs',
} as const;

export type ZoidSize = (typeof ZoidSize)[keyof typeof ZoidSize];

/** A zoid owned by the player, tracking accumulated experience. */
export interface OwnedZoid {
  copies?: number;
  experience: number;
  id: string;
  rebornBonusPercent?: number;
  rebornCount?: number;
}

export { ZoidResearchStatus } from './ZoidResearchStatus';

/** Static base template for a zoid species (attack, health, faction, price, etc.) */
export interface ZoidSpecies {
  attack: number;
  baseExp: number;
  coreFragments: number;
  faction: Faction;
  id: string;
  levelType: LevelType;
  maxHealth: number;
  name: string;
  price: number;
  scanRate: number;
  size: ZoidSize;
  terrainTypes: TerrainType[];
  evolution?: EvolutionRule;
  height?: number;
  itemDrops?: Drop[];
  length?: number;
  speed?: number;
  type?: string;
  weight?: number;
  width?: number;
}

/** A live zoid in combat with mutable health. Extends CustomizedZoid. */
export interface SpawnedZoid extends CustomizedZoid {
  health: number;
}

/** Configuration to spawn an enemy: species id + level + optional stat overrides. */
export interface ZoidBlueprint {
  attackOverride?: number;
  bonusMultiplier?: number;
  id: string;
  imageOverride?: string;
  level: number;
  maxHealthOverride?: number;
  rebornBonusPercent?: number;
  scannable?: boolean;
}

/** Computed stats for a zoid at a specific level, built from a ZoidBlueprint. */
export interface CustomizedZoid {
  attack: number;
  id: string;
  imageOverride?: string;
  level: number;
  maxHealth: number;
  name: string;
  scannable: boolean;
}

export const ZOID_LIST: Record<string, ZoidSpecies> = {
  ancient_tortoise: { id: 'ancient_tortoise', name: 'Ancient Tortoise', attack: 180, maxHealth: 600, baseExp: 60, scanRate: -1, price: 15000, faction: Faction.Neutral, levelType: LevelType.Slow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1300, size: ZoidSize.S, height: 5.8, length: 11.3, speed: 60, type: 'tortoise', weight: 40.1, width: 6.3 },
  aquadon: { id: 'aquadon', name: 'Aquadon', attack: 100, maxHealth: 80, baseExp: 50, scanRate: 65, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400, size: ZoidSize.S, evolution: new LevelEvolution('furolesios', 50), height: 2.7, length: 9.8, speed: 80, type: 'frog', weight: 5.9, width: 6 },
  barigator: { id: 'barigator', name: 'Barigator', attack: 160, maxHealth: 350, baseExp: 50, scanRate: 35, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 4.4, length: 14.5, speed: 150, type: 'crocodile', weight: 24.3, width: 4 },
  barrage_tortoise: { id: 'barrage_tortoise', name: 'Barrage Tortoise', attack: 210, maxHealth: 1000, baseExp: 150, scanRate: -1, price: 200000, faction: Faction.Neutral, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1500, size: ZoidSize.M, height: 6.8, length: 9.9, speed: 120, type: 'turtle', weight: 43.1, width: 6.3 },
  bear_fighter: { id: 'bear_fighter', name: 'Bear Fighter', attack: 220, maxHealth: 500, baseExp: 80, scanRate: 35, price: 40000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1800, size: ZoidSize.M, height: 6.8, length: 12, speed: 190, type: 'bear', weight: 45.6, width: 6.3 },
  cannon_tortoise: { id: 'cannon_tortoise', name: 'Cannon Tortoise', attack: 160, maxHealth: 500, baseExp: 50, scanRate: 40, price: 8000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1300, size: ZoidSize.S, height: 5.8, length: 9.9, speed: 100, type: 'turtle', weight: 33.6, width: 6.3 },
  cannon_tortoise_bc: { id: 'cannon_tortoise_bc', name: 'Cannon Tortoise BC', attack: 230, maxHealth: 700, baseExp: 80, scanRate: 30, price: 0, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1500, size: ZoidSize.S, height: 5.8, length: 9.9, speed: 80, type: 'turtle', weight: 38.3, width: 6.3 },
  cannon_tortoise_os: { id: 'cannon_tortoise_os', name: 'Cannon Tortoise OS', attack: 200, maxHealth: 800, baseExp: 100, scanRate: -1, price: 50000, faction: Faction.Neutral, levelType: LevelType.Slow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 2000, size: ZoidSize.S, height: 5.8, length: 9.9, speed: 100, type: 'turtle', weight: 40.3, width: 6.3 },
  command_wolf: { id: 'command_wolf', name: 'Command Wolf', attack: 200, maxHealth: 250, baseExp: 50, scanRate: 35, price: 35000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 7.9, length: 14.7, speed: 200, type: 'wolf', weight: 46, width: 5.9 },
  command_wolf_desert: { id: 'command_wolf_desert', name: 'Command Wolf (Desert)', attack: 200, maxHealth: 250, baseExp: 50, scanRate: 35, price: 35000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 7.9, length: 14.7, speed: 200, type: 'wolf', weight: 46, width: 5.9 },
  crablaster: { id: 'crablaster', name: 'Crablaster', attack: 50, maxHealth: 140, baseExp: 20, scanRate: 75, price: 2500, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400, size: ZoidSize.XXS, height: 3.0, length: 2.8, speed: 100, type: 'crab', weight: 3.8 },
  crosswinger: { id: 'crosswinger', name: 'Crosswinger', attack: 70, maxHealth: 100, baseExp: 30, scanRate: 70, price: 5000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Air], coreFragments: 800, size: ZoidSize.XXS, height: 1.5, length: 5.9, speed: 1111, type: 'dragonfly', weight: 2.5 },
  dcsj: { id: 'dcsj', name: 'Shield Liger DCS-J', attack: 320, maxHealth: 600, baseExp: 150, scanRate: 20, price: 150000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 11.5, length: 21.6, speed: 285, type: 'lion', weight: 115 },
  dragon_horse: { id: 'dragon_horse', name: 'Dragon Horse', attack: 20, maxHealth: 70, baseExp: 20, scanRate: 50, price: 1000, faction: Faction.Neutral, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 250, size: ZoidSize.XXS },
  elephantus: { id: 'elephantus', name: 'Elephantus', attack: 100, maxHealth: 200, baseExp: 80, scanRate: 30, price: 20000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.M, evolution: new HealthEvolution('mammoth', 500), height: 4, length: 8.3, speed: 95, type: 'elephant', weight: 17.7, width: 5.1 },
  furolesios: { id: 'furolesios', name: 'Furolesios', attack: 200, maxHealth: 200, baseExp: 80, scanRate: -1, price: 20000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 7.1, length: 13, speed: 83, type: 'sea_dragon', weight: 8.85, width: 9 },
  garius: { id: 'garius', name: 'Garius', attack: 50, maxHealth: 100, baseExp: 50, scanRate: 40, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.S, evolution: new LevelEvolution('godos', 50), height: 7.8, length: 6.5, speed: 270, type: 'dinosaur', weight: 12.5, width: 3.5 },
  gator: { id: 'gator', name: 'Gator', attack: 150, maxHealth: 200, baseExp: 35, scanRate: 60, price: 4000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.S, height: 5.6, length: 11.8, speed: 220, type: 'dinosaur', weight: 19.9, width: 4.4 },
  gator_radome: { id: 'gator_radome', name: 'Gator Radome', attack: 150, maxHealth: 350, baseExp: 45, scanRate: 50, price: 8000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1500, size: ZoidSize.S, height: 5.6, length: 11.8, speed: 200, type: 'dinosaur', weight: 21.5, width: 4.4 },
  godos: { id: 'godos', name: 'Godos', attack: 120, maxHealth: 250, baseExp: 70, scanRate: -1, price: 25000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.S, height: 9, length: 12.3, speed: 150, type: 'dinosaur', weight: 23, width: 3.8 },
  geruder: { id: 'geruder', name: 'Geruder', attack: 160, maxHealth: 450, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fluctuating, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.M, evolution: new CompoundEvolution('red_horn', [new AttackEvolution('red_horn', 500), new HealthEvolution('red_horn', 1000)]), height: 4.5, length: 10.73, speed: 200, type: 'dinosaur', weight: 25 },
  giraffsworder: { id: 'giraffsworder', name: 'Girafsworder', attack: 160, maxHealth: 150, baseExp: 35, scanRate: 45, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XXS, height: 3.6, length: 9.2, speed: 320, type: 'stag_beetle', weight: 8.2 },
  glidoler: { id: 'glidoler', name: 'Glidoler', attack: 100, maxHealth: 40, baseExp: 50, scanRate: 40, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air, TerrainType.Land, TerrainType.Water], coreFragments: 1000, size: ZoidSize.S, evolution: new LevelEvolution('pegasuros', 100), height: 5.2, length: 5.3, speed: 5186, type: 'waterfowl', weight: 3.9, width: 6.2 },
  goliath: { id: 'goliath', name: 'Goliath', attack: 10, maxHealth: 450, baseExp: 60, scanRate: 80, price: 6000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.XXS, height: 2.9, length: 3.1, speed: 120, type: 'snail', weight: 5 },
  gorgodos: { id: 'gorgodos', name: 'Gorgodos', attack: 140, maxHealth: 400, baseExp: 50, scanRate: 35, price: 12000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.M, evolution: new HealthEvolution('gordos', 1000), height: 5.2, length: 12.2, speed: 105, type: 'dinosaur', weight: 13.3, width: 4.4 },
  gordos: { id: 'gordos', name: 'Gordos', attack: 200, maxHealth: 500, baseExp: 150, scanRate: -1, price: 120000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 15.1, length: 30.3, speed: 80, type: 'dinosaur', weight: 199, width: 9.3 },
  grandmolar: { id: 'grandmolar', name: 'Grandmolar', attack: 120, maxHealth: 400, baseExp: 50, scanRate: 40, price: 20000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.XXS, height: 1.4, length: 4.6, speed: 90, type: 'mole', weight: 6.8 },
  gunbeetle: { id: 'gunbeetle', name: 'Gunbeetle', attack: 120, maxHealth: 200, baseExp: 35, scanRate: 45, price: 5000, faction: Faction.Neutral, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XXS, height: 3.5, length: 8.6, speed: 350, type: 'beetle', weight: 8 },
  gurantula: { id: 'gurantula', name: 'Gurantula', attack: 120, maxHealth: 300, baseExp: 35, scanRate: -1, price: 4000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS, evolution: new AttackEvolution('guysack', 100), height: 4.8, length: 6, speed: 330, type: 'spider', weight: 4.6, width: 6 },
  guysack: { id: 'guysack', name: 'Guysack', attack: 170, maxHealth: 400, baseExp: 45, scanRate: -1, price: 8000, faction: Faction.HelicRepublic, itemDrops: [new ZiDataDrop('gurantula', 30)], levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.S, height: 4, length: 10, speed: 120, type: 'scorpion', weight: 22, width: 6.2 },
  hammerrock: { id: 'hammerrock', name: 'Hammerrock', attack: 220, maxHealth: 450, baseExp: 80, scanRate: 25, price: 30000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.S, height: 6.7, length: 5.6, speed: 180, type: 'gorilla', weight: 26.8, width: 5.9 },
  helcat: { id: 'helcat', name: 'Helcat', attack: 160, maxHealth: 250, baseExp: 50, scanRate: 40, price: 25000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1400, size: ZoidSize.S, height: 5, length: 13.2, speed: 200, type: 'panther', weight: 24, width: 3.8 },
  helcat_stray: { id: 'helcat_stray', name: 'Stray Helcat', attack: 200, maxHealth: 250, baseExp: 70, scanRate: 30, price: 50000, faction: Faction.Neutral, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.M, height: 5, length: 13.2, speed: 200, type: 'panther', weight: 24, width: 3.8 },
  heldigunner: { id: 'heldigunner', name: 'Heldigunner', attack: 200, maxHealth: 400, baseExp: 70, scanRate: 35, price: 30000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 5.8, length: 24.5, speed: 130, type: 'iguana', weight: 48, width: 6.5 },
  helldiver: { id: 'helldiver', name: 'Helldiver', attack: 170, maxHealth: 90, baseExp: 20, scanRate: 70, price: 3000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 600, size: ZoidSize.XXS, height: 2, length: 6.6, speed: 148, type: 'hammerhead_shark', weight: 2.9 },
  hidocker: { id: 'hidocker', name: 'Hidocker', attack: 90, maxHealth: 250, baseExp: 50, scanRate: 30, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 6.8, length: 14.2, speed: 195, type: 'dinosaur', weight: 7.9, width: 4.2 },
  hyperscissors: { id: 'hyperscissors', name: 'Hyperscissors', attack: 40, maxHealth: 150, baseExp: 20, scanRate: 75, price: 2000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 400, size: ZoidSize.XXS, height: 1, length: 5.8, speed: 90, type: 'crayfish', weight: 3.8 },
  iron_kong: { id: 'iron_kong', name: 'Iron Kong', attack: 350, maxHealth: 1200, baseExp: 200, scanRate: 10, price: 200000, faction: Faction.GuylosEmpire, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 3000, size: ZoidSize.XL, height: 17.7, length: 11.5, speed: 150, type: 'gorilla', weight: 187, width: 13.1 },
  malder: { id: 'malder', name: 'Malder', attack: 20, maxHealth: 700, baseExp: 70, scanRate: 50, price: 6000, faction: Faction.ZenebasEmpire, levelType: LevelType.Erratic, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.S, height: 6.5, length: 8.5, speed: 120, type: 'snail', weight: 34.6, width: 4.3 },
  mammoth: { id: 'mammoth', name: 'Mammoth', attack: 200, maxHealth: 700, baseExp: 120, scanRate: -1, price: 100000, faction: Faction.HelicRepublic, levelType: LevelType.Slow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.XL, height: 12.2, length: 21.6, speed: 85, type: 'mammoth', weight: 145, width: 12.9 },
  merda: { id: 'merda', name: 'Merda', attack: 50, maxHealth: 100, baseExp: 20, scanRate: 80, price: 2000, faction: Faction.ZenebasEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 400, size: ZoidSize.XS, height: 6.8, length: 12.2, speed: 500, type: 'dinosaur', weight: 17.5 },
  missile_tortoise: { id: 'missile_tortoise', name: 'Missile Tortoise', attack: 180, maxHealth: 500, baseExp: 60, scanRate: 40, price: 15000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1400, size: ZoidSize.S, height: 5.9, length: 8.7, speed: 120, type: 'turtle', weight: 38.6 },
  molga: { id: 'molga', name: 'Molga', attack: 100, maxHealth: 400, baseExp: 50, scanRate: 40, price: 20000, faction: Faction.GuylosEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1200, size: ZoidSize.S, height: 2.95, length: 11.8, speed: 200, type: 'insect', weight: 19.7, width: 3 },
  pegasuros: { id: 'pegasuros', name: 'Pegasuros', attack: 180, maxHealth: 100, baseExp: 70, scanRate: -1, price: 30000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Air, TerrainType.Land], coreFragments: 1500, size: ZoidSize.S, height: 8, length: 10, speed: 3087, type: 'bird', weight: 4.7, width: 3.2 },
  red_horn: { id: 'red_horn', name: 'Red Horn', attack: 280, maxHealth: 800, baseExp: 120, scanRate: 20, price: 150000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 7.6, length: 20.8, speed: 130, type: 'styracosaurus', weight: 94, width: 7.2 },
  redler: { id: 'redler', name: 'Redler', attack: 210, maxHealth: 150, baseExp: 70, scanRate: 30, price: 42000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Air], coreFragments: 1600, size: ZoidSize.M, height: 6, length: 17, speed: 3704, type: 'dragon', weight: 34, width: 15 },
  saber_tiger: { id: 'saber_tiger', name: 'Saber Tiger', attack: 300, maxHealth: 450, baseExp: 100, scanRate: 25, price: 100000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.L, height: 9.1, length: 15.6, speed: 240, type: 'tiger', weight: 78, width: 5.7 },
  saber_tiger_gs: { id: 'saber_tiger_gs', name: 'Saber Tiger GS', attack: 350, maxHealth: 650, baseExp: 150, scanRate: -1, price: 160000, faction: Faction.Neutral, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 9.1, length: 15.8, speed: 230, type: 'tiger', weight: 95, width: 5.7 },
  saber_tiger_rs: { id: 'saber_tiger_rs', name: 'Saber Tiger RS', attack: 320, maxHealth: 500, baseExp: 150, scanRate: -1, price: 150000, faction: Faction.GuylosEmpire, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2500, size: ZoidSize.L, height: 9.1, length: 15.6, speed: 240, type: 'tiger', weight: 78, width: 5.7 },
  saradin: { id: 'saradin', name: 'Saradin', attack: 60, maxHealth: 500, baseExp: 50, scanRate: 60, price: 10000, faction: Faction.HelicRepublic, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.XXS, height: 1.8, length: 5.5, speed: 120, type: 'armadillo', weight: 6.5 },
  sea_batoras: { id: 'sea_batoras', name: 'Sea Batoras', attack: 50, maxHealth: 180, baseExp: 20, scanRate: 70, price: 2500, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Water], coreFragments: 400, size: ZoidSize.XXS, height: 0.9, length: 4.5, speed: 750, type: 'horseshoe_crab', weight: 4.9 },
  sea_panther: { id: 'sea_panther', name: 'Sea Panther', attack: 90, maxHealth: 400, baseExp: 50, scanRate: 40, price: 8000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Water, TerrainType.Land], coreFragments: 1400, size: ZoidSize.M, height: 4.9, length: 9, speed: 93, type: 'hermit_crab', weight: 28.5, width: 5.4 },
  shield_liger: { id: 'shield_liger', name: 'Shield Liger', attack: 250, maxHealth: 600, baseExp: 100, scanRate: 25, price: 100000, faction: Faction.HelicRepublic, levelType: LevelType.MediumFast, terrainTypes: [TerrainType.Land], coreFragments: 2000, size: ZoidSize.L, height: 9, length: 21.6, speed: 250, type: 'lion', weight: 92, width: 6 },
  sinker: { id: 'sinker', name: 'Sinker', attack: 180, maxHealth: 120, baseExp: 40, scanRate: 40, price: 20000, faction: Faction.GuylosEmpire, levelType: LevelType.Fast, terrainTypes: [TerrainType.Air, TerrainType.Water], coreFragments: 1200, size: ZoidSize.S, height: 3, length: 10.8, speed: 111, type: 'stingray', weight: 26.6, width: 12.7 },
  spiker: { id: 'spiker', name: 'Spiker', attack: 150, maxHealth: 180, baseExp: 35, scanRate: 55, price: 5000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 800, size: ZoidSize.XS, height: 6, length: 9, speed: 220, type: 'mantis', weight: 6.4, width: 4.2 },
  stealth_viper: { id: 'stealth_viper', name: 'Stealth Viper', attack: 180, maxHealth: 200, baseExp: 45, scanRate: 40, price: 25000, faction: Faction.HelicRepublic, levelType: LevelType.Fast, terrainTypes: [TerrainType.Land], coreFragments: 1600, size: ZoidSize.M, height: 3, length: 20.8, speed: 180, type: 'snake', weight: 23.6, width: 4.2 },
  zatton: { id: 'zatton', name: 'Zatton', attack: 120, maxHealth: 350, baseExp: 40, scanRate: 40, price: 10000, faction: Faction.ZenebasEmpire, levelType: LevelType.MediumSlow, terrainTypes: [TerrainType.Land], coreFragments: 1000, size: ZoidSize.M, height: 8.7, length: 10.1, speed: 180, type: 'dinosaur', weight: 25.5, width: 4 },
};

export function calculatePartyAttack(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral, terrain: TerrainType = TerrainType.Land): number {
  return party.reduce((sum, z) => {
    const species = getZoidById(z.id);
    const factionBonus = getFactionBonus(playerFaction, species.faction);
    const built = buildZoid({ bonusMultiplier: factionBonus, id: z.id, level: getOwnedZoidLevel(z), rebornBonusPercent: z.rebornBonusPercent });
    const terrainBonus = getTerrainBonus(terrain, species.terrainTypes);
    return sum + Math.floor(built.attack * terrainBonus);
  }, 0);
}

export function calculatePartyMaxHealth(party: OwnedZoid[], playerFaction: Faction = Faction.Neutral): number {
  return party.reduce((sum, z) => {
    const bonus = getFactionBonus(playerFaction, getZoidById(z.id).faction);
    return sum + buildZoid({ bonusMultiplier: bonus, id: z.id, level: getOwnedZoidLevel(z), rebornBonusPercent: z.rebornBonusPercent }).maxHealth;
  }, 0);
}

export function calculateStat(baseStat: number, level: number, bonusMultiplier = 1): number {
  return Math.max(1, Math.floor(baseStat * (level / 100) * bonusMultiplier));
}

export function computeOwnedZoidStats(owned: OwnedZoid, playerFaction: Faction): OwnedZoidStats {
  const species = getZoidById(owned.id);
  const level = getOwnedZoidLevel(owned);
  const factionBonus = getFactionBonus(playerFaction, species.faction);
  const rebornMultiplier = 1 + (owned.rebornBonusPercent ?? 0) / 100;
  return {
    attack: Math.floor(calculateStat(species.attack, level, factionBonus) * rebornMultiplier),
    health: Math.floor(calculateStat(species.maxHealth, level, factionBonus) * rebornMultiplier),
    level,
  };
}

export function spawnZoid(stats: CustomizedZoid): SpawnedZoid {
  return { ...stats, health: stats.maxHealth };
}

export function getOwnedZoidLevel(owned: OwnedZoid): number {
  const data = getZoidById(owned.id);
  return levelFromExperience(owned.experience, data.levelType);
}

export function getZoidById(id: string): ZoidSpecies {
  const zoid = ZOID_LIST[id];
  if (!zoid) {throw new Error(`Unknown Zoid: ${id}`);}
  return zoid;
}

export function getZoidImage(id: string, imageOverride?: string): string {
  return `images/zoids/${imageOverride ?? id}.png`;
}

export function buildZoid({ attackOverride, bonusMultiplier = 1, id, imageOverride, level, maxHealthOverride, rebornBonusPercent = 0, scannable = true }: ZoidBlueprint): CustomizedZoid {
  const base = getZoidById(id);
  const rebornMultiplier = 1 + rebornBonusPercent / 100;
  return {
    attack: attackOverride ?? Math.floor(calculateStat(base.attack, level, bonusMultiplier) * rebornMultiplier),
    id: base.id,
    imageOverride,
    level,
    maxHealth: maxHealthOverride ?? Math.floor(calculateStat(base.maxHealth, level, bonusMultiplier) * rebornMultiplier),
    name: base.name,
    scannable,
  };
}

export interface PartyData {
  commanderZoidId: string;
  zoids: OwnedZoid[];
}

export const DEFAULT_PARTY: PartyData = { commanderZoidId: '', zoids: [] };
