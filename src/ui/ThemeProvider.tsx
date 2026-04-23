import { createEffect, type ParentComponent } from 'solid-js';
import { Faction, FACTION_THEMES } from '../models/Faction';
import { playerStats } from '../store/gameStore';

const ThemeProvider: ParentComponent = (props) => {
  createEffect(() => {
    const faction = playerStats()?.faction ?? Faction.Neutral;
    const theme = FACTION_THEMES[faction];
    const style = document.documentElement.style;
    style.setProperty('--theme-accent', theme.accent);
    style.setProperty('--theme-accent-hover', theme.accentHover);
    style.setProperty('--theme-accent-rgb', theme.accentRgb);
    style.setProperty('--theme-accent-subtle', theme.accentSubtle);
    style.setProperty('--theme-border', theme.border);
    style.setProperty('--theme-button-bg', theme.buttonBg);
    style.setProperty('--theme-button-hover', theme.buttonHover);
    style.setProperty('--theme-deep-bg', theme.deepBg);
    style.setProperty('--theme-panel-bg', theme.panelBg);
    style.setProperty('--theme-panel-bg-rgb', theme.panelBgRgb);
    style.setProperty('--theme-surface-bg', theme.surfaceBg);
    style.setProperty('--theme-tooltip-bg', theme.tooltipBg);
  });

  return props.children;
};

export default ThemeProvider;
