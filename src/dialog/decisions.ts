import { Faction } from '../models/Faction';
import { setPlayerFaction } from '../store/gameStore';
import { DialogChoice, DialogDecision, DialogScript } from './Dialog';

export const DECISIONS: Record<string, DialogDecision> = {
  arthur_join_republic: new DialogDecision(
    'dialog:arthur_decision.0',
    [
      new DialogChoice('ui:accept', DialogScript.fromKeys('pilots:arthur', 'dialog:arthur_accept', 'images/pilots/arthur.png'), undefined, () => setPlayerFaction(Faction.HelicRepublic)),
      new DialogChoice('ui:decline', DialogScript.fromKeys('pilots:arthur', 'dialog:arthur_decline', 'images/pilots/arthur.png')),
    ],
    'images/pilots/arthur.png'
  ),
  concho_join_guylos: new DialogDecision(
    'dialog:concho_decision.0',
    [
      new DialogChoice('ui:accept', DialogScript.fromKeys('pilots:concho_cancer', 'dialog:concho_accept', 'images/pilots/concho.png'), undefined, () => setPlayerFaction(Faction.GuylosEmpire)),
      new DialogChoice('ui:decline', DialogScript.fromKeys('pilots:concho_cancer', 'dialog:concho_decline', 'images/pilots/concho.png')),
    ],
    'images/pilots/concho.png'
  ),
};
