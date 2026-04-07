import { createMemo, createSignal } from 'solid-js';
import { calculatePartyAttack, calculatePartyMaxHealth, DEFAULT_PARTY, type OwnedZoid, ZoidResearchStatus } from '../models/Zoid';
import { updateZoidResearch } from './zoidResearchStore';

const [party, setParty] = createSignal<OwnedZoid[]>(DEFAULT_PARTY);

const partyAttack = createMemo(() => calculatePartyAttack(party()));
const partyMaxHealth = createMemo(() => calculatePartyMaxHealth(party()));

function addZoidToArmy(zoidId: string, experience = 0): void {
  setParty((prev) => [...prev, { experience, id: zoidId }]);
  updateZoidResearch(zoidId, ZoidResearchStatus.Created);
}

export { addZoidToArmy, party, partyAttack, partyMaxHealth, setParty };
