import { createSignal } from 'solid-js';

const [mapOpen, setMapOpen] = createSignal(true);

export function toggleMap() {
  setMapOpen((v) => !v);
}

export { mapOpen };
