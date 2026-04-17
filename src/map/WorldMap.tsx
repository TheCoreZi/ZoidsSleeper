import { For, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import type { Landmark, Route } from '../landmark';
import { LandmarkType, getCity, getDungeon, isLandmarkUnlocked } from '../landmark';
import {
  citiesForRegion,
  currentLandmark,
  currentRegion,
  dungeonsForRegion,
  routesForRegion,
} from '../store/landmarkStore';
import { mapOpen, toggleMap } from './MapStore';
import './WorldMap.css';

interface WorldMapProps {
  onLocationChange: (landmark: Landmark) => void;
}

const WorldMap: Component<WorldMapProps> = (props) => {
  function cityPosition(cityId: string) {
    const city = getCity(cityId) ?? getDungeon(cityId);
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
        {t(`locations:${currentRegion().id}`)}
        <span class="world-map-toggle">{mapOpen() ? '▲' : '▼'}</span>
      </h2>
      <Show when={mapOpen()}>
        <p class="world-map-subtitle">{t(`locations:${currentRegion().id}_subtitle`)}</p>
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
            const routeStrokeWidth = 15 * scale;
            const spriteSize = currentRegion().viewBox.w * 0.06;
            const strokeWidth = 3 * scale;

            const playerPos = () => {
              const landmark = currentLandmark();
              if (landmark.type === LandmarkType.Route) {
                const route = landmark as Route;
                const from = cityPosition(route.connects[0]);
                const to = cityPosition(route.connects[1]);
                return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
              }
              return cityPosition(landmark.id);
            };

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
                          stroke={locked() ? '#444' : isCurrent() ? '#00d4ff' : '#ffc107'}
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
                          fill={locked() ? '#444' : isCurrent() ? '#3b82f6' : '#f97316'}
                          stroke={locked() ? '#666' : isCurrent() ? '#fff' : '#fff'}
                          stroke-width={strokeWidth}
                        />
                        <text
                          class="map-node-label"
                          x={cx()}
                          y={cy() - cityRadius - 5 * scale}
                          font-size={`${fontSize}`}
                        >
                          {t(`locations:${city.id}`).split(' ').map((w) => w[0]).join('')}
                        </text>
                      </g>
                    );
                  }}
                </For>
                <For each={dungeonsForRegion(currentRegion())}>
                  {(dungeon) => {
                    const cx = () => (dungeon.mapPosition.x / 100) * currentRegion().imageSize.w;
                    const cy = () => (dungeon.mapPosition.y / 100) * currentRegion().imageSize.h;
                    const isCurrent = () => currentLandmark().id === dungeon.id;
                    const locked = () => !isLandmarkUnlocked(dungeon);

                    return (
                      <g
                        class={`map-node ${isCurrent() ? 'map-node--current' : ''} ${locked() ? 'map-node--locked' : ''}`}
                        onClick={() => handleLandmarkClick(dungeon)}
                      >
                        <polygon
                          points={`${cx()},${cy() - cityRadius} ${cx() - cityRadius},${cy() + cityRadius} ${cx() + cityRadius},${cy() + cityRadius}`}
                          fill={locked() ? '#444' : isCurrent() ? '#3b82f6' : '#f97316'}
                          stroke={locked() ? '#666' : isCurrent() ? '#fff' : '#fff'}
                          stroke-width={strokeWidth}
                          stroke-linejoin="round"
                        />
                        <text
                          class="map-node-label"
                          x={cx()}
                          y={cy() - cityRadius - 5 * scale}
                          font-size={`${fontSize}`}
                        >
                          {t(`locations:${dungeon.id}`).split(' ').map((w) => w[0]).join('')}
                        </text>
                      </g>
                    );
                  }}
                </For>
                <image
                  class="map-player-sprite"
                  href="images/characters/player_full.png"
                  x={playerPos().x - spriteSize / 2}
                  y={playerPos().y - spriteSize}
                  width={spriteSize}
                  height={spriteSize}
                />
              </>
            );
          })()}
        </svg>
      </Show>
    </div>
  );
};

export default WorldMap;
