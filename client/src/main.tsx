import React from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

import "./global.css";

import MainApp from "./MainApp";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find root");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  </React.StrictMode>
);
