import { describe, expect, it } from 'vitest';
import { createZoid, resolveZoid } from '../src/models/Zoid';

describe('Zoid', () => {
  it('should create a zoid instance with full health', () => {
    const stats = resolveZoid({ id: 'command_wolf', level: 1 });
    const zoid = createZoid(stats);

    expect(zoid.health).toBe(zoid.maxHealth);
    expect(zoid.name).toBe('Command Wolf');
  });

  it('should create independent instances from the same stats', () => {
    const stats = resolveZoid({ id: 'molga', level: 20 });
    const a = createZoid(stats);
    const b = createZoid(stats);

    a.health = 0;

    expect(b.health).toBe(stats.maxHealth);
  });
});
