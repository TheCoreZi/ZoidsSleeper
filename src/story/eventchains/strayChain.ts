import { CUTSCENES } from '../../cutscene';
import { ActionFightWild } from '../../landmark/action/ActionFightWild';
import { ActionPlayCutscene } from '../../landmark/action/ActionPlayCutscene';
import { ActionTalkToNPC } from '../../landmark/action/ActionTalkToNPC';
import type { CityAction } from '../../landmark/action/CityAction';
import type { ZoidBlueprint } from '../../models/Zoid';
import { ImpossibleRequirement, MissionCompletedRequirement, WildDefeatRequirement } from '../../requirement';
import { activateCityActionReward, missionAdvanceReward } from '../../reward';

const S = 'shells_of_time';

const STRAY_HELCAT_BLUEPRINT: ZoidBlueprint = { attackOverride: 65, id: 'helcat_stray', level: 65, maxHealthOverride: 15000, scannable: false };
const STRAY_REWARD = { magnis: 8000, zi_metal: 20 };
const hidden = [new ImpossibleRequirement()];

const cutsceneStatue = new ActionPlayCutscene(
  CUTSCENES.narration_ancient_pulse, 'ui:observe', hidden, [new MissionCompletedRequirement(S, 'survive_stray')],
  missionAdvanceReward(S)
);

const fight2 = new ActionFightWild(
  'stray_helcat_wild', Array.from({ length: 10 }, () => STRAY_HELCAT_BLUEPRINT), STRAY_REWARD, hidden,
  [new MissionCompletedRequirement(S, 'survive_stray')],
  true, activateCityActionReward(cutsceneStatue)
);

const cutsceneGetsUp = new ActionPlayCutscene(
  CUTSCENES.narration_stray_gets_up, 'ui:observe', hidden,
  [new WildDefeatRequirement('stray_helcat_wild', 'helcat_stray')],
  activateCityActionReward(fight2)
);

const fight1 = new ActionFightWild(
  'stray_helcat_wild', [STRAY_HELCAT_BLUEPRINT], STRAY_REWARD, hidden,
  [new MissionCompletedRequirement(S, 'survive_stray')],
  false, activateCityActionReward(cutsceneGetsUp)
);

export const POST_DEMO_TALK = new ActionTalkToNPC(
  'dr_thrun',
  [new MissionCompletedRequirement(S, 'clear_ruins_demo')],
  [new MissionCompletedRequirement(S, 'clear_ruins_stray')]
);

export const STRAY_CHAIN_TRIGGER = new ActionPlayCutscene(
  CUTSCENES.narration_stray_helcat, 'ui:investigate_stray_helcat',
  [new MissionCompletedRequirement(S, 'clear_ruins_stray')],
  [new MissionCompletedRequirement(S, 'survive_stray')],
  activateCityActionReward(fight1)
);

export const STRAY_CHAIN_ACTIONS: CityAction[] = [POST_DEMO_TALK, STRAY_CHAIN_TRIGGER, fight1, cutsceneGetsUp, fight2, cutsceneStatue];
