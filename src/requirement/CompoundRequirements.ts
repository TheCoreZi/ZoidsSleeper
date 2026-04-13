import { ITEMS } from '../item';
import { AtLeastOneRequirement } from './AtLeastOneRequirement';
import { ItemRequirement } from './ItemRequirement';
import { MissionCompletedRequirement } from './MissionCompletedRequirement';
import { NpcTalkedInCampaignRequirement } from './NpcTalkedInCampaignRequirement';

export const COMPOUND_REQUIREMENTS = {
  becker_probes: new AtLeastOneRequirement([
    new ItemRequirement(ITEMS.core_probe.id),
    new MissionCompletedRequirement('sleeper_commander', 'obtain_zi_data'),
    new NpcTalkedInCampaignRequirement('sleeper_commander', 'becker'),
  ]),
} as const;
