import { buildDialogLines, DialogScript } from './Dialog';

const MALINOFF_PORTRAIT = 'images/pilots/malinoff.png';
const MALINOFF_KEY = 'pilots:captain_malinoff';

export const PLANET_INTRO_KEYS = buildDialogLines('', 'dialog:planet_intro').map((l) => l.textKey);

export const CAPTAIN_DIALOG = new DialogScript(buildDialogLines(MALINOFF_KEY, 'dialog:captain', MALINOFF_PORTRAIT));

export const CHALLENGE_DIALOG = (zoidName: string): DialogScript =>
  new DialogScript(buildDialogLines(MALINOFF_KEY, 'dialog:challenge', MALINOFF_PORTRAIT, { 0: { zoidName } }));

export const FAREWELL_DIALOG = new DialogScript(buildDialogLines(MALINOFF_KEY, 'dialog:farewell', MALINOFF_PORTRAIT));
