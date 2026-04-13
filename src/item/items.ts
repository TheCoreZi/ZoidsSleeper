import { ImportantItem } from './ImportantItem';
import type { ItemDefinition } from './Item';
import { SyncDeviceItem } from './SyncDeviceItem';

export const ITEMS: Record<string, ItemDefinition> = {
  ancient_statue: new ImportantItem('ancient_statue'),
  core_analyzer: new ImportantItem('core_analyzer'),
  core_probe: new SyncDeviceItem('core_probe', 1000, 0),
  sleeper_module: new ImportantItem('sleeper_module'),
};
