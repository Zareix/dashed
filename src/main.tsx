import React from "react";
import ReactDOM from "react-dom";

import { Router } from "@reach/router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

import "./global.css";

import Home from "./pages/Home";
import App from "./pages/apps/app";

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Home path="/" />
        <App path="apps/:index" />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
