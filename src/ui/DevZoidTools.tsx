import type { Component } from 'solid-js';
import { awardExperience } from '../models/Experience';
import { setParty } from '../store/partyStore';

const DEV_EXPERIENCE_REWARD = 1_000_000;

function giveAllZoidsExperience(): void {
  setParty((prev) => ({ ...prev, zoids: awardExperience(prev.zoids, DEV_EXPERIENCE_REWARD) }));
}

const DevZoidTools: Component = () => {
  return (
    <div class="dev-campaign-tools">
      <label>Zoids</label>
      <button class="dev-campaign-tools-btn" onClick={giveAllZoidsExperience}>
        Give All Zoids 1,000,000 EXP
      </button>
    </div>
  );
};

export default DevZoidTools;
