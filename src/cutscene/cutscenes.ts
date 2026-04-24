import { itemReward } from '../reward/ItemReward';
import { Cutscene } from './Cutscene';

export const CUTSCENES: Record<string, Cutscene> = {
  narration_arcobaleno_plan: new Cutscene('narration_arcobaleno_plan', 'dialog:narration_arcobaleno_plan', undefined, {1: 'images/cutscenes/arcobaleno.jpg'}),
  narration_bandits_flee: new Cutscene('narration_bandits_flee', 'dialog:narration_bandits_flee', undefined, {0: 'images/cutscenes/rosso_defeat.jpg'}),
  narration_colony_attack: new Cutscene('narration_colony_attack', 'dialog:narration_colony_attack', undefined, {0: 'images/cutscenes/colony_attack.jpg'}),
  narration_dr_t_appears: new Cutscene('narration_dr_t_appears', 'dialog:narration_dr_t_appears', undefined, undefined, { 1: { portrait: 'images/pilots/dr_t.png', speakerKey: '???' }, 2: {portrait: '', speakerKey: ''} }),
  narration_discover_fione: new Cutscene('narration_discover_fione', 'dialog:narration_discover_fione', itemReward('ancient_statue', 1, true), { 1: 'images/cutscenes/fine_ruins.jpg', 2: 'images/items/ancient_statue.png' }),
  narration_maria_kidnapped: new Cutscene('narration_maria_kidnapped', 'dialog:narration_maria_kidnapped', undefined, {0: 'images/cutscenes/maria_kidnap.jpg'}),
  narration_shield_liger: new Cutscene('narration_shield_liger', 'dialog:narration_shield_liger', undefined, {0: 'images/cutscenes/van_zeke_escape.jpg',1:'images/cutscenes/shield_liger.jpg'}),
  narration_turtle_savior: new Cutscene('narration_turtle_savior', 'dialog:narration_turtle_savior', undefined, {0: 'images/cutscenes/red_horn.jpg', 1: 'images/items/ancient_statue.png', 2: 'images/cutscenes/red_horn_shoot.jpg', 3: 'images/cutscenes/turtle_shot.jpg'}),
  narration_van_farewell: new Cutscene('narration_van_farewell', 'dialog:narration_van_farewell', undefined, {0: 'images/cutscenes/van_farewell.jpg'}),
};
