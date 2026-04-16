import { createMemo, createSignal } from 'solid-js';
import { buildZoid, calculatePartyAttack, calculatePartyMaxHealth, type CustomizedZoid, DEFAULT_PARTY, getOwnedZoidLevel, type PartyData, ZoidResearchStatus } from '../models/Zoid';
import { incrementClickAttack } from './gameStore';
import { updateZoidResearch } from './zoidResearchStore';

const [party, setParty] = createSignal<PartyData>(DEFAULT_PARTY);

const partyAttack = createMemo(() => calculatePartyAttack(party().zoids));
const partyMaxHealth = createMemo(() => calculatePartyMaxHealth(party().zoids));

function addZoidToArmy(zoidId: string, experience = 0): void {
  setParty((prev) => {
    const existing = prev.zoids.find((z) => z.id === zoidId);
    if (existing) {
      return {
        ...prev,
        zoids: prev.zoids.map((z) => z.id === zoidId
          ? { ...z, copies: (z.copies ?? 1) + 1 }
          : z),
      };
    }
    return {
      commanderZoidId: prev.zoids.length === 0 ? zoidId : prev.commanderZoidId,
      zoids: [...prev.zoids, { experience, id: zoidId }],
    };
  });
  incrementClickAttack();
  updateZoidResearch(zoidId, ZoidResearchStatus.Created);
}

function findStrongestZoid(): CustomizedZoid {
  const { commanderZoidId, zoids } = party();
  if (zoids.length === 0) {throw new Error('Party is empty');}
  const commander = zoids.find((z) => z.id === commanderZoidId);
  const chosen = commander ?? zoids.reduce((best, z) => z.experience > best.experience ? z : best);
  return buildZoid({ id: chosen.id, level: getOwnedZoidLevel(chosen) });
}

function selectCommanderZoid(zoidId: string): void {
  setParty((prev) => ({ ...prev, commanderZoidId: zoidId }));
}

export { addZoidToArmy, findStrongestZoid, party, partyAttack, partyMaxHealth, selectCommanderZoid, setParty };
