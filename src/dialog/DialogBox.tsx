import { createSignal, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import type { DialogScript } from './Dialog';
import './dialog.css';

interface DialogBoxProps {
  onComplete: () => void;
  script: DialogScript;
}

const DialogBox: Component<DialogBoxProps> = (props) => {
  const [lineIndex, setLineIndex] = createSignal(0);

  const currentLine = () => props.script.lines[lineIndex()];

  const handleClick = () => {
    if (lineIndex() < props.script.lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      props.onComplete();
    }
  };

  return (
    <div class="dialog-box" onClick={handleClick}>
      <div class="dialog-content">
        <div class="dialog-text-area">
          <Show when={currentLine().speakerKey}>
            <div class="dialog-speaker">{t(currentLine().speakerKey)}</div>
          </Show>
          <div class="dialog-text">{t(currentLine().textKey, currentLine().interpolation)}</div>
        </div>
        <Show when={currentLine().portrait}>
          <img class="dialog-portrait" src={currentLine().portrait} alt={t(currentLine().speakerKey)} />
        </Show>
      </div>
      <Show when={currentLine().image}>
        <img class="dialog-image" src={currentLine().image} alt="" />
      </Show>
      <div class="dialog-prompt">{t('ui:click_to_continue')}</div>
    </div>
  );
};

export default DialogBox;
