import { itemReward } from '../reward/ItemReward';
import { Cutscene } from './Cutscene';

export const CUTSCENES: Record<string, Cutscene> = {
  narration_arcobaleno_plan: new Cutscene('narration_arcobaleno_plan', 'dialog:narration_arcobaleno_plan'),
  narration_bandits_flee: new Cutscene('narration_bandits_flee', 'dialog:narration_bandits_flee'),
  narration_colony_attack: new Cutscene('narration_colony_attack', 'dialog:narration_colony_attack'),
  narration_discover_fione: new Cutscene('narration_discover_fione', 'dialog:narration_discover_fione', itemReward('ancient_statue', 1, true)),
  narration_maria_kidnapped: new Cutscene('narration_maria_kidnapped', 'dialog:narration_maria_kidnapped'),
  narration_shield_liger: new Cutscene('narration_shield_liger', 'dialog:narration_shield_liger'),
  narration_turtle_savior: new Cutscene('narration_turtle_savior', 'dialog:narration_turtle_savior'),
  narration_van_farewell: new Cutscene('narration_van_farewell', 'dialog:narration_van_farewell'),
};
