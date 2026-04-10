import { createSignal, For, type Component } from 'solid-js';
import { CAMPAIGNS } from '../campaign/campaigns';
import { forceSetMission } from '../store/campaignStore';

const DevCampaignTools: Component = () => {
  const campaignIds = Object.keys(CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = createSignal(campaignIds[0] ?? '');
  const [selectedMission, setSelectedMission] = createSignal(CAMPAIGNS[campaignIds[0]]?.missions[0]?.id ?? '');

  const missions = () => CAMPAIGNS[selectedCampaign()]?.missions ?? [];

  const onCampaignChange = (id: string) => {
    setSelectedCampaign(id);
    setSelectedMission(CAMPAIGNS[id]?.missions[0]?.id ?? '');
  };

  return (
    <div class="dev-campaign-tools">
      <label>Campaign</label>
      <select onChange={(e) => onCampaignChange(e.target.value)}>
        <For each={campaignIds}>
          {(id) => <option value={id}>{id}</option>}
        </For>
      </select>
      <label>Mission</label>
      <select value={selectedMission()} onChange={(e) => setSelectedMission(e.target.value)}>
        <For each={missions()}>
          {(m) => <option value={m.id}>{m.id}</option>}
        </For>
      </select>
      <button class="dev-campaign-tools-btn" onClick={() => forceSetMission(selectedCampaign(), selectedMission())}>Force Set</button>
    </div>
  );
};

export default DevCampaignTools;
