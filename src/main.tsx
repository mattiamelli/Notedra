import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {initializeStoredTheme} from './appearance/theme';
import {loadMessages,readLanguage} from './i18n/i18n';
import './index.css';
import './design/product.css';

initializeStoredTheme();
async function start() {
  await loadMessages(readLanguage());
  createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
}
void start();
