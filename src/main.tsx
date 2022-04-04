import React from "react";
import ReactDOM from "react-dom";

import { Router, Link } from "@reach/router";

import "./global.css";

import Home from "./Home";
import App from "./pages/apps/app";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Home path="/" />
      <App path="apps/:index" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
