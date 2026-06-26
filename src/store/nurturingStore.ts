import { createSignal } from 'solid-js';
import { REBORN_ATTACK_BONUS_PERCENT } from '../constants';
import { t } from '../i18n';
import { levelFromExperience } from '../models/LevelType';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import { NO_TRANSPORT_BONUS, TRANSPORT_ZOID_BONUSES, type TransportZoidBonus } from '../models/TransportZoid';
import type { OwnedZoid } from '../models/Zoid';
import { getZoidById, getZoidImage, getZoidName } from '../models/Zoid';
import { playerStats, showPopup } from './gameStore';
import { addZoidToArmy, party, setParty } from './partyStore';
import type { TankSlot } from './TankSlot';
import { STATUE_SLOT, TankSlotSource } from './TankSlot';
import { addCore, removeCore } from './zoidCoreStore';

const [tankSlots, setTankSlots] = createSignal<TankSlot[]>([]);
const [transportZoidId, setTransportZoidId] = createSignal<string | null>(null);

function addFragments(amount: number): void {
  const multiplied = Math.floor(amount * getTransportBonus().fragmentMultiplier);
  setTankSlots((prev) => {
    const hasChange = prev.some((s) => s.fragments < s.fragmentsRequired);
    if (!hasChange) {return prev;}
    return prev.map((slot) =>
      slot.fragments >= slot.fragmentsRequired
        ? slot
        : { ...slot, fragments: Math.min(slot.fragments + multiplied, slot.fragmentsRequired) }
    );
  });
}

function completeSlot(index: number): void {
  const slots = tankSlots();
  const slot = slots[index];
  if (!slot || slot.fragments < slot.fragmentsRequired) {return;}

  if (slot.source === TankSlotSource.Core) {
    addZoidToArmy(slot.zoidSpeciesId);
  } else if (slot.source === TankSlotSource.Reborn) {
    const reborn: OwnedZoid = {
      ...slot.ownedZoid,
      rebornBonusPercent: (slot.ownedZoid.rebornBonusPercent ?? 0) + REBORN_ATTACK_BONUS_PERCENT * getTransportBonus().rebornBonusMultiplier,
      rebornCount: (slot.ownedZoid.rebornCount ?? 0) + 1,
      experience: 0,
    };
    setParty((prev) => ({
      ...prev,
      zoids: [...prev.zoids, reborn],
    }));
  }

  const name = getZoidName(slot.zoidSpeciesId);
  showPopup(new PopupMessage(name, t('ui:nurturing_zoid_hatched', { name }), PopupType.Item, getZoidImage(slot.zoidSpeciesId)));
  setTankSlots((prev) => prev.filter((_, i) => i !== index));
}

function getAvailableSlotCount(): number {
  const stats = playerStats();
  return (stats?.nurturingSlots ?? 1) + getTransportBonus().extraSlots - tankSlots().length;
}

function getAvailableTransportZoids(): string[] {
  const owned = party().zoids.map((z) => z.id);
  return Object.keys(TRANSPORT_ZOID_BONUSES).filter((id) => owned.includes(id));
}

function getTransportBonus(): TransportZoidBonus {
  const id = transportZoidId();
  return id ? TRANSPORT_ZOID_BONUSES[id] ?? NO_TRANSPORT_BONUS : NO_TRANSPORT_BONUS;
}

function isSpeciesInTank(zoidSpeciesId: string): boolean {
  return tankSlots().some((slot) => slot.zoidSpeciesId === zoidSpeciesId);
}

function loadTankSlots(data?: TankSlot[]): void {
  setTankSlots(data ?? []);
}

function loadTransportZoidId(id?: string | null): void {
  setTransportZoidId(id ?? null);
}

function placeCore(coreId: string, zoidSpeciesId: string): void {
  if (getAvailableSlotCount() <= 0) {return;}
  removeCore(coreId);
  const species = getZoidById(zoidSpeciesId);
  setTankSlots((prev) => [...prev, {
    coreId,
    fragments: 0,
    fragmentsRequired: species.coreFragments,
    source: TankSlotSource.Core,
    zoidSpeciesId,
  }]);
}

function placeReborn(zoidId: string): void {
  if (getAvailableSlotCount() <= 0) {return;}
  const p = party();
  const zoid = p.zoids.find((z) => z.id === zoidId);
  if (!zoid) {return;}

  const species = getZoidById(zoidId);
  const zoidLevel = levelFromExperience(zoid.experience, species.levelType);
  if (zoidLevel < 100) {return;}
  if (p.zoids.length <= 1) {return;}

  setParty((prev) => {
    const filtered = prev.zoids.filter((z) => z.id !== zoidId);
    const commanderZoidId = prev.commanderZoidId === zoidId
      ? (filtered[0]?.id ?? '')
      : prev.commanderZoidId;
    return { commanderZoidId, zoids: filtered };
  });

  setTankSlots((prev) => [...prev, {
    fragments: 0,
    fragmentsRequired: species.coreFragments,
    ownedZoid: { ...zoid },
    source: TankSlotSource.Reborn,
    zoidSpeciesId: zoidId,
  }]);
}

function isCoreNurtured(zoidSpeciesId: string): boolean {
  return tankSlots().some((slot) => slot.zoidSpeciesId === zoidSpeciesId && slot.fragments >= slot.fragmentsRequired);
}

function placeStatue(): void {
  const stats = playerStats();
  const maxSlots = stats?.nurturingSlots ?? 1;
  const slots = tankSlots();

  if (slots.length >= maxSlots) {
    const displaced = slots[slots.length - 1];
    if (displaced.source === TankSlotSource.Core) {
      addCore(displaced.coreId);
    } else if (displaced.source === TankSlotSource.Reborn) {
      setParty((prev) => ({
        ...prev,
        zoids: [...prev.zoids, displaced.ownedZoid],
      }));
    }
    setTankSlots((prev) => prev.slice(0, -1));
  }

  setTankSlots((prev) => [...prev, { ...STATUE_SLOT }]);
}

function removeStatueSlot(): void {
  setTankSlots((prev) => prev.filter((slot) => slot.source !== TankSlotSource.Statue));
}

function selectTransportZoid(newId: string | null): void {
  setTransportZoidId(newId);
  const newExtraSlots = getTransportBonus().extraSlots;

  const stats = playerStats();
  const baseSlots = stats?.nurturingSlots ?? 1;
  const newMax = baseSlots + newExtraSlots;
  const currentSlots = tankSlots();

  if (currentSlots.length > newMax) {
    const toEvict = currentSlots.slice(newMax);
    for (const slot of toEvict) {
      if (slot.source === TankSlotSource.Core) {
        addCore(slot.coreId);
      } else if (slot.source === TankSlotSource.Reborn) {
        setParty((prev) => ({
          ...prev,
          zoids: [...prev.zoids, slot.ownedZoid],
        }));
      }
    }
    setTankSlots((prev) => prev.slice(0, newMax));
  }
}

export { addFragments, completeSlot, getAvailableSlotCount, getAvailableTransportZoids, getTransportBonus, isCoreNurtured, isSpeciesInTank, loadTankSlots, loadTransportZoidId, placeCore, placeReborn, placeStatue, removeStatueSlot, selectTransportZoid, tankSlots, transportZoidId };
