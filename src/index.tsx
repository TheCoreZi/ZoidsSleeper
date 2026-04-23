import { render } from 'solid-js/web';
import App from './App';
import ThemeProvider from './ui/ThemeProvider';
import './index.css';

const root = document.getElementById('root');
render(() => <ThemeProvider><App /></ThemeProvider>, root!);
