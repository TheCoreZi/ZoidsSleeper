import { describe, expect, it } from 'vitest';
import { isValidPlayerName, normalizePlayerName } from './Player';

describe('player name', () => {
  it('trims surrounding spaces', () => {
    expect(normalizePlayerName('  Zoidbert  ')).toBe('Zoidbert');
  });

  it.each(['', '   ', 'a'.repeat(21)])('rejects invalid name %j', (name) => {
    expect(isValidPlayerName(name)).toBe(false);
  });

  it.each(['A', 'a'.repeat(20), 'ゾイド'])('accepts valid name %j', (name) => {
    expect(isValidPlayerName(name)).toBe(true);
  });
});
