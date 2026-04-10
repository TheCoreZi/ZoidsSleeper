import { describe, expect, it } from 'vitest';
import { migrate } from '../src/game/migrations';

describe('migrate', () => {
  it('should return data unchanged when no migrations apply', () => {
    const data = { landmarkId: 'test', version: '0.1.0' };

    const result = migrate(data, '0.1.0');

    expect(result).toEqual({ landmarkId: 'test', version: '0.1.0' });
  });

  it('should skip migrations older than saved version', () => {
    const data = { landmarkId: 'test', version: '1.0.0' };

    const result = migrate(data, '1.0.0');

    expect(result).toEqual({ landmarkId: 'test', version: '1.0.0' });
  });
});
