import type { OwnedZoid } from './Zoid';

export interface ArmyFilter {
  apply(zoids: OwnedZoid[], commanderZoidId: string): OwnedZoid[];
}

export class CommanderOnlyFilter implements ArmyFilter {
  apply(zoids: OwnedZoid[], commanderZoidId: string): OwnedZoid[] {
    return zoids.filter((z) => z.id === commanderZoidId);
  }
}
