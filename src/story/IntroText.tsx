import { For, type Component } from 'solid-js';
import { t } from '../i18n';
import { PLANET_INTRO_KEYS } from './introScript';

interface IntroTextProps {
  onComplete: () => void;
}

const IntroText: Component<IntroTextProps> = (props) => (
  <div class="intro-text" onClick={() => props.onComplete()}>
    <img class="intro-image" src="images/towns/Zi.jpg" alt="Planet Zi" />
    <For each={PLANET_INTRO_KEYS}>{(key) => <p>{t(key)}</p>}</For>
    <div class="intro-continue">{t('ui:click_to_continue')}</div>
  </div>
);

export default IntroText;
