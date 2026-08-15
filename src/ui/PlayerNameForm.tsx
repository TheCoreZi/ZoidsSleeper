import { createSignal, Show, type Component } from 'solid-js';
import { t } from '../i18n';
import { isValidPlayerName, MAX_PLAYER_NAME_LENGTH, normalizePlayerName } from '../models/Player';
import './player-name.css';

interface PlayerNameFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  submitKey: string;
  titleKey?: string;
}

const PlayerNameForm: Component<PlayerNameFormProps> = (props) => {
  const [name, setName] = createSignal(props.initialName ?? '');
  const normalizedName = () => normalizePlayerName(name());

  const submit = (event: SubmitEvent): void => {
    event.preventDefault();
    if (!isValidPlayerName(name())) {return;}
    props.onSubmit(normalizedName());
  };

  return (
    <form class="player-name-form" onSubmit={submit}>
      <Show when={props.titleKey}>
        <h2 class="player-name-title">{t(props.titleKey!)}</h2>
      </Show>
      <label class="player-name-label" for="player-name">{t('ui:player_name')}</label>
      <input
        autofocus
        class="player-name-input"
        id="player-name"
        maxlength={MAX_PLAYER_NAME_LENGTH}
        onInput={(event) => setName(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' || !isValidPlayerName(name())) {return;}
          event.preventDefault();
          props.onSubmit(normalizedName());
        }}
        placeholder={t('ui:player_name_placeholder')}
        value={name()}
      />
      <span class="player-name-requirements">{t('ui:player_name_requirements', { max: MAX_PLAYER_NAME_LENGTH })}</span>
      <button class="player-name-submit" disabled={!isValidPlayerName(name())} type="submit">
        {t(props.submitKey)}
      </button>
    </form>
  );
};

export default PlayerNameForm;
