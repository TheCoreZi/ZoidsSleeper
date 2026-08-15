import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import App from './App';
import { Save } from './game/Save';
import { ALL_FACTIONS, Faction, FACTIONS } from './models/Faction';
import { getZoidImage, ZOID_LIST } from './models/Zoid';
import { playerStats } from './store/gameStore';
import HomeScreen from './ui/HomeScreen';
import ThemeProvider from './ui/ThemeProvider';

const PATTERN_ZOID_IDS = [
  'cannon_tortoise',
  'command_wolf',
  'gordos',
  'iron_kong',
  'pteras',
  'red_horn',
  'saber_tiger',
  'shield_liger',
] as const satisfies readonly (keyof typeof ZOID_LIST)[];
const PATTERN_ZOID_COUNT = 180;

interface PatternZoidPlacement {
  left: number;
  opacity: number;
  rotation: number;
  size: number;
  top: number;
}

const GameRoot: Component = () => {
  const [gameStarted, setGameStarted] = createSignal(false);
  const patternImage = getRandomPatternImage();
  const patternPlacements = createPatternPlacements();
  const savedGame = new Save().load();
  const backgroundFaction = createMemo(() => getValidFaction(
    playerStats()?.faction ?? savedGame?.playerStats?.faction
  ));

  const startNewGame = (): void => {
    Save.clear();
    setGameStarted(true);
  };

  return (
    <ThemeProvider faction={backgroundFaction()}>
      <div
        class="game-root"
        style={{ '--game-faction-color': FACTIONS[backgroundFaction()].color }}
      >
        <div aria-hidden="true" class="game-pattern">
          <For each={patternPlacements}>
            {(placement) => (
              <img
                alt=""
                class="game-pattern-zoid"
                src={patternImage}
                style={{
                  left: `${placement.left}%`,
                  opacity: placement.opacity,
                  top: `${placement.top}%`,
                  transform: `rotate(${placement.rotation}deg)`,
                  width: `${placement.size}px`,
                }}
              />
            )}
          </For>
        </div>
        <Show
          when={gameStarted()}
          fallback={(
            <HomeScreen
              save={savedGame}
              onContinue={() => setGameStarted(true)}
              onNewGame={startNewGame}
            />
          )}
        >
          <App />
        </Show>
      </div>
    </ThemeProvider>
  );
};

function getRandomPatternImage(): string {
  return getZoidImage(PATTERN_ZOID_IDS[Math.floor(Math.random() * PATTERN_ZOID_IDS.length)]);
}

function createPatternPlacements(): PatternZoidPlacement[] {
  return Array.from({ length: PATTERN_ZOID_COUNT }, () => ({
    left: randomBetween(0, 100),
    opacity: randomBetween(0.07, 0.13),
    rotation: randomBetween(-25, 25),
    size: randomBetween(28, 42),
    top: randomBetween(0, 100),
  }));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getValidFaction(faction?: Faction): Faction {
  return ALL_FACTIONS.includes(faction as Faction) ? faction as Faction : Faction.Neutral;
}

export default GameRoot;
