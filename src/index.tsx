import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';
import 'normalize.css';
import {REFRESH_CD} from './utils/constants.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// Prevent refresh for `TIME_ALLOWED` ms.
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

