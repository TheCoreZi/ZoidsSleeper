import { createSignal, onCleanup, onMount, Show, type Component } from 'solid-js';
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

  const advance = () => {
    if (lineIndex() < props.script.lines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      props.onComplete();
    }
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Enter') {return;}
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {return;}
    if (e.repeat) {return;}
    advance();
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div class="dialog-box" onClick={advance}>
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
