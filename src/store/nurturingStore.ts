import { createSignal } from 'solid-js';
import { REBORN_ATTACK_BONUS_PERCENT } from '../constants';
import { t } from '../i18n';
import { levelFromExperience } from '../models/LevelType';
import { PopupMessage, PopupType } from '../models/PopupMessage';
import type { OwnedZoid } from '../models/Zoid';
import { getZoidById, getZoidImage, ZOID_LIST } from '../models/Zoid';
import { playerStats, showPopup } from './gameStore';
import { addZoidToArmy, party, setParty } from './partyStore';
import type { TankSlot } from './TankSlot';
import { TankSlotSource } from './TankSlot';
import { removeCore } from './zoidCoreStore';

const [tankSlots, setTankSlots] = createSignal<TankSlot[]>([]);

function addFragments(amount: number): void {
  setTankSlots((prev) => {
    const hasChange = prev.some((s) => s.fragments < s.fragmentsRequired);
    if (!hasChange) {return prev;}
    return prev.map((slot) =>
      slot.fragments >= slot.fragmentsRequired
        ? slot
        : { ...slot, fragments: Math.min(slot.fragments + amount, slot.fragmentsRequired) }
    );
  });
}

function completeSlot(index: number): void {
  const slots = tankSlots();
  const slot = slots[index];
  if (!slot || slot.fragments < slot.fragmentsRequired) {return;}

  if (slot.source === TankSlotSource.Core) {
    addZoidToArmy(slot.zoidSpeciesId);
  } else {
    const reborn: OwnedZoid = {
      ...slot.ownedZoid,
      rebornBonusPercent: (slot.ownedZoid.rebornBonusPercent ?? 0) + REBORN_ATTACK_BONUS_PERCENT,
      experience: 0,
    };
    setParty((prev) => ({
      ...prev,
      zoids: [...prev.zoids, reborn],
    }));
  }

  const name = ZOID_LIST[slot.zoidSpeciesId]?.name ?? slot.zoidSpeciesId;
  showPopup(new PopupMessage(name, t('ui:nurturing_zoid_hatched', { name }), PopupType.Item, getZoidImage(slot.zoidSpeciesId)));
  setTankSlots((prev) => prev.filter((_, i) => i !== index));
}

function getAvailableSlotCount(): number {
  const stats = playerStats();
  return (stats?.nurturingSlots ?? 1) - tankSlots().length;
}

function isSpeciesInTank(zoidSpeciesId: string): boolean {
  return tankSlots().some((slot) => slot.zoidSpeciesId === zoidSpeciesId);
}

function loadTankSlots(data?: TankSlot[]): void {
  setTankSlots(data ?? []);
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

export { addFragments, completeSlot, getAvailableSlotCount, isSpeciesInTank, loadTankSlots, placeCore, placeReborn, tankSlots };
