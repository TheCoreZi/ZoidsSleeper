import { type Component, createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { t } from '../i18n';
import { getPilotImage } from '../models/Pilot';
import { playerStats } from '../store/gameStore';
import { landmarkBackground } from '../store/landmarkStore';
import { getZoidResearch } from '../store/zoidResearchStore';
import { ArchiveCard } from '../ui/ZiArchivePanel';
import '../ui/archive.css';
import { type SortieNode, SortieNodeType } from './DungeonGraph';
import { type DungeonRunState, dungeonRun, isLayerAdvancing, setIsLayerAdvancing } from './dungeonStore';
import './dungeon.css';

interface Props {
  onNodeSelect: (nodeId: string) => void;
  onRetreat: () => void;
}

const NODE_ICONS: Record<SortieNodeType, string> = {
  [SortieNodeType.Boss]: '\u{1F480}',
  [SortieNodeType.Combat]: '\u{1F4A5}',
  [SortieNodeType.Elite]: '\u{2B50}',
  [SortieNodeType.Entry]: '\u{1F6AA}',
  [SortieNodeType.Event]: '\u{2753}',
  [SortieNodeType.Supply]: '\u{1F4E6}',
};

const MIN_LAYER_WIDTH = 60;

const DungeonMapScreen: Component<Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let layersRef: HTMLDivElement | undefined;
  let markerRef: HTMLImageElement | undefined;
  let svgRef: SVGSVGElement | undefined;

  const run = createMemo(() => dungeonRun());

  const visibleLayers = createMemo(() => {
    const r = run();
    if (!r) {return [];}
    return r.graph.slice(Math.max(0, r.currentDepth - 1));
  });

  const lastCompletedNodeId = createMemo(() => {
    const r = run();
    if (!r) {return null;}
    const prevLayer = r.graph[r.currentDepth - 1];
    return prevLayer?.nodes.find((n) => r.nodeResults[n.id] === 'completed')?.id ?? null;
  });

  const [showInfo, setShowInfo] = createSignal(false);

  const enemies = createMemo(() => run()?.config.enemies ?? []);
  const eliteEnemies = createMemo(() => run()?.config.eliteEnemies ?? []);

  const possibleBosses = createMemo(() => {
    const r = run();
    return r ? r.config.getPossibleBosses() : [];
  });

  const attackPercent = createMemo(() => {
    return Math.round((playerStats()?.attackMult ?? 1) * 100);
  });

  const healthPercent = createMemo(() => {
    const r = run();
    return r ? Math.floor((r.playerHealth / r.playerMaxHealth) * 100) : 0;
  });

  function isNodeSelectable(node: SortieNode, state: DungeonRunState): boolean {
    if (isLayerAdvancing()) {return false;}
    if (state.nodeResults[node.id]) {return false;}
    if (state.currentDepth === 0) {return true;}
    const prevLayer = state.graph[state.currentDepth - 1];
    const lastCompleted = prevLayer.nodes.find((n) => state.nodeResults[n.id] === 'completed');
    return lastCompleted?.connectsTo.includes(node.id) ?? false;
  }

  function drawConnections(): void {
    if (!svgRef || !layersRef) {return;}
    const r = run();
    if (!r) {return;}

    while (svgRef.firstChild) {
      svgRef.removeChild(svgRef.firstChild);
    }

    const containerRect = layersRef.getBoundingClientRect();
    const layers = visibleLayers();

    for (let i = 0; i < layers.length - 1; i++) {
      for (const node of layers[i].nodes) {
        const fromEl = layersRef.querySelector(`[data-node-id="${node.id}"]`);
        if (!fromEl) {continue;}
        const fromRect = fromEl.getBoundingClientRect();

        for (const targetId of node.connectsTo) {
          const toEl = layersRef.querySelector(`[data-node-id="${targetId}"]`);
          if (!toEl) {continue;}
          const toRect = toEl.getBoundingClientRect();

          const isFirstLayer = layers[i].depth === r.currentDepth;

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', String(fromRect.left + fromRect.width / 2 - containerRect.left));
          line.setAttribute('y1', String(fromRect.top + fromRect.height / 2 - containerRect.top));
          line.setAttribute('x2', String(toRect.left + toRect.width / 2 - containerRect.left));
          line.setAttribute('y2', String(toRect.top + toRect.height / 2 - containerRect.top));
          line.setAttribute('class', isFirstLayer ? 'connection-active' : 'connection-inactive');
          svgRef.appendChild(line);
        }
      }
    }
  }

  function positionMarkerOn(nodeId: string, animate: boolean): void {
    if (!markerRef || !layersRef) {return;}
    const nodeEl = layersRef.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeEl) {return;}

    const layersRect = layersRef.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();

    markerRef.style.transition = animate ? 'left 0.3s ease-out, top 0.3s ease-out' : 'none';
    markerRef.style.left = `${nodeRect.left + nodeRect.width / 2 - layersRect.left}px`;
    markerRef.style.top = `${nodeRect.top + nodeRect.height / 2 - layersRect.top}px`;
  }

  function handleNodeSelect(nodeId: string): void {
    const el = layersRef;
    if (!el || !markerRef) {
      props.onNodeSelect(nodeId);
      return;
    }

    setIsLayerAdvancing(true);

    positionMarkerOn(nodeId, true);

    const onMarkerEnd = (): void => {
      markerRef!.removeEventListener('transitionend', onMarkerEnd);

      const layerWidth = el.offsetWidth / visibleLayers().length;
      el.style.transition = 'transform 0.5s ease-out';
      el.style.transform = `translateX(-${layerWidth}px)`;

      const onSlideEnd = (): void => {
        el.removeEventListener('transitionend', onSlideEnd);
        setIsLayerAdvancing(false);
        props.onNodeSelect(nodeId);
      };
      el.addEventListener('transitionend', onSlideEnd, { once: true });
    };
    markerRef.addEventListener('transitionend', onMarkerEnd, { once: true });
  }

  let scrollOffset = 0;
  let touchStartX = 0;
  let startOffset = 0;

  function getMaxScroll(): number {
    if (!layersRef || !containerRef) {return 0;}
    const layerCount = visibleLayers().length;
    const minLayerWidth = MIN_LAYER_WIDTH;
    const neededWidth = layerCount * minLayerWidth;
    const containerWidth = containerRef.clientWidth;
    return Math.max(0, neededWidth - containerWidth);
  }

  function applyScroll(): void {
    if (!layersRef) {return;}
    layersRef.style.left = `${-scrollOffset}px`;
    layersRef.style.width = `calc(100% + ${scrollOffset}px)`;
  }

  function handleTouchStart(e: TouchEvent): void {
    touchStartX = e.touches[0].clientX;
    startOffset = scrollOffset;
  }

  function handleTouchMove(e: TouchEvent): void {
    const dx = touchStartX - e.touches[0].clientX;
    scrollOffset = Math.max(0, Math.min(getMaxScroll(), startOffset + dx));
    applyScroll();
    drawConnections();
  }

  createEffect(() => {
    visibleLayers();
    if (!isLayerAdvancing()) {
      const el = layersRef;
      if (el) {
        el.style.transform = '';
        el.style.transition = 'none';
      }
      scrollOffset = 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          applyScroll();
          drawConnections();
          const nodeId = lastCompletedNodeId();
          if (nodeId) {positionMarkerOn(nodeId, false);}
        });
      });
    }
  });

  return (
    <div class="dungeon-map-screen">
      <div class="dungeon-header">
        <div />
        <h2 class="dungeon-title">{t(`locations:${run()?.config.id.replace('_sortie', '') ?? ''}`)}</h2>
        <button class="archive-button" onClick={() => setShowInfo(true)}>i</button>
      </div>
      <p class="dungeon-subtitle">{t('ui:select_path')}</p>
      <div
        class="dungeon-graph-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ 'background-image': `url('${landmarkBackground()}')`, 'background-size': 'cover' }}
      >
        <div class="dungeon-layers" ref={layersRef}>
          <svg class="dungeon-connections" ref={svgRef} />
          <img
            class="player-marker"
            ref={markerRef}
            src="images/characters/player_full.png"
            alt="Player"
          />
          <For each={visibleLayers()}>
            {(layer) => {
              const r = run()!;
              const isCurrent = () => layer.depth === r.currentDepth;
              return (
                <div class="dungeon-layer" style={{ 'min-width': `${MIN_LAYER_WIDTH}px` }}>
                  <For each={layer.nodes}>
                    {(node) => {
                      const isCompleted = () => r.nodeResults[node.id] === 'completed';
                      const selectable = () => isCurrent() && isNodeSelectable(node, r);
                      return (
                        <button
                          class={`dungeon-node dungeon-node-${node.type}${isCompleted() ? ' completed' : ''}${selectable() ? ' selectable' : ''}`}
                          data-node-id={node.id}
                          disabled={!selectable()}
                          onClick={() => handleNodeSelect(node.id)}
                          title={node.type}
                        >
                          <span class="node-icon">{NODE_ICONS[node.type]}</span>
                        </button>
                      );
                    }}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
        <div class="dungeon-boss-previews">
          <span class="dungeon-boss-title">{t('dungeon:possible_bosses')}</span>
          <div class="dungeon-boss-images">
            <For each={possibleBosses()}>
              {(pilotId) => (
                <img
                  class="dungeon-boss-preview"
                  src={getPilotImage(pilotId)}
                  alt={pilotId}
                />
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="dungeon-buffs">
        <span class={`dungeon-buff ${attackPercent() > 100 ? 'buff-positive' : attackPercent() < 100 ? 'buff-negative' : ''}`}>
          {t('dungeon:buff_attack', { value: attackPercent() })}
        </span>
      </div>
      <div class="dungeon-footer">
        <div class="dungeon-health-bar">
          <div class="dungeon-health-fill" style={{ width: `${healthPercent()}%` }} />
          <span class="dungeon-health-text">
            {run()?.playerHealth ?? 0} / {run()?.playerMaxHealth ?? 0}
          </span>
        </div>
        <button class="dungeon-retreat-btn" onClick={() => props.onRetreat()}>
          {t('dungeon:retreat')}
        </button>
      </div>
      <Show when={showInfo()}>
        <div class="archive-overlay" onClick={() => setShowInfo(false)}>
          <div class="archive-panel" onClick={(e) => e.stopPropagation()}>
            <div class="archive-header">
              <span class="archive-title">{t(`locations:${run()?.config.id.replace('_sortie', '') ?? ''}`)}</span>
              <button class="archive-close" onClick={() => setShowInfo(false)}>✕</button>
            </div>
            <div class="archive-grid">
              <span class="info-section-title">{t('ui:enemies')}</span>
              <For each={enemies()}>
                {(enemy) => <ArchiveCard id={enemy.zoidData.id} status={getZoidResearch(enemy.zoidData.id)} />}
              </For>
              <Show when={eliteEnemies().length > 0}>
                <span class="info-section-title">{t('ui:elite_enemies')}</span>
                <For each={eliteEnemies()}>
                  {(enemy) => <ArchiveCard id={enemy.zoidData.id} status={getZoidResearch(enemy.zoidData.id)} />}
                </For>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default DungeonMapScreen;
