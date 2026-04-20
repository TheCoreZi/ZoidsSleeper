export const ZoidResearchStatus = {
  Created: 'created',
  Scanned: 'scanned',
  Seen: 'seen',
} as const;

export type ZoidResearchStatus = (typeof ZoidResearchStatus)[keyof typeof ZoidResearchStatus];
