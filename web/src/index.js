import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import Whiteboard from "./Whiteboard";
import * as serviceWorker from "./serviceWorker";
import Display from "./Display";

ReactDOM.render(
  <React.StrictMode>
    <Display />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
