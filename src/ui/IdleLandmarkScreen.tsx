import type { Component } from 'solid-js';
import { currentLandmark, landmarkBackground } from '../store/landmarkStore';

const IdleLandmarkScreen: Component = () => {
  return (
    <div class="battle-screen">
      <div class="enemy-section">
        <h2 class="enemy-name">{currentLandmark().name}</h2>
        <div
          class="battle-area"
          style={{ 'background-image': `url('${landmarkBackground()}')`, 'background-size': 'cover' }}
        />
      </div>
    </div>
  );
};

export default IdleLandmarkScreen;
