import { ITEMS } from '../item';
import { AllOfRequirement } from './AllOfRequirement';
import { AtLeastOneRequirement } from './AtLeastOneRequirement';
import { CurrentMissionRequirement } from './CurrentMissionRequirement';
import { ItemRequirement } from './ItemRequirement';
import { MissionCompletedRequirement } from './MissionCompletedRequirement';
import { NotRequirement } from './NotRequirement';
import { NpcTalkedInCampaignRequirement } from './NpcTalkedInCampaignRequirement';
import { PilotDefeatRequirement } from './PilotDefeatRequirement';

const C = 'sleeper_commander';
const G = 'olympus_guylos';
const O = 'olympus_threat';
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
  beaten_arthur_enrolled: new AllOfRequirement([
    new PilotDefeatRequirement('arthur'),
    new AtLeastOneRequirement([
      new MissionCompletedRequirement(G, 'sleeper_challenge'),
      new MissionCompletedRequirement(O, 'report_to_republican_camp'),
    ]),
  ]),
  beaten_concho_enrolled: new AllOfRequirement([
    new PilotDefeatRequirement('concho_cancer'),
    new AtLeastOneRequirement([
      new MissionCompletedRequirement(G, 'sleeper_challenge'),
      new MissionCompletedRequirement(O, 'report_to_republican_camp'),
    ]),
  ]),
  enrolled_in_faction: new AtLeastOneRequirement([
    new MissionCompletedRequirement(G, 'sleeper_challenge'),
    new MissionCompletedRequirement(O, 'report_to_republican_camp'),
  ]),
  moonbay_elmia: new MissionCompletedRequirement(G, 'recover_cargo'),
  moonbay_elmia_not_faction: new NotRequirement(
    new MissionCompletedRequirement(G, 'recover_cargo')
  ),
  tauros_moonbay: new MissionCompletedRequirement(G, 'fight_dock_thugs'),
  tauros_not_faction: new NotRequirement(
    new MissionCompletedRequirement(G, 'fight_dock_thugs')
  ),
} as const;
