import { beforeEach, describe, expect, it } from 'vitest';
import { ZoidResearchStatus } from '../src/models/Zoid';
import {
  getZoidResearch,
  loadZoidResearch,
  updateZoidResearch,
} from '../src/store/zoidResearchStore';

describe('ZoidResearchStore', () => {
  beforeEach(() => {
    loadZoidResearch({});
  });

  it('should return null for an unregistered zoid', () => {
    expect(getZoidResearch('unknown_zoid')).toBeNull();
  });

  it('should set a zoid as seen', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Seen);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Seen);
  });

  it('should promote from seen to scanned', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Seen);

    updateZoidResearch('molga', ZoidResearchStatus.Scanned);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Scanned);
  });

  it('should promote from scanned to created', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Scanned);

    updateZoidResearch('molga', ZoidResearchStatus.Created);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Created);
  });

  it('should not degrade from created to seen', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Created);

    updateZoidResearch('molga', ZoidResearchStatus.Seen);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Created);
  });

  it('should not degrade from created to scanned', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Created);

    updateZoidResearch('molga', ZoidResearchStatus.Scanned);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Created);
  });

  it('should not degrade from scanned to seen', () => {
    updateZoidResearch('molga', ZoidResearchStatus.Scanned);

    updateZoidResearch('molga', ZoidResearchStatus.Seen);

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Scanned);
  });

  it('should load research data', () => {
    loadZoidResearch({
      gator: ZoidResearchStatus.Created,
      molga: ZoidResearchStatus.Scanned,
    });

    expect(getZoidResearch('molga')).toBe(ZoidResearchStatus.Scanned);
    expect(getZoidResearch('gator')).toBe(ZoidResearchStatus.Created);
  });
});
