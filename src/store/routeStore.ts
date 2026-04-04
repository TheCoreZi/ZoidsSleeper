import { createMemo, createSignal } from 'solid-js';
import type { BackgroundType, Route } from '../models/Route';
import { ROUTES } from '../models/Route';

const [currentRoute, setCurrentRoute] = createSignal<Route>(ROUTES[0]);

const battleBackground = createMemo<BackgroundType>(() => currentRoute().background);

export { battleBackground, currentRoute, setCurrentRoute };
