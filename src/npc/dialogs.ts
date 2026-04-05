import type { DialogScript } from '../story/Dialog';

export const NPCDialogs: Record<string, DialogScript> = {
  boy: [
    { speaker: 'Boy', text: 'Please, you have to help me! A bandit came and took my sister and my mother!' },
    { speaker: 'Boy', text: "They went toward the abandoned camp to the north... I'm so scared for them." },
    { speaker: 'Boy', text: 'But be careful, the bandit is really strong!' },
    { speaker: 'Boy', text: "You should take the intermediate route to get there. You'll encounter Zoids Sleepers along the way — it's good practice for your combat techniques." },
    { speaker: 'Boy', text: 'Please, bring them back safely!' },
  ],
  woman: [
    { speaker: 'Woman', text: 'Thank you for saving me! But please, you have to help me!' },
    { speaker: 'Woman', text: 'The bandits... they took my son! They dragged him toward Wind Colony!' },
    { speaker: 'Woman', text: "I'm desperate... he's just a child. Please, you have to save him!" },
    { speaker: 'Woman', text: 'Wind Colony is to the east. Be careful, the road is dangerous.' },
  ],
};
