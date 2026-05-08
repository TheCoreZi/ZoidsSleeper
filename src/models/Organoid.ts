export class Organoid {
  multiplier: number;
  nameKey: string;

  constructor(multiplier: number, nameKey: string) {
    this.multiplier = multiplier;
    this.nameKey = nameKey;
  }
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const CRY_REPEAT_MIN = 4;
const CRY_REPEAT_MAX = 8;

export function formatOrganoidCry(name: string): string {
  const upper = name.toUpperCase();
  const vowelIndices = [...upper].reduce<number[]>((acc, ch, i) => {
    if (VOWELS.has(ch)) { acc.push(i); }
    return acc;
  }, []);
  if (vowelIndices.length === 0) { return upper; }
  const targetIndex = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
  const repeat = CRY_REPEAT_MIN + Math.floor(Math.random() * (CRY_REPEAT_MAX - CRY_REPEAT_MIN + 1));
  return upper.slice(0, targetIndex) + upper[targetIndex].repeat(repeat) + upper.slice(targetIndex + 1);
}

export const ORGANOIDS = {
  zeke_shield_liger: new Organoid(2, 'organoids:zeke'),
  shadow: new Organoid(10, 'organoids:shadow'),
} as const;
