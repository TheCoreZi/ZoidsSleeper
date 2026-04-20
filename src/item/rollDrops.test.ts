import { describe, expect, it } from 'vitest';

import { addItem } from '../store/inventoryStore';
import { ItemDrop } from './ItemDrop';
import { rollDrops, buildDropPool } from './rollDrops';
import { ZiDataDrop } from './ZiDataDrop';

describe('rollDrops', () => {
  it('returns null when drops array is empty', () => {
    expect(rollDrops([])).toBeNull();
  });

  it('returns drop when rng is below chance', () => {
    const drop = new ZiDataDrop('molga', 50);
    const result = rollDrops([drop], () => 0.1);
    expect(result).toBe(drop);
  });

  it('returns null when rng is above chance', () => {
    const drop = new ZiDataDrop('molga', 50);
    const result = rollDrops([drop], () => 0.9);
    expect(result).toBeNull();
  });

  it('respects priority order - first pool wins', () => {
    const highPriority = new ZiDataDrop('guysack', 100);
    const lowPriority = new ZiDataDrop('molga', 100);
    const drops = buildDropPool([highPriority], [lowPriority]);
    const result = rollDrops(drops, () => 0);
    expect(result).toBe(highPriority);
  });

  it('falls through to lower priority when higher fails', () => {
    const highPriority = new ZiDataDrop('guysack', 10);
    const lowPriority = new ZiDataDrop('molga', 100);
    const drops = buildDropPool([highPriority], [lowPriority]);
    const result = rollDrops(drops, () => 0.5);
    expect(result).toBe(lowPriority);
  });

  it('skips unique ItemDrop when already owned', () => {
    addItem('ancient_statue', 1);
    const drop = new ItemDrop('ancient_statue', 100, 1, true);
    const result = rollDrops([drop], () => 0);
    expect(result).toBeNull();
  });

  it('allows non-unique ItemDrop when already owned', () => {
    addItem('core_preserver', 1);
    const drop = new ItemDrop('core_preserver', 100);
    const result = rollDrops([drop], () => 0);
    expect(result).toBe(drop);
  });

  it('handles undefined pools in buildDropPool', () => {
    const drop = new ZiDataDrop('molga', 100);
    const drops = buildDropPool(undefined, [drop], undefined);
    const result = rollDrops(drops, () => 0);
    expect(result).toBe(drop);
  });
});
