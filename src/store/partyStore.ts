import { createMemo, createSignal } from 'solid-js';
import { calculatePartyAttack, calculatePartyMaxHealth, DEFAULT_PARTY, type OwnedZoid, ZoidResearchStatus } from '../models/Zoid';
import { incrementClickAttack } from './gameStore';
import { updateZoidResearch } from './zoidResearchStore';

const [party, setParty] = createSignal<OwnedZoid[]>(DEFAULT_PARTY);

const partyAttack = createMemo(() => calculatePartyAttack(party()));
const partyMaxHealth = createMemo(() => calculatePartyMaxHealth(party()));

function addZoidToArmy(zoidId: string, experience = 0): void {
  setParty((prev) => {
    const existing = prev.find((z) => z.id === zoidId);
    if (existing) {
      return prev.map((z) => z.id === zoidId
        ? { ...z, copies: (z.copies ?? 1) + 1 }
        : z);
    }
    return [...prev, { experience, id: zoidId }];
  });
  incrementClickAttack();
  updateZoidResearch(zoidId, ZoidResearchStatus.Created);
}

export { addZoidToArmy, party, partyAttack, partyMaxHealth, setParty };
