import { createSignal, Show, type Component } from 'solid-js';
import type { DialogScript } from './Dialog';

interface DialogBoxProps {
  onComplete: () => void;
  script: DialogScript;
}

const DialogBox: Component<DialogBoxProps> = (props) => {
  const [lineIndex, setLineIndex] = createSignal(0);

  const currentLine = () => props.script[lineIndex()];

  const handleClick = () => {
    if (lineIndex() < props.script.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      props.onComplete();
    }
  };

  return (
    <div class="dialog-box" onClick={handleClick}>
      <div class="dialog-content">
        <div class="dialog-text-area">
          <Show when={currentLine().speaker}>
            <div class="dialog-speaker">{currentLine().speaker}</div>
          </Show>
          <div class="dialog-text">{currentLine().text}</div>
        </div>
        <Show when={currentLine().portrait}>
          <img class="dialog-portrait" src={currentLine().portrait} alt={currentLine().speaker} />
        </Show>
      </div>
      <div class="dialog-prompt">Click to continue...</div>
    </div>
  );
};

export default DialogBox;
