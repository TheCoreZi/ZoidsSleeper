import { t } from '../i18n';

export const StatOption = {
  Attack: 'attack',
  Attack100: 'attack_100',
  BaseAttack: 'base_attack',
  BaseHp: 'base_hp',
  CoreFragments: 'core_fragments',
  DateObtained: 'date_obtained',
  Experience: 'experience',
  Hp: 'hp',
  Hp100: 'hp_100',
  Name: 'name',
} as const;

export type StatOption = typeof StatOption[keyof typeof StatOption];

export const SORT_CYCLE = ['none', 'desc', 'asc'] as const;
export type SortDirection = typeof SORT_CYCLE[number];

export const SORT_ICON: Record<SortDirection, string> = { asc: '▲', desc: '▼', none: '⇅' };

export function statLabel(key: StatOption): string {
  return t(`ui:stat_${key}`);
}

const STAT_PREFIX_KEY: Partial<Record<StatOption, string>> = {
  [StatOption.Attack]: 'stat_prefix_atk',
  [StatOption.Attack100]: 'stat_prefix_atk',
  [StatOption.BaseAttack]: 'stat_prefix_atk',
  [StatOption.BaseHp]: 'stat_prefix_hp',
  [StatOption.CoreFragments]: 'stat_prefix_cf',
  [StatOption.DateObtained]: '',
  [StatOption.Experience]: 'stat_prefix_exp',
  [StatOption.Hp]: 'stat_prefix_hp',
  [StatOption.Hp100]: 'stat_prefix_hp',
};

export function formatStatLabel(stat: StatOption, displayValue: string): string | undefined {
  const key = STAT_PREFIX_KEY[stat];
  if (key === undefined) {return undefined;}
  if (!key) {return displayValue;}
  return `${t(`ui:${key}`)}: ${displayValue}`;
}
