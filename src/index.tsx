import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Styles
import 'normalize.css';
import './index.css';
import './assets/globals.css';
import './assets/weather-icons.css';
import './assets/weather-icons-wind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// utils
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

