import { createMemo, For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { ITEMS, SyncDeviceItem } from '../item';
import { getItemCount, inventory } from '../store/inventoryStore';
import { activeScan, scanNewOnly, ScanMode, toggleScan, toggleScanNewOnly } from '../store/scanStore';

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
      <div class="scan-panel">
        <div class="scan-panel-devices">
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
        <div class="scan-panel-divider" />
        <label class="scan-new-only-label" classList={{ checked: scanNewOnly() }}>
          <input
            type="checkbox"
            checked={scanNewOnly()}
            onChange={toggleScanNewOnly}
          />
          <span class="scan-checkbox" />
          {t('ui:scan_new_only')}
        </label>
      </div>
    </Show>
  );
};

export default ScanToggle;
