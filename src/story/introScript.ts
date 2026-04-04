import type { DialogScript } from './Dialog';

export const PLANET_INTRO_TEXT = [
  'On Planet Zi, beyond the Milky Way, there exist steel Zoids with outstanding combat capability. The Zoids carry within them a warrior spirit.',
  'They are the most powerful weapon in the war between the Empire and the Republic of Planet Zi. For decades, this war has ravaged these lands. Amidst this great conflict, smaller villages struggle to survive.',
  'In one of these forgotten villages, a new threat approaches...',
];

export const CAPTAIN_DIALOG: DialogScript = [
  { speaker: 'Captain Malinoff', text: 'HEEEEEEY!! I need your help.' },
  { speaker: 'Captain Malinoff', text: 'Bandits have been raiding our village. They grow bolder each day.' },
  { speaker: 'Captain Malinoff', text: 'All our soldiers were recruited for the war between the Republic and the Empire. There is no one left to defend us.' },
  { speaker: 'Captain Malinoff', text: "I'm too old to fight anymore. My body can't take the strain of piloting a Zoid." },
  { speaker: 'Captain Malinoff', text: "But I still have three Zoids from my days as a soldier. They're outdated... but they always saved my life." },
  { speaker: 'Captain Malinoff', text: 'Would you pilot one of them to protect this village?' },
];

export const CHALLENGE_DIALOG = (zoidName: string): DialogScript => [
  { speaker: 'Captain Malinoff', text: `${zoidName}, huh? A fine choice.` },
  { speaker: 'Captain Malinoff', text: "But choosing a Zoid isn't enough. The Zoid must choose you too." },
  { speaker: 'Captain Malinoff', text: 'Prove your worth. Climb up to the cockpit and show it you have the spirit of a pilot!' },
];

export const FAREWELL_DIALOG: DialogScript = [
  { speaker: 'Captain Malinoff', text: 'Ha! I knew you had it in you. The Zoid has accepted you as its pilot.' },
  { speaker: 'Captain Malinoff', text: 'Now go and help our neighbors. The bandits won\'t wait forever.' },
  { speaker: 'Captain Malinoff', text: 'Be careful out there, kid. And take good care of that Zoid.' },
];

export const STARTER_DESCRIPTIONS: Record<string, string> = {
  elephantus: 'Strong and tough, but slow and hard to pilot. Only for the bravest.',
  garius: 'Simple and easy to control. Few offensive weapons, but if you take good care of him he will be unstoppable.',
  glidoler: 'Fast and strong, but fragile in combat. For experienced pilots.',
};
