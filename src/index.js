import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "normalize.css";
import {REFRESH_CD} from "./utils/constants";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Prevent refresh for `TIME_ALLOWED` ms.
const isPreventRefresh = {value: true};
window.addEventListener("load", () => {
  setTimeout(() => {
    isPreventRefresh.value = false;
  }, REFRESH_CD);
});
window.addEventListener("beforeunload", (e) => {
  if (isPreventRefresh.value) {
    e.preventDefault();
  }
});

