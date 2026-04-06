import i18next from 'i18next';
import { createSignal } from 'solid-js';

import enCampaigns from './locales/en/campaigns.json';
import enDialog from './locales/en/dialog.json';
import enLocations from './locales/en/locations.json';
import enPilots from './locales/en/pilots.json';
import enRequirements from './locales/en/requirements.json';
import enUi from './locales/en/ui.json';
import enZoids from './locales/en/zoids.json';
import esCampaigns from './locales/es/campaigns.json';
import esDialog from './locales/es/dialog.json';
import esLocations from './locales/es/locations.json';
import esPilots from './locales/es/pilots.json';
import esRequirements from './locales/es/requirements.json';
import esUi from './locales/es/ui.json';
import esZoids from './locales/es/zoids.json';

const NAMESPACES = ['campaigns', 'dialog', 'locations', 'pilots', 'requirements', 'ui', 'zoids'] as const;

i18next.init({
  defaultNS: 'ui',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  lng: localStorage.getItem('locale') ?? 'en',
  ns: [...NAMESPACES],
  resources: {
    en: { campaigns: enCampaigns, dialog: enDialog, locations: enLocations, pilots: enPilots, requirements: enRequirements, ui: enUi, zoids: enZoids },
    es: { campaigns: esCampaigns, dialog: esDialog, locations: esLocations, pilots: esPilots, requirements: esRequirements, ui: esUi, zoids: esZoids },
  },
});

const [languageVersion, setLanguageVersion] = createSignal(0);

export function changeLocale(lng: string): void {
  i18next.changeLanguage(lng);
  localStorage.setItem('locale', lng);
  setLanguageVersion((v) => v + 1);
}

export function dialogLength(prefix: string): number {
  const arr = i18next.t(prefix, { returnObjects: true });
  return Array.isArray(arr) ? arr.length : 0;
}

export function currentLocale(): string {
  languageVersion();
  return i18next.language;
}

export function t(key: string, options?: Record<string, number | string>): string {
  languageVersion();
  return i18next.t(key, options);
}