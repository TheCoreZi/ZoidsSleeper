import { itemReward } from '../reward/ItemReward';
import { Cutscene } from './Cutscene';

export const CUTSCENES: Record<string, Cutscene> = {
  narration_discover_fione: new Cutscene('narration_discover_fione', 'dialog:narration_discover_fione', itemReward('ancient_statue', 1, true)),
  narration_shield_liger: new Cutscene('narration_shield_liger', 'dialog:narration_shield_liger'),
};
