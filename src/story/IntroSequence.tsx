import { createSignal, Match, onCleanup, Switch, type Component } from 'solid-js';
import { TICK_TIME } from '../constants';
import { GameLoop } from '../game/GameLoop';
import { DEFAULT_PLAYER } from '../models/Player';
import { getZoidById } from '../models/Zoid';
import { BattleState, setBattleState } from '../store/gameStore';
import BattleScreen from '../ui/BattleScreen';
import DialogBox from '../dialog/DialogBox';
import { IntroBattle } from './IntroBattle';
import IntroText from './IntroText';
import StarterSelect from './StarterSelect';
import { CAPTAIN_DIALOG, CHALLENGE_DIALOG, FAREWELL_DIALOG } from './introScript';
import './story.css';

type IntroStep = 'battle' | 'challenge' | 'dialog' | 'farewell' | 'planet' | 'select';

interface IntroSequenceProps {
  onComplete: (zoidId: string) => void;
}

const IntroSequence: Component<IntroSequenceProps> = (props) => {
  const [step, setStep] = createSignal<IntroStep>('planet');
  let battle: IntroBattle | null = null;
  let loop: GameLoop | null = null;
  let selectedZoidId: string | null = null;

  const handleSelectStarter = (zoidId: string) => {
    selectedZoidId = zoidId;
    setStep('challenge');
  };

  const handleStartBattle = () => {
    battle = new IntroBattle(DEFAULT_PLAYER, selectedZoidId!);
    battle.onVictory = () => {
      loop?.stop();
      setBattleState(BattleState.Idle);
      setStep('farewell');
    };
    loop = new GameLoop(TICK_TIME, () => battle!.gameTick());
    loop.start();
    setBattleState(BattleState.WildCombat);
    setStep('battle');
  };

  onCleanup(() => loop?.stop());

  return (
    <div class="intro-container">
      <Switch>
        <Match when={step() === 'planet'}>
          <IntroText onComplete={() => setStep('dialog')} />
        </Match>
        <Match when={step() === 'dialog'}>
          <DialogBox script={CAPTAIN_DIALOG} onComplete={() => setStep('select')} />
        </Match>
        <Match when={step() === 'select'}>
          <StarterSelect onSelect={handleSelectStarter} />
        </Match>
        <Match when={step() === 'challenge' && selectedZoidId}>
          <DialogBox
            script={CHALLENGE_DIALOG(getZoidById(selectedZoidId!).name)}
            onComplete={handleStartBattle}
          />
        </Match>
        <Match when={step() === 'battle'}>
          <BattleScreen onClick={() => battle?.clickAttack()} />
        </Match>
        <Match when={step() === 'farewell'}>
          <DialogBox script={FAREWELL_DIALOG} onComplete={() => props.onComplete(selectedZoidId!)} />
        </Match>
      </Switch>
    </div>
  );
};

export default IntroSequence;
