import { render } from 'solid-js/web';
import GameRoot from './GameRoot';
import './index.css';

const root = document.getElementById('root');
render(() => <GameRoot />, root!);
