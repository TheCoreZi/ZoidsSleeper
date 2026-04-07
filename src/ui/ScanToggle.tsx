import { createMemo, For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { ITEMS, SyncDeviceItem } from '../item';
import { getItemCount, inventory } from '../store/inventoryStore';
import { activeScan, ScanMode, toggleScan } from '../store/scanStore';

const ScanToggle: Component = () => {
  const ownedDevices = createMemo(() => {
    const inv = inventory();
    return Object.keys(inv)
      .filter((id) => inv[id] > 0 && ITEMS[id] instanceof SyncDeviceItem)
      .sort();
  });

  const modeFor = (deviceId: string) => {
    const current = activeScan();
    if (!current || current.deviceId !== deviceId) {return ScanMode.Off;}
    return current.mode;
  };

  return (
    <Show when={ownedDevices().length > 0}>
      <div class="scan-toggle-panel">
        <For each={ownedDevices()}>
          {(deviceId) => (
            <button
              class="scan-toggle-btn"
              classList={{
                'scan-permanent': modeFor(deviceId) === ScanMode.Permanent,
                'scan-single': modeFor(deviceId) === ScanMode.Single,
              }}
              onClick={() => toggleScan(deviceId)}
              title={t(`items:${deviceId}.name`)}
            >
              <img src={`images/items/${deviceId}.png`} alt={t(`items:${deviceId}.name`)} />
              <span class="scan-toggle-count">x{getItemCount(deviceId)}</span>
            </button>
          )}
        </For>
      </div>
    </Show>
  );
};

export default ScanToggle;
