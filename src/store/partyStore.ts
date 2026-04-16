import { createMemo, createSignal } from 'solid-js';
import { buildZoid, calculatePartyAttack, calculatePartyMaxHealth, type CustomizedZoid, DEFAULT_PARTY, getOwnedZoidLevel, type OwnedZoid, ZoidResearchStatus } from '../models/Zoid';
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

function findStrongestZoid(): CustomizedZoid {
  const partyZoids = party();
  if (partyZoids.length === 0) {throw new Error('Party is empty');}
  const strongest = partyZoids.reduce((best, z) => z.experience > best.experience ? z : best);
  return buildZoid({ id: strongest.id, level: getOwnedZoidLevel(strongest) });
}

export { addZoidToArmy, findStrongestZoid, party, partyAttack, partyMaxHealth, setParty };
