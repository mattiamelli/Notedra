import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {initializeStoredTheme} from './appearance/theme';
import './index.css';
import './design/product.css';

initializeStoredTheme();
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
