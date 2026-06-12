import { type Accessor, type Component, For } from 'solid-js';
import { t } from '../i18n';
import { SORT_CYCLE, type SortDirection, SORT_ICON, type StatOption, statLabel } from './StatSort';

interface StatSortBarProps {
  onSortToggle: () => void;
  onStatChange: (stat: StatOption) => void;
  options: StatOption[];
  selectedStat: Accessor<StatOption>;
  sortDirection: Accessor<SortDirection>;
}

const StatSortBar: Component<StatSortBarProps> = (props) => (
  <div class="stat-sort-bar">
    <select
      class="stat-sort-select"
      value={props.selectedStat()}
      onChange={(e) => props.onStatChange(e.currentTarget.value as StatOption)}
    >
      <For each={props.options}>
        {(value) => <option value={value}>{statLabel(value)}</option>}
      </For>
    </select>
    <button
      class="stat-sort-btn"
      classList={{ 'stat-sort-btn-active': props.sortDirection() !== 'none' }}
      title={t('ui:sort')}
      onClick={() => props.onSortToggle()}
    >
      {SORT_ICON[props.sortDirection()]}
    </button>
  </div>
);

export { SORT_CYCLE };
export default StatSortBar;
