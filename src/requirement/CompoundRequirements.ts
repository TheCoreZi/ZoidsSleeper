import { ITEMS } from '../item';
import { AllOfRequirement } from './AllOfRequirement';
import { AtLeastOneRequirement } from './AtLeastOneRequirement';
import { CurrentMissionRequirement } from './CurrentMissionRequirement';
import { ItemRequirement } from './ItemRequirement';
import { MissionCompletedRequirement } from './MissionCompletedRequirement';
import { NotRequirement } from './NotRequirement';
import { NpcTalkedInCampaignRequirement } from './NpcTalkedInCampaignRequirement';

const C = 'sleeper_commander';
const S = 'shells_of_time';

export const COMPOUND_REQUIREMENTS = {
  becker_probes: new AtLeastOneRequirement([
    new ItemRequirement(ITEMS.core_preserver.id),
    new MissionCompletedRequirement(C, 'obtain_zi_data'),
    new NpcTalkedInCampaignRequirement(C, 'becker'),
  ]),
  fight_wind_colony: new AtLeastOneRequirement([
    new CurrentMissionRequirement(C, 'check_colony_uproar'),
    new CurrentMissionRequirement(C, 'repel_attackers'),
  ]),
  fisherman_tutorial: new AllOfRequirement([
    new MissionCompletedRequirement(S, 'discuss_in_lab'),
    new NotRequirement(new CurrentMissionRequirement(S, 'visit_father')),
  ]),
} as const;
