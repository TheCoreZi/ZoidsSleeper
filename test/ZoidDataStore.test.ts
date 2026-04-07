import { beforeEach, describe, expect, it } from 'vitest';
import { decrementZoidData, getZoidDataCount, incrementZoidData, loadZoidData } from '../src/store/zoidDataStore';

describe('ZoidDataStore', () => {
  beforeEach(() => {
    loadZoidData({});
  });

  it('should start with 0 data for any zoid', () => {
    expect(getZoidDataCount('merda')).toBe(0);
  });

  it('should increment zoid data', () => {
    incrementZoidData('merda');

    expect(getZoidDataCount('merda')).toBe(1);
  });

  it('should accumulate zoid data', () => {
    incrementZoidData('merda');
    incrementZoidData('merda');

    expect(getZoidDataCount('merda')).toBe(2);
  });

  it('should decrement zoid data by 1', () => {
    loadZoidData({ merda: 3 });

    decrementZoidData('merda');

    expect(getZoidDataCount('merda')).toBe(2);
  });

  it('should remove entry when decrementing to 0', () => {
    loadZoidData({ merda: 1 });

    decrementZoidData('merda');

    expect(getZoidDataCount('merda')).toBe(0);
  });

  it('should do nothing when decrementing zoid with no data', () => {
    decrementZoidData('merda');

    expect(getZoidDataCount('merda')).toBe(0);
  });

  it('should load data from saved state', () => {
    loadZoidData({ merda: 5, molga: 2 });

    expect(getZoidDataCount('merda')).toBe(5);
    expect(getZoidDataCount('molga')).toBe(2);
  });
});
