export abstract class ZoidDisplayStat {
  abstract compare(other: ZoidDisplayStat): number;
  abstract display(): string;
}

export class DateStat extends ZoidDisplayStat {
  epoch: number;

  constructor(epoch: number) {
    super();
    this.epoch = epoch;
  }

  compare(other: ZoidDisplayStat): number {
    return this.epoch - (other as DateStat).epoch;
  }

  display(): string {
    return this.epoch > 0 ? new Date(this.epoch).toLocaleDateString() : '—';
  }
}

export class NameStat extends ZoidDisplayStat {
  attack: number;
  hp: number;
  name: string;

  constructor(name: string, attack: number, hp: number) {
    super();
    this.attack = attack;
    this.hp = hp;
    this.name = name;
  }

  compare(other: ZoidDisplayStat): number {
    return (other as NameStat).name.localeCompare(this.name);
  }

  display(): string {
    return `ATK: ${this.attack.toLocaleString()} / HP: ${this.hp.toLocaleString()}`;
  }
}

export class NumericStat extends ZoidDisplayStat {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  compare(other: ZoidDisplayStat): number {
    return this.value - (other as NumericStat).value;
  }

  display(): string {
    return this.value.toLocaleString();
  }
}
