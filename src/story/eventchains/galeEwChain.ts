import { CUTSCENES } from '../../cutscene';
import { ActionFightPilot } from '../../landmark/action/ActionFightPilot';
import { ActionPlayCutscene } from '../../landmark/action/ActionPlayCutscene';
import type { CityAction } from '../../landmark/action/CityAction';
import { CommanderOnlyFilter } from '../../models/ArmyFilter';
import { PILOTS } from '../../models/Pilot';
import { ImpossibleRequirement, MissionCompletedRequirement, PilotDefeatRequirement } from '../../requirement';
import { activateCityActionReward } from '../../reward';

const S = 'shells_of_time';
const hidden = [new ImpossibleRequirement()];

const fightGale = new ActionFightPilot(PILOTS['gale_task'], hidden, [new PilotDefeatRequirement('gale_task')], true, undefined, new CommanderOnlyFilter());

const galeEwDialog = new ActionPlayCutscene(
  CUTSCENES.narration_gale_ew, 'ui:fight_gale_task',
  [new MissionCompletedRequirement(S, 'pursue_kidnappers')],
  [new MissionCompletedRequirement(S, 'fight_gale_ew')],
  activateCityActionReward(fightGale)
);

export const GALE_EW_CHAIN: CityAction[] = [galeEwDialog, fightGale];
