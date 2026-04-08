import { type Component, createEffect, createMemo, For } from 'solid-js';
import { t } from '../i18n';
import { getPilotImage } from '../models/Pilot';
import { playerStats } from '../store/gameStore';
import { landmarkBackground } from '../store/landmarkStore';
import { type SortieNode, SortieNodeType } from './DungeonGraph';
import { type DungeonRunState, dungeonRun } from './dungeonStore';
import './dungeon.css';

interface Props {
  onNodeSelect: (nodeId: string) => void;
  onRetreat: () => void;
}

const NODE_ICONS: Record<SortieNodeType, string> = {
  [SortieNodeType.Boss]: '\u{1F480}',
  [SortieNodeType.Combat]: '\u{1F4A5}',
  [SortieNodeType.Elite]: '\u{2B50}',
  [SortieNodeType.Event]: '\u{2753}',
  [SortieNodeType.Supply]: '\u{1F4E6}',
};

const DungeonMapScreen: Component<Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let svgRef: SVGSVGElement | undefined;

  const run = createMemo(() => dungeonRun());

  const visibleLayers = createMemo(() => {
    const r = run();
    if (!r) {return [];}
    return r.graph.slice(r.currentDepth);
  });

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
    if (state.nodeResults[node.id]) {return false;}
    if (state.currentDepth === 0) {return true;}
    const prevLayer = state.graph[state.currentDepth - 1];
    const lastCompleted = prevLayer.nodes.find((n) => state.nodeResults[n.id] === 'completed');
    return lastCompleted?.connectsTo.includes(node.id) ?? false;
  }

  function drawConnections(): void {
    if (!svgRef || !containerRef) {return;}
    const r = run();
    if (!r) {return;}

    while (svgRef.firstChild) {
      svgRef.removeChild(svgRef.firstChild);
    }

    const containerRect = containerRef.getBoundingClientRect();
    const layers = visibleLayers();

    for (let i = 0; i < layers.length - 1; i++) {
      for (const node of layers[i].nodes) {
        const fromEl = containerRef.querySelector(`[data-node-id="${node.id}"]`);
        if (!fromEl) {continue;}
        const fromRect = fromEl.getBoundingClientRect();

        for (const targetId of node.connectsTo) {
          const toEl = containerRef.querySelector(`[data-node-id="${targetId}"]`);
          if (!toEl) {continue;}
          const toRect = toEl.getBoundingClientRect();

          const isFirstLayer = i === 0;

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

  createEffect(() => {
    visibleLayers();
    requestAnimationFrame(() => requestAnimationFrame(drawConnections));
  });

  return (
    <div class="dungeon-map-screen">
      <h2 class="dungeon-title">{t(`locations:${run()?.config.id.replace('_sortie', '') ?? ''}`)}</h2>
      <p class="dungeon-subtitle">{t('ui:select_path')}</p>
      <div
        class="dungeon-graph-container"
        ref={containerRef}
        style={{ 'background-image': `url('${landmarkBackground()}')`, 'background-size': 'cover' }}
      >
        <svg class="dungeon-connections" ref={svgRef} />
        <div class="dungeon-layers">
          <For each={visibleLayers()}>
            {(layer) => (
              <div class="dungeon-layer">
                <For each={layer.nodes}>
                  {(node) => {
                    const r = run()!;
                    const isCompleted = () => r.nodeResults[node.id] === 'completed';
                    const isCurrent = () => layer.depth === r.currentDepth;
                    const selectable = () => isCurrent() && isNodeSelectable(node, r);
                    return (
                      <button
                        class={`dungeon-node dungeon-node-${node.type}${isCompleted() ? ' completed' : ''}${selectable() ? ' selectable' : ''}`}
                        data-node-id={node.id}
                        disabled={!selectable()}
                        onClick={() => props.onNodeSelect(node.id)}
                        title={node.type}
                      >
                        <span class="node-icon">{NODE_ICONS[node.type]}</span>
                      </button>
                    );
                  }}
                </For>
              </div>
            )}
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
    </div>
  );
};

export default DungeonMapScreen;
