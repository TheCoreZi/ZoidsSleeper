import { describe, expect, it, beforeEach } from 'vitest';
import { addCore, addTypedCore, getCoreCount, loadZoidCores, removeCore, zoidCores } from './zoidCoreStore';

beforeEach(() => {
  loadZoidCores({});
});

describe('addCore', () => {
  it('adds a core with count 1', () => {
    addCore('molga');
    expect(getCoreCount('molga')).toBe(1);
  });

  it('increments count for duplicate cores', () => {
    addCore('molga');
    addCore('molga');
    expect(getCoreCount('molga')).toBe(2);
  });
});

describe('addTypedCore', () => {
  it('adds a typed core by type key', () => {
    addTypedCore('mini_core');
    expect(getCoreCount('mini_core')).toBe(1);
  });
});

describe('removeCore', () => {
  it('decrements count', () => {
    addCore('molga');
    addCore('molga');
    removeCore('molga');
    expect(getCoreCount('molga')).toBe(1);
  });

  it('removes entry when count reaches 0', () => {
    addCore('molga');
    removeCore('molga');
    expect(getCoreCount('molga')).toBe(0);
    expect(zoidCores()).not.toHaveProperty('molga');
  });

  it('does nothing for unknown core', () => {
    removeCore('nonexistent');
    expect(getCoreCount('nonexistent')).toBe(0);
  });
});

describe('loadZoidCores', () => {
  it('restores state from saved data', () => {
    loadZoidCores({ aquadon: 2, molga: 1 });
    expect(getCoreCount('aquadon')).toBe(2);
    expect(getCoreCount('molga')).toBe(1);
  });
});
