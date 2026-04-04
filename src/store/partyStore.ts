import { createMemo, createSignal } from 'solid-js';
import { calculatePartyAttack, calculatePartyMaxHealth, DEFAULT_PARTY, type OwnedZoid } from '../models/Zoid';

const [party, setParty] = createSignal<OwnedZoid[]>(DEFAULT_PARTY);

const partyAttack = createMemo(() => calculatePartyAttack(party()));
const partyMaxHealth = createMemo(() => calculatePartyMaxHealth(party()));

export { party, partyAttack, partyMaxHealth, setParty };
