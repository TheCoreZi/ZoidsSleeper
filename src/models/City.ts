import type { CityAction } from './CityAction';
import { ActionFightPilot } from './CityAction';
import type { Landmark } from './Landmark';
import { BattleBackground, LandmarkType } from './Landmark';
import { getPilot } from './Pilot';

export interface City extends Landmark {
  actions?: CityAction[];
  mapPosition: { x: number; y: number };
  type: typeof LandmarkType.City;
}

export const CITIES: City[] = [
  {
    actions: [new ActionFightPilot(getPilot('bandit1')!, 'Fight Bandit')],
    battleBackground: BattleBackground.Grass,
    id: 'abandoned-camp',
    mapPosition: { x: 51.5, y: 85 },
    name: 'Abandoned Camp',
    type: LandmarkType.City,
  },
  { battleBackground: BattleBackground.Grass, id: 'gleam-village', mapPosition: { x: 53, y: 87 }, name: 'Gleam Village', type: LandmarkType.City },
];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}
