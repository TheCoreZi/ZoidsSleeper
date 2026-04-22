import { DialogChoice, DialogDecision, DialogScript } from './Dialog';

export const DECISIONS: Record<string, DialogDecision> = {
  arthur_join_republic: new DialogDecision(
    'dialog:arthur_decision.0',
    [
      new DialogChoice('ui:accept', DialogScript.fromKeys('pilots:arthur', 'dialog:arthur_accept', 'images/pilots/arthur.png')),
      new DialogChoice('ui:decline', DialogScript.fromKeys('pilots:arthur', 'dialog:arthur_decline', 'images/pilots/arthur.png')),
    ],
    'images/pilots/arthur.png'
  ),
};
