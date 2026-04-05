import { For, Show, type Component } from 'solid-js';
import { getCity } from '../models/City';
import type { Landmark } from '../models/Landmark';
import { isLandmarkUnlocked } from '../models/Requirement';
import {
  citiesForRegion,
  currentLandmark,
  currentRegion,
  routesForRegion,
} from '../store/landmarkStore';
import { mapOpen, toggleMap } from './MapStore';
import './WorldMap.css';

interface WorldMapProps {
  onLocationChange: (landmark: Landmark) => void;
}

const WorldMap: Component<WorldMapProps> = (props) => {
  function cityPosition(cityId: string) {
    const city = getCity(cityId);
    if (!city) {
      return { x: 0, y: 0 };
    }
    return {
      x: (city.mapPosition.x / 100) * currentRegion().imageSize.w,
      y: (city.mapPosition.y / 100) * currentRegion().imageSize.h,
    };
  }

  function handleLandmarkClick(landmark: Landmark) {
    props.onLocationChange(landmark);
  }

  return (
    <div class={`world-map ${mapOpen() ? 'world-map--open' : ''}`}>
      <h2 class="world-map-title" onClick={() => toggleMap()}>
        {currentRegion().name}
        <span class="world-map-toggle">{mapOpen() ? '▲' : '▼'}</span>
      </h2>
      <Show when={mapOpen()}>
        <p class="world-map-subtitle">{currentRegion().subtitle}</p>
        <svg
          viewBox={`${currentRegion().viewBox.x} ${currentRegion().viewBox.y} ${currentRegion().viewBox.w} ${currentRegion().viewBox.h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <image
            href={currentRegion().image}
            width={currentRegion().imageSize.w}
            height={currentRegion().imageSize.h}
          />
          {(() => {
            const scale = currentRegion().viewBox.w / currentRegion().imageSize.w;
            const cityRadius = 15 * scale;
            const fontSize = 28 * scale;
            const strokeWidth = 3 * scale;
            const routeStrokeWidth = 15 * scale;

            return (
              <>
                <For each={routesForRegion(currentRegion())}>
                  {(route) => {
                    const from = () => cityPosition(route.connects[0]);
                    const to = () => cityPosition(route.connects[1]);
                    const isCurrent = () => currentLandmark().id === route.id;
                    const locked = () => !isLandmarkUnlocked(route);

                    return (
                      <g
                        class={`map-route ${isCurrent() ? 'map-route--current' : ''} ${locked() ? 'map-route--locked' : ''}`}
                        onClick={() => handleLandmarkClick(route)}
                      >
                        <line
                          x1={from().x}
                          y1={from().y}
                          x2={to().x}
                          y2={to().y}
                          stroke={locked() ? '#444' : isCurrent() ? '#00d4ff' : '#ff0000'}
                          stroke-width={routeStrokeWidth}
                          stroke-linecap="round"
                        />
                      </g>
                    );
                  }}
                </For>
                <For each={citiesForRegion(currentRegion())}>
                  {(city) => {
                    const cx = () => (city.mapPosition.x / 100) * currentRegion().imageSize.w;
                    const cy = () => (city.mapPosition.y / 100) * currentRegion().imageSize.h;
                    const isCurrent = () => currentLandmark().id === city.id;
                    const locked = () => !isLandmarkUnlocked(city);

                    return (
                      <g
                        class={`map-node ${isCurrent() ? 'map-node--current' : ''} ${locked() ? 'map-node--locked' : ''}`}
                        onClick={() => handleLandmarkClick(city)}
                      >
                        <circle
                          cx={cx()}
                          cy={cy()}
                          r={cityRadius}
                          fill={locked() ? '#444' : isCurrent() ? '#ffc107' : '#8b6914'}
                          stroke={locked() ? '#666' : isCurrent() ? '#fff' : '#ffc107'}
                          stroke-width={strokeWidth}
                        />
                        <text
                          class="map-node-label"
                          x={cx()}
                          y={cy() - cityRadius - 5 * scale}
                          font-size={`${fontSize}`}
                        >
                          {city.name.split(' ').map((w) => w[0]).join('')}
                        </text>
                      </g>
                    );
                  }}
                </For>
              </>
            );
          })()}
        </svg>
      </Show>
    </div>
  );
};

export default WorldMap;
