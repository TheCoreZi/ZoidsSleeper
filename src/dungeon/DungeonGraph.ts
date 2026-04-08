export const SortieNodeType = {
  Boss: 'boss',
  Combat: 'combat',
  Elite: 'elite',
  Event: 'event',
  Supply: 'supply',
} as const;
export type SortieNodeType = (typeof SortieNodeType)[keyof typeof SortieNodeType];

export interface SortieLayer {
  depth: number;
  nodes: SortieNode[];
}

export interface SortieNode {
  connectsTo: string[];
  eventSeed: number;
  id: string;
  type: SortieNodeType;
}
