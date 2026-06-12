import { type Component, createSignal, onCleanup } from 'solid-js';
import { EvolutionPopupImage } from '../models/PopupMessage';

const COCOON_HALF_MS = 1150;

const EvolutionPopupImageView: Component<{ image: EvolutionPopupImage }> = (props) => {
  const [evolved, setEvolved] = createSignal(false);
  const cocoonSrc = `images/effects/cocoon.gif?t=${Date.now()}`;
  const timer = setTimeout(() => setEvolved(true), COCOON_HALF_MS);
  onCleanup(() => clearTimeout(timer));

  return (
    <div class="popup-evolution-img-wrapper">
      <img class="popup-message-img" src={evolved() ? props.image.targetImage : props.image.sourceImage} alt="" />
      <img class="popup-evolution-overlay" src={cocoonSrc} alt="" />
    </div>
  );
};

export default EvolutionPopupImageView;
