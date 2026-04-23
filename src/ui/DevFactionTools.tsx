import { For, type Component } from 'solid-js';
import { ALL_FACTIONS, FACTIONS } from '../models/Faction';
import { playerStats, setPlayerFaction } from '../store/gameStore';

const DevFactionTools: Component = () => {
  return (
    <div class="dev-campaign-tools">
      <label>Faction</label>
      <select
        value={playerStats()?.faction ?? ''}
        onChange={(e) => setPlayerFaction(e.target.value as typeof ALL_FACTIONS[number])}
      >
        <For each={ALL_FACTIONS}>
          {(f) => <option value={f}>{f}</option>}
        </For>
      </select>
      <div class="dev-faction-preview">
        <For each={ALL_FACTIONS}>
          {(f) => (
            <button
              class="dev-faction-swatch"
              style={{ background: FACTIONS[f].color, outline: playerStats()?.faction === f ? '2px solid #fff' : 'none' }}
              title={f}
              onClick={() => setPlayerFaction(f)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default DevFactionTools;
