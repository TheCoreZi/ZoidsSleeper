import { createSignal, For, type Component } from 'solid-js';
import { PLANET_INTRO_TEXT } from './introScript';

interface IntroTextProps {
  onComplete: () => void;
}

const IntroText: Component<IntroTextProps> = (props) => {
  const [visibleCount, setVisibleCount] = createSignal(1);

  const handleClick = () => {
    if (visibleCount() < PLANET_INTRO_TEXT.length) {
      setVisibleCount((c) => c + 1);
    } else {
      props.onComplete();
    }
  };

  return (
    <div class="intro-text" onClick={handleClick}>
      <img class="intro-image" src="images/towns/Zi.jpg" alt="Planet Zi" />
      <For each={PLANET_INTRO_TEXT.slice(0, visibleCount())}>
        {(paragraph) => <p>{paragraph}</p>}
      </For>
      <div class="intro-continue">Click to continue...</div>
    </div>
  );
};

export default IntroText;
