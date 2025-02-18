import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'normalize.css';
import {REFRESH_CD} from './utils/constants.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Prevent refresh for `REFRESH_CD` ms.
const isPreventRefresh = {value: true};
window.addEventListener('load', () => {
  setTimeout(() => {
    isPreventRefresh.value = false;
  }, REFRESH_CD);
});
window.addEventListener('beforeunload', (e) => {
  if (isPreventRefresh.value) {
    e.preventDefault();
  }
});

