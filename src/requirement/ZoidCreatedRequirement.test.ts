import { describe, expect, it } from 'vitest';
import { ZoidResearchStatus } from '../models/ZoidResearchStatus';
import { loadZoidResearch } from '../store/zoidResearchStore';
import { ZoidCreatedRequirement } from './ZoidCreatedRequirement';

describe('ZoidCreatedRequirement', () => {
  it('is not completed when zoid has not been researched', () => {
    loadZoidResearch({});
    const req = new ZoidCreatedRequirement('garius');
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is not completed when zoid is only scanned', () => {
    loadZoidResearch({ garius: ZoidResearchStatus.Scanned });
    const req = new ZoidCreatedRequirement('garius');
    expect(req.isCompleted()).toBe(false);
    expect(req.progress()).toBe(0);
  });

  it('is completed when zoid is created', () => {
    loadZoidResearch({ garius: ZoidResearchStatus.Created });
    const req = new ZoidCreatedRequirement('garius');
    expect(req.isCompleted()).toBe(true);
    expect(req.progress()).toBe(1);
  });
});
