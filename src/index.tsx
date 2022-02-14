import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./client/App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector("#root")
);
